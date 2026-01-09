import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
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
  handleChangeWithCurrency,
  parseCurrencyString,
} from "@utils/formatData/currency";
import {
  frequencyOptionsMock,
  paymentDateOptionsMock,
  paymentMethodOptionsMock,
} from "@mocks/prospect/extraordinaryInstallment.mock";
import { AppContext } from "@context/AppContext";
import {
  IExtraordinaryInstallment,
  IExtraordinaryInstallments,
} from "@services/prospect/types";
import { IProspect } from "@services/prospect/types";
import { ErrorModal } from "../ErrorModal";

import { dataAddSeriesModal, errorMessages } from "./config";
import { updateExtraordinaryInstallment } from "../ExtraordinaryPaymentModal/utils";

export interface AddSeriesModalProps {
  handleClose: () => void;
  onSubmit: (values: {
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  }) => void;
  installmentState?: {
    installmentAmount: number;
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  };
  seriesModal?: IExtraordinaryInstallment[];
  setAddModal?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallment | null>
  >;
  setSeriesModal?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallment[]>
  >;
  setSentData?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  setInstallmentState?: React.Dispatch<
    React.SetStateAction<{
      installmentAmount: number;
      installmentDate: string;
      paymentChannelAbbreviatedName: string;
    }>
  >;
  sentData?: IExtraordinaryInstallments | null;
  selectedModal?: IExtraordinaryInstallment | null;
  prospectData?: IProspect;
  creditRequestCode: string | undefined;
}

