import { useFormik } from "formik";
import { useContext, useEffect, useState, useCallback } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import {
  Select,
  Stack,
  Textfield,
  inube,
  useMediaQuery,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import {
  currencyFormat,
  parseCurrencyString,
} from "@utils/formatData/currency";
import { AppContext } from "@context/AppContext";
import {
  IExtraordinaryInstallmentAddSeries,
  IExtraordinaryInstallmentsAddSeries,
  IExtraordinaryInstallment,
} from "@services/prospect/types";
import { IProspect } from "@services/prospect/types";
import { EnumType } from "@hooks/useEnum";
import { searchExtraInstallmentPaymentCyclesByCustomerCode } from "@services/creditLimit/extraInstallmentPaymentCyles/searchExtraInstallmentPaymentCyclesByCustomerCode";
import { CardGray } from "@components/cards/CardGray";
import { addExtraordinaryInstallments } from "@services/prospect/addExtraordinaryInstallments";
import { calculateSeriesForExtraordinaryInstallment } from "@services/creditLimit/calculateSeriesForExtraordinaryInstallment";

import { defaultFrequency, dataAddSeriesModal, frequencyTypes } from "./config";
import { IOption, ICycleOption } from "./types";

export interface AddSeriesModalProps {
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  toggleAddSeriesModal: () => void;
  handleClose: () => void;
  onSubmit: (values: {
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  }) => void;
  lang: EnumType;
  lineOfCreditAbbreviatedName: string;
  moneyDestinationAbbreviatedName: string;
  installmentState?: {
    installmentAmount: number;
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  };
  seriesModal?:
    | IExtraordinaryInstallmentAddSeries[]
    | IExtraordinaryInstallment[];
  sentData?:
    | IExtraordinaryInstallmentsAddSeries
    | Record<string, string | number>
    | null;
  selectedModal?:
    | IExtraordinaryInstallmentAddSeries
    | IExtraordinaryInstallment
    | null;
  prospectData?: IProspect;
  service?: boolean;
  setAddModal?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallmentAddSeries | null>
  >;
  setSeriesModal?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallmentAddSeries[]>
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
  creditRequestCode: string;
  isEdit?: boolean;
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
    setMessageError,
    setShowErrorModal,
    toggleAddSeriesModal,
    creditRequestCode,
  } = props;

  const { businessUnitSigla, eventData } = useContext(AppContext);

  const isMobile = useMediaQuery("(max-width: 700px)");

  const [isLoading, setIsLoading] = useState(false);
  const [dateOptions, setDateOptions] = useState<IOption[]>([]);
  const [cycleOptions, setCycleOptions] = useState<ICycleOption[]>([]);

  const frequencyOptions: IOption[] = [
    { id: defaultFrequency, label: defaultFrequency, value: defaultFrequency },
  ];

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const formik = useFormik({
    initialValues: {
      installmentDate: "",
      installmentAmount: 0,
      paymentChannelAbbreviatedName: "",
      cycleId: "",
      value: "",
      frequency: "",
    },
    onSubmit: (values) => {
      onSubmit?.(values);
    },
  });

  const handleFieldChange = useCallback(
    (name: string, value: string) => {
      formik.setFieldValue(name, value);

      if (name === "installmentDate") {
        if (setInstallmentState) {
          setInstallmentState((prev) => ({
            ...prev,
            installmentDate: value,
          }));
        }
      }
    },
    [formik, setInstallmentState],
  );

  const handleCycleChange = useCallback(
    (__: string, value: string, currentOptions?: ICycleOption[]) => {
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
    },
    [handleFieldChange, cycleOptions, formik, setInstallmentState],
  );

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
    const mainBorrower = prospectData?.borrowers.find(
      (borrower) => borrower.borrowerType === "MainBorrower",
    );
    const fetchCycles = async () => {
      if (
        service &&
        mainBorrower?.borrowerIdentificationNumber &&
        lineOfCreditAbbreviatedName &&
        moneyDestinationAbbreviatedName
      ) {
        try {
          setIsLoading(true);
          const response =
            await searchExtraInstallmentPaymentCyclesByCustomerCode(
              businessUnitPublicCode,
              mainBorrower?.borrowerIdentificationNumber,
              lineOfCreditAbbreviatedName,
              moneyDestinationAbbreviatedName,
            );
          if (response === null) {
            return;
          }
          const flattenedOptions: ICycleOption[] = response.flatMap(
            (agreement) =>
              agreement.extraordinaryCycles.map((cycle) => ({
                id: `${agreement.payrollForDeductionAgreementId}-${cycle.cycleName}`,
                label: `${agreement.abbreviatedName} ${cycle.cycleName}`,
                value: `${agreement.payrollForDeductionAgreementId}-${cycle.cycleName}`,
                paymentDates: cycle.paymentDates,
                extraordinaryCycleType: cycle.extraordinaryCycleType,
                payrollForDeductionAgreementCode:
                  agreement.payrollForDeductionAgreementCode,
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
          const err = error as {
            message?: string;
            status: number;
            data?: { description?: string; code?: string };
          };
          const code = err?.data?.code ? `[${err.data.code}] ` : "";
          const description =
            code + err?.message + (err?.data?.description || "");

          setShowErrorModal(true);
          setMessageError(description);
          toggleAddSeriesModal();
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCycles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    service,
    businessUnitPublicCode,
    lineOfCreditAbbreviatedName,
    moneyDestinationAbbreviatedName,
  ]);

  const handleInstallmentAmountChange = (name: string, value: string) => {
    const parsed = parseCurrencyString(value);
    formik.setFieldValue(name, currencyFormat(parsed, false));
    if (!isNaN(parsed) && setInstallmentState) {
      setInstallmentState((prev) => ({
        ...prev,
        installmentAmount: parsed,
      }));
    }
  };

  const itemIdentifiersForUpdate: IExtraordinaryInstallmentsAddSeries = {
    creditProductCode:
      prospectData?.creditProducts?.[0]?.creditProductCode || "",
    creditRequestCode: creditRequestCode,
    extraordinaryInstallments: [
      {
        installmentAmount: 0,
        installmentDate: "",
        paymentChannelAbbreviatedName: "",
      },
    ],
    prospectId: prospectData?.prospectId || "",
  };

  const handleExtraordinaryInstallment = async (
    extraordinaryInstallments: IExtraordinaryInstallmentsAddSeries,
  ) => {
    try {
      setIsLoading(true);

      await addExtraordinaryInstallments(
        extraordinaryInstallments,
        businessUnitPublicCode,
        eventData.token || "",
        eventData.user.identificationDocumentNumber || "",
      );

      if (extraordinaryInstallments === null) {
        return;
      }
      setSentData?.(extraordinaryInstallments);
      setIsLoading(false);
      handleClose();
    } catch (error: unknown) {
      setIsLoading(false);
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      setShowErrorModal(true);
      setMessageError(description);
    }
  };

  const handleNextClick = async () => {
    if (!installmentState || !setSentData) return;

    const {
      installmentAmount,
      installmentDate,
      paymentChannelAbbreviatedName,
    } = installmentState;

    const count = parseInt(formik.values.value, 10);
    const frequency = formik.values.frequency;
    const mainBorrower = prospectData?.borrowers.find(
      (borrower) => borrower.borrowerType === "MainBorrower",
    );

    if (
      !installmentAmount ||
      !installmentDate ||
      !paymentChannelAbbreviatedName ||
      isNaN(count) ||
      count < 1 ||
      !frequency ||
      !mainBorrower?.borrowerIdentificationType
    )
      return;

    try {
      setIsLoading(true);

      const selectedCycle = cycleOptions.find(
        (option) => option.value === formik.values.cycleId,
      );

      const date = new Date(installmentDate);
      const formattedDate = date.toISOString().split("T")[0].replace(/-/g, "/");

      const calculationBody = {
        amount: count,
        customerCode: mainBorrower?.borrowerIdentificationType,
        cycleName: selectedCycle?.label || "",
        firstDayOfTheCycle: formattedDate,
        installmentFrequency: frequency,
        paymentChannelAbbreviatedName: paymentChannelAbbreviatedName,
        value: installmentAmount,
        payrollForDeductionAgreementCode:
          selectedCycle?.payrollForDeductionAgreementCode || "",
      };

      const calculatedSeries = await calculateSeriesForExtraordinaryInstallment(
        businessUnitPublicCode,
        eventData.token || "",
        eventData.user.identificationDocumentNumber || "",
        calculationBody,
      );

      if (!calculatedSeries) {
        setIsLoading(false);
        return;
      }

      const installments = calculatedSeries.map((series) => ({
        installmentAmount: series.value,
        installmentDate: series.paymentDate,
        paymentChannelAbbreviatedName: series.paymentChannelAbbreviatedName,
      }));

      const updatedValues: IExtraordinaryInstallmentsAddSeries = {
        ...itemIdentifiersForUpdate,
        extraordinaryInstallments: installments,
      };

      await handleExtraordinaryInstallment(updatedValues);
    } catch (error) {
      setIsLoading(false);
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      setShowErrorModal(true);
      setMessageError(description);
    }
  };

  const handleSimpleSubmit = () => {
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

    const installments = [];
    const currentDate = new Date(installmentDate);
    for (let i = 0; i < count; i++) {
      installments.push({
        installmentDate: currentDate.toISOString(),
        paymentChannelAbbreviatedName,
      });

      if (frequency === frequencyTypes.biannual) {
        currentDate.setMonth(currentDate.getMonth() + 6);
      } else if (frequency === frequencyTypes.annual) {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }

    installments.forEach((installment) => {
      onSubmit?.({
        installmentDate: installment.installmentDate,
        paymentChannelAbbreviatedName:
          installment.paymentChannelAbbreviatedName,
      });
    });
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

  useEffect(() => {
    formik.setFieldValue("frequency", defaultFrequency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseModal
      title={dataAddSeriesModal.title.i18n[lang]}
      backButton={dataAddSeriesModal.cancel.i18n[lang]}
      nextButton={dataAddSeriesModal.add.i18n[lang]}
      handleBack={handleClose}
      handleNext={service ? handleNextClick : handleSimpleSubmit}
      handleClose={handleClose}
      width={isMobile ? "280px" : "425px"}
      height="auto"
      finalDivider
      disabledNext={!isFormValid()}
      isSendingData={isLoading}
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
          required
          fullwidth
        />

        <CardGray
          label={dataAddSeriesModal.labelFrequency.i18n[lang]}
          data={frequencyOptions[0].label}
        />

        {dateOptions.length === 1 ? (
          <CardGray
            label={dataAddSeriesModal.labelFrequency.i18n[lang]}
            data={dateOptions[0].label}
          />
        ) : (
          <Select
            name="installmentDate"
            id="installmentDate"
            label={dataAddSeriesModal.labelFrequency.i18n[lang]}
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
