import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import {
  Select,
  Stack,
  Textfield,
  inube,
  useMediaQuery,
  IOption,
} from "@inubekit/inubekit";
import { useIAuth } from "@inube/iauth-react";
import * as Yup from "yup";

import { BaseModal } from "@components/modals/baseModal";
import {
  currencyFormat,
  parseCurrencyString,
} from "@utils/formatData/currency";
import { AppContext } from "@context/AppContext";
import {
  IExtraordinaryInstallment,
  IExtraordinaryInstallments,
  IProspect,
} from "@services/creditRequest/query/ProspectByCode/types";
import { EnumType } from "@hooks/useEnum";
import { searchExtraInstallmentPaymentCyclesByCustomerCode } from "@services/creditLimit/extraInstallmentPaymentCyles/searchExtraInstallmentPaymentCyclesByCustomerCode";
import { CardGray } from "@components/cards/CardGray";
import { calculateSeriesForExtraordinaryInstallment } from "@services/creditLimit/calculateSeriesForExtraordinaryInstallment";
import { ICalculatedSeries } from "@services/creditRequest/query/ProspectByCode/types";
import { ICustomerData } from "@pages/prospect/components/AddProductModal/config";
import { IExtraordinaryInstallmentsAddSeries } from "@services/creditRequest/query/ProspectByCode/types";
import { useErrorHandler, IError } from "@hooks/useErrorHandler";

import { dataAddSeriesModal, defaultFrequency } from "./config";
import { saveExtraordinaryInstallment } from "../ExtraordinaryPaymentModal/utils";
import { ICycleOption } from "./types";

export interface AddSeriesModalProps {
  toggleAddSeriesModal: () => void;
  handleClose: () => void;
  onSubmit: (values: {
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
    value: number;
    abbreviatedName: string;
  }) => void;
  lang: EnumType;
  lineOfCreditAbbreviatedName: string;
  moneyDestinationAbbreviatedName: string;
  installmentState?: {
    installmentAmount: number;
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  };
  seriesModal?: IExtraordinaryInstallment[];
  sentData: IExtraordinaryInstallmentsAddSeries | null;
  selectedModal?: IExtraordinaryInstallment | null;
  prospectData?: IProspect;
  service?: boolean;
  setAddModal?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallment | null>
  >;
  setSeriesModal?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallment[]>
  >;
  setSentData?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallmentsAddSeries | null>
  >;
  setInstallmentState?: React.Dispatch<
    React.SetStateAction<{
      installmentAmount: number;
      installmentDate: string;
      paymentChannelAbbreviatedName: string;
    }>
  >;
  isEdit?: boolean;
  isSimulateCredit?: boolean;
  maxLoanTerm: number;
  customerData: ICustomerData;
  creditRequestCode: string;
}