export function AddSeriesModal(props: AddSeriesModalProps) {
  const {
    handleClose,
    onSubmit,
    seriesModal,
    setSentData,
    setAddModal,
    installmentState,
    setInstallmentState,
    prospectData,
    creditRequestCode,
  } = props;

  const { businessUnitSigla } = useContext(AppContext);

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isMobile = useMediaQuery("(max-width: 700px)");

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const formik = useFormik({
    initialValues: {
      installmentDate: "",
      installmentAmount: 0,
      paymentChannelAbbreviatedName: "",
      value: "",
      frequency: "",
    },
    onSubmit: (values) => {
      onSubmit?.(values);
    },
  });

  const getOptionLabel = (
    options: { id?: string; value?: string; label?: string }[],
    value: string
  ) => {
    const option = options?.find(
      (opt) => opt.id === value || opt.value === value
    );
    return option?.label || option?.value || value;
  };

  useEffect(() => {
    if (paymentMethodOptionsMock && paymentMethodOptionsMock.length === 1) {
      const singleOption = paymentMethodOptionsMock[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.paymentChannelAbbreviatedName && optionValue) {
        formik.setFieldValue("paymentChannelAbbreviatedName", optionValue);
        if (setInstallmentState) {
          setInstallmentState((prev) => ({
            ...prev,
            paymentChannelAbbreviatedName: optionValue,
          }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (frequencyOptionsMock && frequencyOptionsMock.length === 1) {
      const singleOption = frequencyOptionsMock[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.frequency && optionValue) {
        formik.setFieldValue("frequency", optionValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paymentDateOptionsMock && paymentDateOptionsMock.length === 1) {
      const singleOption = paymentDateOptionsMock[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.installmentDate && optionValue) {
        formik.setFieldValue("installmentDate", optionValue);
        const parsedDate = new Date(optionValue);
        const isValidDate = !isNaN(parsedDate.getTime());
        const dateString = isValidDate ? parsedDate.toISOString() : "";
        if (setInstallmentState) {
          setInstallmentState((prev) => ({
            ...prev,
            installmentDate: dateString,
          }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFieldChange = (name: string, value: string) => {
    formik.setFieldValue(name, value);

    if (name === "installmentDate") {
      const parsedDate = new Date(value);
      const isValidDate = !isNaN(parsedDate.getTime());
      const dateString = isValidDate ? parsedDate.toISOString() : "";
      const selected = seriesModal?.find((s) => s.installmentDate === value);

      if (selected && setAddModal && setInstallmentState) {
        setAddModal(selected);
        setInstallmentState((prev) => ({
          ...prev,
          installmentDate: (dateString || selected.installmentDate) ?? "",
        }));
      } else if (setInstallmentState) {
        setInstallmentState((prev) => ({
          ...prev,
          installmentDate: dateString,
        }));
      }
    }

    if (name === "paymentChannelAbbreviatedName" && setInstallmentState) {
      setInstallmentState((prev) => ({
        ...prev,
        paymentChannelAbbreviatedName: value,
      }));
    }
  };

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

  const initialValues: IExtraordinaryInstallments = {
    creditProductCode:
      prospectData?.creditProducts?.[0]?.creditProductCode || "",
    extraordinaryInstallments: [
      {
        installmentAmount: 0,
        installmentDate: "",
        paymentChannelAbbreviatedName: "",
      },
    ],
    creditRequestCode: creditRequestCode || "",
  };

  const handleExtraordinaryInstallment = async (
    extraordinaryInstallments: IExtraordinaryInstallments
  ) => {
    try {
      await updateExtraordinaryInstallment(
        businessUnitPublicCode,
        extraordinaryInstallments
      );

      setSentData?.(extraordinaryInstallments);
      handleClose();
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      setErrorMessage(
        `${errorMessages.saveExtraordinaryInstallments.description} ${description}`
      )
      setErrorModal(true);
    }
  };

  const handleNextClick = () => {
    if (!installmentState || !setSentData) return;

    const {
      installmentAmount,
      installmentDate,
      paymentChannelAbbreviatedName,
    } = installmentState;

    if (
      !installmentAmount ||
      !installmentDate ||
      !paymentChannelAbbreviatedName
    )
      return;

    const updatedValues: IExtraordinaryInstallments = {
      ...initialValues,
      extraordinaryInstallments: [
        {
          ...initialValues.extraordinaryInstallments[0],
          installmentDate,
          installmentAmount,
          paymentChannelAbbreviatedName,
        },
      ],
    };

    handleExtraordinaryInstallment(updatedValues);
  };

  return (
    <>
      <BaseModal
        title={dataAddSeriesModal.title}
        backButton={dataAddSeriesModal.cancel}
        nextButton={dataAddSeriesModal.add}
        handleBack={handleClose}
        handleNext={handleNextClick}
        handleClose={handleClose}
        width={isMobile ? "360px" : "425px"}
        height={isMobile ? "auto" : "639px"}
        finalDivider
        disabledNext={
          !installmentState?.paymentChannelAbbreviatedName ||
          !installmentState?.installmentAmount ||
          !installmentState?.installmentDate
        }
      >
        <Stack gap="24px" direction="column">
          {paymentMethodOptionsMock && paymentMethodOptionsMock.length === 1 ? (
            <Textfield
              name="paymentChannelAbbreviatedName"
              id="paymentChannelAbbreviatedName"
              label={dataAddSeriesModal.labelPaymentMethod}
              value={getOptionLabel(
                paymentMethodOptionsMock,
                formik.values.paymentChannelAbbreviatedName
              )}
              disabled
              size="wide"
              fullwidth
              required
            />
          ) : (
            <Select
              name="paymentChannelAbbreviatedName"
              id="paymentChannelAbbreviatedName"
              label={dataAddSeriesModal.labelPaymentMethod}
              placeholder={dataAddSeriesModal.placeHolderSelect}
              options={paymentMethodOptionsMock}
              value={formik.values.paymentChannelAbbreviatedName}
              onChange={(name, value) => handleFieldChange(name, value)}
              size="wide"
              fullwidth
              required
            />
          )}

          <Textfield
            name="value"
            id="value"
            label={dataAddSeriesModal.labelAmount}
            placeholder={dataAddSeriesModal.placeHolderAmount}
            onChange={(e) => {
              handleChangeWithCurrency(
                { setFieldValue: formik.setFieldValue },
                e
              );
            }}
            value={formik.values.value}
            size="wide"
            fullwidth
          />

          <Textfield
            name="installmentAmount"
            id="installmentAmount"
            label={dataAddSeriesModal.labelValue}
            placeholder={dataAddSeriesModal.placeHolderValue}
            iconBefore={<MdOutlineAttachMoney color={inube.palette.green.G400} />}
            onChange={(e) =>
              handleInstallmentAmountChange("installmentAmount", e.target.value)
            }
            value={
              installmentState?.installmentAmount &&
                installmentState.installmentAmount > 0
                ? currencyFormat(installmentState.installmentAmount, false)
                : ""
            }
            required
            fullwidth
          />

          {frequencyOptionsMock && frequencyOptionsMock.length === 1 ? (
            <Textfield
              name="frequency"
              id="frequency"
              label={dataAddSeriesModal.labelFrequency}
              value={getOptionLabel(
                frequencyOptionsMock,
                formik.values.frequency
              )}
              disabled
              size="wide"
              fullwidth
            />
          ) : (
            <Select
              name="frequency"
              id="frequency"
              label={dataAddSeriesModal.labelFrequency}
              placeholder={dataAddSeriesModal.placeHolderSelect}
              options={frequencyOptionsMock}
              value={formik.values.frequency}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              size="wide"
              fullwidth
            />
          )}

          {paymentDateOptionsMock && paymentDateOptionsMock.length === 1 ? (
            <Textfield
              name="installmentDate"
              id="installmentDate"
              label={dataAddSeriesModal.labelDate}
              value={getOptionLabel(
                paymentDateOptionsMock,
                formik.values.installmentDate
              )}
              disabled
              size="wide"
              fullwidth
              required
            />
          ) : (
            <Select
              name="installmentDate"
              id="installmentDate"
              label={dataAddSeriesModal.labelDate}
              placeholder={dataAddSeriesModal.placeHolderSelect}
              options={paymentDateOptionsMock}
              value={formik.values.installmentDate}
              onChange={(name, value) => handleFieldChange(name, value)}
              size="wide"
              required
              fullwidth
            />
          )}
        </Stack>
      </BaseModal>
      {
        errorModal && (
          <ErrorModal
            isMobile={isMobile}
            message={errorMessage}
            handleClose={() => {
              setErrorModal(false)
            }}
          />
        )
      }
    </>
  );
}