export function AddSeriesModal(props: AddSeriesModalProps) {
  const {
    prospectData,
    service = true,
    installmentState,
    lang,
    handleClose,
    onSubmit,
    setInstallmentState,
    isEdit = false,
    setSentData,
    lineOfCreditAbbreviatedName,
    moneyDestinationAbbreviatedName,
    toggleAddSeriesModal,
    isSimulateCredit = false,
    maxLoanTerm,
    customerData,
    creditRequestCode,
  } = props;
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const { showErrorModalHandler } = useErrorHandler();
  const { user } = useIAuth();

  const isMobile = useMediaQuery("(max-width: 700px)");

  const [isLoading, setIsLoading] = useState(false);
  const [dateOptions, setDateOptions] = useState<IOption[]>([]);
  const [cycleOptions, setCycleOptions] = useState<ICycleOption[]>([]);

  const frequencyOptions: IOption[] = [
    { id: defaultFrequency, label: defaultFrequency, value: defaultFrequency },
  ];
  const years = Math.floor(maxLoanTerm / 12);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const validationSchema = Yup.object({
    value: Yup.number()
      .required("")
      .positive(dataAddSeriesModal.valueGreater.i18n[lang])
      .max(years, `El valor no puede exceder ${years} Años`),
    installmentAmount: Yup.number()
      .integer(dataAddSeriesModal.valueInteger.i18n[lang])
      .positive(dataAddSeriesModal.valuePositive.i18n[lang]),
  });

  const formik = useFormik({
    initialValues: {
      installmentDate: "",
      installmentAmount: 0,
      paymentChannelAbbreviatedName: "",
      cycleId: "",
      value: "",
      frequency: defaultFrequency,
      abbreviatedName: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit?.({
        installmentDate: values.installmentDate,
        paymentChannelAbbreviatedName: values.paymentChannelAbbreviatedName,
        value: values.installmentAmount,
        abbreviatedName: values.abbreviatedName,
      });
    },
  });

  useEffect(() => {
    if (isEdit && installmentState) {
      formik.setFieldValue(
        "installmentAmount",
        installmentState.installmentAmount || 0,
      );
      formik.setFieldValue(
        "paymentChannelAbbreviatedName",
        installmentState.paymentChannelAbbreviatedName || "",
      );
      formik.setFieldValue(
        "installmentDate",
        installmentState.installmentDate || "",
      );
      formik.setFieldValue("value", "");
      formik.setFieldValue("frequency", "");
    }
  }, [isEdit, installmentState, formik]);

  useEffect(() => {
    const clientIdentificationNumber = customerData.clientIdinteficationNumber;
    const fetchCycles = async () => {
      if (
        service &&
        customerData.clientIdinteficationNumber &&
        lineOfCreditAbbreviatedName &&
        moneyDestinationAbbreviatedName &&
        clientIdentificationNumber
      ) {
        try {
          setIsLoading(true);
          const response =
            await searchExtraInstallmentPaymentCyclesByCustomerCode(
              businessUnitPublicCode,
              clientIdentificationNumber,
              lineOfCreditAbbreviatedName,
              moneyDestinationAbbreviatedName,
              eventData.token,
            );

          if (response === null) {
            return;
          }

          const flattenedOptions: ICycleOption[] = response.flatMap(
            (agreement) =>
              agreement.extraordinaryCycles.map((cycle) => ({
                id: `${agreement.payrollForDeductionAgreementId}-${cycle.cycleName}`,
                label: `${cycle.cycleName}`,
                value: `${agreement.payrollForDeductionAgreementId}-${cycle.cycleName}`,
                paymentDates: cycle.paymentDates,
                extraordinaryCycleType: cycle.extraordinaryCycleType,
                cycleName: cycle.cycleName,
                agreementCode: agreement.payrollForDeductionAgreementCode,
                payingEntityName: agreement.payingEntityName,
              })),
          );

          setCycleOptions(flattenedOptions);

          if (flattenedOptions.length === 1) {
            formik.setFieldValue(
              "paymentChannelAbbreviatedName",
              flattenedOptions[0].id,
            );
            handleCycleChange(
              "paymentChannelAbbreviatedName",
              flattenedOptions[0].id,
              flattenedOptions,
            );
          }

          if (flattenedOptions.length === 1) {
            handleCycleChange(
              "cycleId",
              flattenedOptions[0].id,
              flattenedOptions,
            );
          }
        } catch (error) {
          showErrorModalHandler(error as IError);
          toggleAddSeriesModal();
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCycles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prospectData, service]);

  const handleFieldChange = (name: string, value: string) => {
    formik.setFieldValue(name, value);

    if (name === "installmentDate") {
      if (setInstallmentState) {
        setInstallmentState((prev) => ({
          ...prev,
          installmentDate: value,
        }));
      }
    }
  };

  const handleInstallmentAmountChange = (name: string, value: string) => {
    const parsed = parseCurrencyString(value);
    formik.setFieldValue(name, parsed);
    if (!isNaN(parsed) && setInstallmentState) {
      setInstallmentState((prev) => ({
        ...prev,
        installmentAmount: parsed,
      }));
    }
  };

  const handleCycleChange = (
    __: string,
    value: string,
    currentOptions?: ICycleOption[],
  ) => {
    const options = currentOptions || cycleOptions;
    const selectedCycle = options.find((opt) => opt.value === value);

    formik.setFieldValue("cycleId", value);

    if (selectedCycle) {
      formik.setFieldValue(
        "paymentChannelAbbreviatedName",
        selectedCycle.extraordinaryCycleType,
      );

      const newDateOptions = selectedCycle.paymentDates.map((date) => ({
        id: date,
        label: new Date(date)
          .toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          })
          .toLowerCase(),
        value: date,
      }));

      setDateOptions(newDateOptions);

      if (setInstallmentState) {
        setInstallmentState((prev) => ({
          ...prev,
          paymentChannelAbbreviatedName: selectedCycle.extraordinaryCycleType,
        }));
      }

      if (newDateOptions.length === 1) {
        handleFieldChange("installmentDate", newDateOptions[0].value);
      } else {
        formik.setFieldValue("installmentDate", "");
      }
    } else {
      setDateOptions([]);
      formik.setFieldValue("installmentDate", "");
    }
  };

  const handleExtraordinaryInstallment = async (
    extraordinaryInstallments: Record<string, string | number>,
  ) => {
    try {
      setIsLoading(true);

      const calculateInstallments =
        await calculateSeriesForExtraordinaryInstallment(
          businessUnitPublicCode,
          eventData.token,
          user.id,
          extraordinaryInstallments,
        );

      const formattedInstallments = (calculateInstallments || []).map(
        (item) => ({
          installmentAmount: item.value,
          installmentDate: item.paymentDate,
          paymentChannelAbbreviatedName: item.paymentChannelAbbreviatedName,
        }),
      );

      const saveBody: IExtraordinaryInstallments = {
        creditRequestCode,
        extraordinaryInstallments: formattedInstallments,
      };

      const newExtraordinaryInstallments = await saveExtraordinaryInstallment(
        businessUnitPublicCode,
        saveBody,
        eventData.token,
      );

      setSentData?.(
        newExtraordinaryInstallments as IExtraordinaryInstallmentsAddSeries,
      );
      setIsLoading(false);
      handleClose();
    } catch (error) {
      setIsLoading(false);
      showErrorModalHandler(error as IError);
    }
  };

  const handleNextClick = () => {
    if (!installmentState || !setSentData) return;

    const {
      installmentAmount,
      installmentDate,
      paymentChannelAbbreviatedName,
    } = installmentState;

    const count = parseInt(formik.values.value, 10);
    const frequency = formik.values.frequency;

    if (
      !installmentAmount ||
      !installmentDate ||
      !paymentChannelAbbreviatedName ||
      isNaN(count) ||
      count < 1 ||
      !frequency
    )
      return;

    const installments = [];
    const currentDate = new Date(installmentDate);
    for (let i = 0; i < count; i++) {
      installments.push({
        installmentAmount,
        installmentDate: currentDate.toISOString(),
        paymentChannelAbbreviatedName,
      });
      if (frequency === "Semestral") {
        currentDate.setMonth(currentDate.getMonth() + 6);
      } else if (frequency === "Anual") {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }

    const selectedCycle = cycleOptions.find(
      (option) => option.value === formik.values.cycleId,
    );

    const formattedDate = installmentDate.split("T")[0].replace(/-/g, "/");

    const requestBody: Record<string, string | number> = {
      customerCode: customerData.clientIdinteficationNumber,
      cycleName: selectedCycle?.cycleName || "",
      firstDayOfTheCycle: formattedDate,
      amount: count,
      installmentFrequency: frequency,
      paymentChannelAbbreviatedName: paymentChannelAbbreviatedName,
      value: installmentAmount,
      payrollForDeductionAgreementCode: selectedCycle?.agreementCode || "",
    };

    handleExtraordinaryInstallment(requestBody);
  };

  const handleSimpleSubmit = async () => {
    if (!installmentState) return;

    const {
      installmentAmount,
      installmentDate,
      paymentChannelAbbreviatedName,
    } = installmentState;

    if (isEdit) {
      if (
        !installmentAmount ||
        !installmentDate ||
        !paymentChannelAbbreviatedName
      )
        return;

      onSubmit?.({
        installmentDate: installmentDate,
        paymentChannelAbbreviatedName: paymentChannelAbbreviatedName,
        value: installmentAmount,
        abbreviatedName: paymentChannelAbbreviatedName,
      });
      return;
    }

    const count = parseInt(formik.values.value, 10);
    const frequency = formik.values.frequency;

    if (
      !installmentAmount ||
      !installmentDate ||
      !paymentChannelAbbreviatedName ||
      isNaN(count) ||
      count < 1 ||
      !frequency
    ) {
      return;
    }

    const cycleNameRaw = formik.values.cycleId
      ? formik.values.cycleId.split("-").pop()
      : "";

    const selectedCycle = cycleOptions.find(
      (option) => option.value === formik.values.cycleId,
    );

    const formattedDate = installmentDate.split("T")[0].replace(/-/g, "/");

    const requestBody: Record<string, string | number> = {
      customerCode: customerData.clientIdinteficationNumber,
      cycleName: cycleNameRaw || "",
      firstDayOfTheCycle: formattedDate,
      amount: count,
      installmentFrequency: frequency,
      paymentChannelAbbreviatedName: paymentChannelAbbreviatedName,
      value: installmentAmount,
      payrollForDeductionAgreementCode: selectedCycle?.agreementCode || "",
    };

    try {
      setIsLoading(true);

      const response = await calculateSeriesForExtraordinaryInstallment(
        businessUnitPublicCode,
        eventData.token,
        eventData?.user?.identificationDocumentNumber || "",
        requestBody,
      );

      if (response && Array.isArray(response)) {
        response.forEach((item: ICalculatedSeries) => {
          onSubmit?.({
            installmentDate: item.paymentDate,
            paymentChannelAbbreviatedName:
              item.cycleName || item.paymentChannelAbbreviatedName,
            value: item.value,
            abbreviatedName: item.paymentChannelAbbreviatedName,
          });
        });
      }

      handleClose();
    } catch (error) {
      showErrorModalHandler(error as IError);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (isEdit) {
      return (
        installmentState?.paymentChannelAbbreviatedName &&
        installmentState?.installmentAmount &&
        installmentState?.installmentAmount > 0 &&
        installmentState?.installmentDate
      );
    }

    const count = parseInt(formik.values.value, 10);

    return (
      installmentState?.paymentChannelAbbreviatedName &&
      installmentState?.installmentAmount &&
      installmentState?.installmentAmount > 0 &&
      installmentState?.installmentDate &&
      formik.values.frequency &&
      !isNaN(count) &&
      count > 0
    );
  };

  return (
    <BaseModal
      title={dataAddSeriesModal.title.i18n[lang]}
      backButton={dataAddSeriesModal.cancel.i18n[lang]}
      nextButton={dataAddSeriesModal.add.i18n[lang]}
      handleBack={handleClose}
      handleNext={!isSimulateCredit ? handleNextClick : handleSimpleSubmit}
      handleClose={handleClose}
      width={isMobile ? "280px" : "425px"}
      height="auto"
      finalDivider
      disabledNext={!isFormValid()}
      isLoading={isLoading}
    >
      <Stack gap="24px" direction="column">
        {cycleOptions.length === 1 ? (
          <CardGray
            label={dataAddSeriesModal.labelPaymentMethod.i18n[lang]}
            data={cycleOptions[0].label}
          />
        ) : (
          <Select
            name="cycleId"
            id="cycleId"
            label={dataAddSeriesModal.labelPaymentMethod.i18n[lang]}
            placeholder={dataAddSeriesModal.placeHolderSelect.i18n[lang]}
            options={cycleOptions}
            value={formik.values.cycleId}
            onChange={(name, value) => handleCycleChange(name, value)}
            size="wide"
            fullwidth
            required
          />
        )}

        {!isEdit && (
          <Textfield
            name="value"
            id="value"
            label={dataAddSeriesModal.labelAmount.i18n[lang]}
            placeholder={dataAddSeriesModal.placeHolderAmount.i18n[lang]}
            type="number"
            onChange={formik.handleChange}
            value={formik.values.value}
            message={formik.errors.value}
            status={formik.errors.value ? "invalid" : "pending"}
            fullwidth
            required
          />
        )}

        <Textfield
          name="installmentAmount"
          id="installmentAmount"
          label={dataAddSeriesModal.labelValue.i18n[lang]}
          placeholder={dataAddSeriesModal.placeHolderValue.i18n[lang]}
          iconBefore={<MdOutlineAttachMoney color={inube.palette.green.G400} />}
          onChange={(event) =>
            handleInstallmentAmountChange(
              "installmentAmount",
              event.target.value,
            )
          }
          value={
            installmentState?.installmentAmount
              ? currencyFormat(installmentState.installmentAmount, false)
              : ""
          }
          message={
            formik.touched.installmentAmount && formik.errors.installmentAmount
              ? formik.errors.installmentAmount
              : ""
          }
          status={
            formik.touched.installmentAmount && formik.errors.installmentAmount
              ? "invalid"
              : "pending"
          }
          required
          fullwidth
        />

        <CardGray
          label={dataAddSeriesModal.labelFrequency.i18n[lang]}
          data={frequencyOptions[0].label}
        />

        {dateOptions.length === 1 ? (
          <CardGray
            label={dataAddSeriesModal.labelDate.i18n[lang]}
            data={dateOptions[0].label}
          />
        ) : (
          <Select
            name="installmentDate"
            id="installmentDate"
            label={dataAddSeriesModal.labelDate.i18n[lang]}
            placeholder={dataAddSeriesModal.placeHolderSelect.i18n[lang]}
            options={dateOptions}
            value={formik.values.installmentDate}
            onChange={(name, value) => handleFieldChange(name, value)}
            size="wide"
            required
            fullwidth
            disabled={!dateOptions.length}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
