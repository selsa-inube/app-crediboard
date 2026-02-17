import { Formik, FormikValues, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { MdAttachMoney, MdPercent } from "react-icons/md";
import {
  Stack,
  Icon,
  useMediaQuery,
  Select,
  Textfield,
} from "@inubekit/inubekit";
import { useState, useEffect, useContext, useMemo } from "react";

import { BaseModal } from "@components/modals/baseModal";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { getPaymentMethods } from "@services/creditLimit/getPaymentMethods";
import { IPaymentMethod } from "@services/creditLimit/getPaymentMethods/types";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { IProspect } from "@services/prospect/types";
import { updateCreditProduct } from "@services/prospect/updateCreditProduct";
import { validateIncrement } from "@services/prospect/validateIncrement";
import { IValidateIncrementRequest } from "@services/prospect/validateIncrement/types";
import { ErrorModal } from "@components/modals/ErrorModal";
import { TruncatedText } from "@components/modals/TruncatedTextModal";
import { useEnum } from "@hooks/useEnum";
import { validateCurrencyFieldTruncate } from "@utils/formatData/currency";
import { CardGray } from "@components/cards/CardGray";
import { capitalizeFirstLetter } from "@utils/formatData/text";
import { getCreditLineGeneralTerms } from "@services/lineOfCredit/generalTerms/getCreditLineGeneralTerms";
import { CreditLineGeneralTerms } from "@services/lineOfCredit/types";

import { ScrollableContainer } from "./styles";
import { areValuesEqual } from "./utils";
import {
  termInMonthsOptions,
  paymentCycleMap,
  editProductModalLabels,
  defaultPaymentOptions,
  validationMessagesEnum,
  REPAYMENT_STRUCTURES_WITH_INCREMENT,
  fieldLabelsEnum,
  fieldPlaceholdersEnum,
  errorMessagesEnum,
  simulationFormLabels,
  IUpdateProductPayload,
} from "./config";
import { AppContext } from "@context/AppContext";

interface EditProductModalProps {
  onCloseModal: () => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  moneyDestination: string;
  creditRequestCode: string;
  prospectId: string;
  onProspectUpdate: (prospect: IProspect) => void;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  clientIdentificationNumber: string;
  creditProductCode: string;
}

function EditProductModal(props: EditProductModalProps) {
  const {
    onCloseModal,
    title,
    confirmButtonText,
    initialValues,
    iconAfter,
    businessUnitPublicCode,
    businessManagerCode,
    moneyDestination,
    clientIdentificationNumber,
    creditRequestCode,
    prospectId,
    onProspectUpdate,
    creditProductCode,
  } = props;
  const { lang, enums } = useEnum();

  const [showIncrementField, setShowIncrementField] = useState<boolean>(false);
  const [incrementType, setIncrementType] = useState<
    "value" | "percentage" | null
  >(null);
  const [incrementValue, setIncrementValue] = useState<string>("");
  const { eventData } = useContext(AppContext);
  const [incrementError, setIncrementError] = useState<string>("");
  const [isValidatingIncrement, setIsValidatingIncrement] =
    useState<boolean>(false);
  const [creditAmountModified, setCreditAmountModified] =
    useState<boolean>(false);
  const [termInMonthsModified, setTermInMonthsModified] =
    useState<boolean>(false);
  const [loanAmountError, setLoanAmountError] = useState<string>("");
  const [isUsingServices, setIsUsingServices] = useState<boolean>(false);
  const [paymentMethodsList, setPaymentMethodsList] = useState<
    IPaymentMethod[]
  >([]);

  const [loanTermError, setLoanTermError] = useState<string>("");
  const [interestRateError, setInterestRateError] = useState<string>("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generalTerms, setGeneralTerms] =
    useState<CreditLineGeneralTerms | null>(null);
  const [allowedRateCodes, setAllowedRateCodes] = useState<string[]>([]);

  const isMobile = useMediaQuery("(max-width: 550px)");

  useEffect(() => {
    const loadPaymentOptions = async () => {
      try {
        const [paymentResponse, terms, rateDecisions] = await Promise.all([
          getPaymentMethods(
            businessUnitPublicCode,
            businessManagerCode,
            clientIdentificationNumber,
            eventData.token,
          ),
          getCreditLineGeneralTerms(
            businessUnitPublicCode,
            businessManagerCode,
            clientIdentificationNumber,
            eventData.token,
            initialValues.creditLine,
            moneyDestination,
          ),
          postBusinessUnitRules(
            businessUnitPublicCode,
            businessManagerCode,
            {
              ruleName: "InterestRateType",
              conditions: [
                { condition: "LineOfCredit", value: initialValues.creditLine },
              ],
            },
            eventData.token || "",
          ),
        ]);

        if (paymentResponse) {
          setPaymentMethodsList(paymentResponse.paymentMethods);
        }

        if (terms) {
          setGeneralTerms(terms);
        }

        if (
          Array.isArray(rateDecisions) &&
          rateDecisions[0]?.value &&
          typeof rateDecisions[0].value === "string"
        ) {
          setAllowedRateCodes(rateDecisions[0].value.split(","));
        }
      } catch (error) {
        setPaymentMethodsList(defaultPaymentOptions);
        paymentMethodsList;
      }
    };

    loadPaymentOptions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    businessUnitPublicCode,
    businessManagerCode,
    initialValues.creditLine,
    lang,
  ]);

  const amortizationTypesList = useMemo(() => {
    if (!enums?.RepaymentStructure || !generalTerms) return [];

    return enums.RepaymentStructure.filter((item) =>
      generalTerms.amortizationType.includes(item.code),
    ).map((item) => ({
      id: item.code,
      value: item.code,
      label: item.i18n[lang] || item.description || item.code,
    }));
  }, [enums, lang, generalTerms]);

  const rateTypesList = useMemo(() => {
    if (!enums?.InterestRateType) return [];

    return enums.InterestRateType.filter(
      (item) =>
        allowedRateCodes.length === 0 || allowedRateCodes.includes(item.code),
    ).map((item) => ({
      id: item.code,
      value: item.code,
      label: item.i18n[lang] || item.description || item.code,
    }));
  }, [enums, lang, allowedRateCodes]);

  const isLoading = !enums;

  const isCreditAmountDisabled = (): boolean => {
    return termInMonthsModified;
  };

  const isTermInMonthsDisabled = (): boolean => {
    return creditAmountModified;
  };

  const handleSelectChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    name: string,
    value: string,
  ) => {
    formik.setFieldValue(name, value);
    if (fieldName === "termInMonths") {
      if (value !== initialValues[name]) {
        setTermInMonthsModified(true);
        validateLoanTerm(Number(value));
      } else {
        setTermInMonthsModified(false);
        setLoanTermError("");
      }
    }
  };

  const handleTextChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    formik.handleChange(event);

    const newValue = event.target.value;
    const initialValue = initialValues[fieldName];

    const newNumericValue = Number(newValue);
    const initialNumericValue = Number(initialValue);

    if (fieldName === "interestRate") {
      if (newValue === "" || newNumericValue === initialNumericValue) {
        setInterestRateError("");
      } else {
        const numericValue = Number(newValue);
        const currentAmount = Number(formik.values.creditAmount) || 0;
        const currentTerm = Number(formik.values.termInMonths) || 0;

        if (numericValue >= 0 && currentAmount >= 0 && currentTerm >= 0) {
          validateInterestRate(numericValue);
        } else {
          setInterestRateError("");
        }
      }
    }
  };

  const validateLoanAmount = (amount: number): void => {
    if (!generalTerms) return;
    setLoanAmountError("");

    const { minAmount, maxAmount } = generalTerms;
    if (amount < minAmount || amount > maxAmount) {
      const message =
        editProductModalLabels.validationMessages.loanAmountRange.i18n[lang]
          .replace("{amount}", amount.toLocaleString())
          .replace("{from}", minAmount.toLocaleString())
          .replace("{to}", maxAmount.toLocaleString());
      setLoanAmountError(message);
    }
  };

  const validateLoanTerm = (term: number): void => {
    if (!generalTerms) return;
    setLoanTermError("");

    const { minTerm, maxTerm } = generalTerms;
    if (term < minTerm || term > maxTerm) {
      const message = validationMessagesEnum.loanTermOutOfRange.i18n[lang]
        .replace("{min}", minTerm.toString())
        .replace("{max}", maxTerm.toString())
        .replace("{term}", term.toString());
      setLoanTermError(message);
    }
  };

  const validateInterestRate = (rate: number): void => {
    if (!generalTerms) return;
    setInterestRateError("");

    const { minEffectiveInterestRate, maxEffectiveInterestRate } = generalTerms;
    if (rate < minEffectiveInterestRate || rate > maxEffectiveInterestRate) {
      const message = validationMessagesEnum.interestRateOutOfRange.i18n[lang]
        .replace("{min}", minEffectiveInterestRate.toString())
        .replace("{max}", maxEffectiveInterestRate.toString())
        .replace("{rate}", rate.toString());
      setInterestRateError(message);
    }
  };

  const handleCurrencyChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChangeWithCurrency(formik, event);
    const rawValue = event.target.value
      .replace(/[$. ]/g, "")
      .replace(/,/g, ".")
      .trim();
    const numericValue = Number(rawValue);

    if (numericValue !== initialValues.creditAmount && numericValue > 0) {
      setCreditAmountModified(true);
      validateLoanAmount(numericValue);
    } else {
      setCreditAmountModified(false);
      setLoanAmountError("");
    }
  };

  const handleSelectFocus = (fieldId: string) => {
    setTimeout(() => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, 100);
  };

  const handleConfirm = async (values: FormikValues) => {
    if (!creditRequestCode || !prospectId) {
      return;
    }

    try {
      const payload: IUpdateProductPayload = {
        creditProductCode: creditProductCode,
        creditRequestCode: creditRequestCode,
      };

      let hasChanges = false;

      if (!areValuesEqual(values.interestRate, initialValues.interestRate, 4)) {
        payload.interestRate = Number(values.interestRate);
        hasChanges = true;
      }

      if (!areValuesEqual(values.termInMonths, initialValues.termInMonths, 0)) {
        payload.loanTerm = Number(values.termInMonths);
        hasChanges = true;
      }

      if (!areValuesEqual(values.creditAmount, initialValues.creditAmount, 2)) {
        payload.loanAmount = Number(values.creditAmount);
        hasChanges = true;
      }

      if (!hasChanges) {
        onCloseModal();
        return;
      }

      setIsUsingServices(true);

      setIsUsingServices(true);
      const updatedProspect = await updateCreditProduct(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
        eventData?.token || "",
        eventData.user.identificationDocumentNumber || "",
      );

      if (!updatedProspect) {
        throw new Error(errorMessagesEnum.updateCreditProduct.i18n[lang]);
      }
      const normalizedProspect = {
        ...updatedProspect,
        creditProducts: updatedProspect!.creditProducts?.map((product) => ({
          ...product,
          schedule: product.schedule || product.installmentFrequency,
        })),
      };

      onProspectUpdate(normalizedProspect as IProspect);

      setIsUsingServices(false);
      onCloseModal();
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");

      setIsUsingServices(false);
      setErrorMessage(description);
      setErrorModal(true);
    }
  };

  const handleAmortizationTypeChange = (
    formik: FormikProps<FormikValues>,
    name: string,
    value: string,
  ) => {
    formik.setFieldValue(name, value);

    if (value === REPAYMENT_STRUCTURES_WITH_INCREMENT.VALUE_INCREMENT) {
      setShowIncrementField(true);
      setIncrementType("value");
      setIncrementValue("");
      setIncrementError("");
    } else if (
      value === REPAYMENT_STRUCTURES_WITH_INCREMENT.PERCENTAGE_INCREMENT
    ) {
      setShowIncrementField(true);
      setIncrementType("percentage");
      setIncrementValue("");
      setIncrementError("");
    } else {
      setShowIncrementField(false);
      setIncrementType(null);
      setIncrementValue("");
      setIncrementError("");
    }
  };

  const validateIncrementValue = async (
    value: string,
    formik: FormikProps<FormikValues>,
  ): Promise<void> => {
    if (!incrementType || !value) {
      setIncrementError("");
      return;
    }

    setIsValidatingIncrement(true);

    try {
      const numericValue = Number(value.replace(/[^0-9.]/g, ""));

      if (isNaN(numericValue) || numericValue <= 0) {
        setIncrementError(
          editProductModalLabels.validationMessages.incrementMustBePositive
            .i18n[lang],
        );
        return;
      }

      const payload: IValidateIncrementRequest = {
        lineOfCredit: initialValues.creditLine,
        moneyDestination: moneyDestination,
        amortizationType: formik.values.amortizationType,
        incrementType: incrementType as "value" | "percentage",
        incrementValue: numericValue,
        loanAmount: Number(formik.values.creditAmount) || 0,
      };

      const response = await validateIncrement(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (!response.isValid) {
        if (incrementType === "value") {
          const message =
            editProductModalLabels.validationMessages.incrementValueRange.i18n[
              lang
            ]
              .replace("{min}", response.minValue.toLocaleString())
              .replace("{max}", response.maxValue.toLocaleString());

          setIncrementError(message);
        } else {
          const message =
            editProductModalLabels.validationMessages.incrementPercentageRange.i18n[
              lang
            ]
              .replace("{min}", response.minValue.toLocaleString())
              .replace("{max}", response.maxValue.toLocaleString());

          setIncrementError(message);
        }
      } else {
        setIncrementError("");
      }
    } catch (error) {
      setIncrementError(
        validationMessagesEnum.incrementValidationError.i18n[lang],
      );
    } finally {
      setIsValidatingIncrement(false);
    }
  };

  const handleInstallmentChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChangeWithCurrency(formik, event);
  };

  const validationSchema = Yup.object({
    creditLine: Yup.string(),
    creditAmount: Yup.number(),
    paymentMethod: Yup.string(),
    paymentCycle: Yup.string(),
    firstPaymentCycle: Yup.string(),
    termInMonths: Yup.number(),
    amortizationType: Yup.string(),
    interestRate: Yup.number().min(0, ""),
    rateType: Yup.string(),
  });

  let incrementValuesStatus: "invalid" | "pending" | undefined;

  if (incrementError) {
    incrementValuesStatus = "invalid";
  } else if (isValidatingIncrement) {
    incrementValuesStatus = "pending";
  } else {
    incrementValuesStatus = undefined;
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(
          values: FormikValues,
          formikHelpers: FormikHelpers<FormikValues>,
        ) => {
          handleConfirm(values);
          formikHelpers.setSubmitting(false);
        }}
      >
        {(formik) => (
          <BaseModal
            title={
              <TruncatedText
                text={title}
                maxLength={25}
                size="small"
                type="headline"
              />
            }
            backButton={editProductModalLabels.buttons.cancel.i18n[lang]}
            nextButton={confirmButtonText}
            handleNext={formik.submitForm}
            handleBack={onCloseModal}
            disabledNext={
              /* eslint-disable no-implicit-coercion */
              !formik.dirty ||
              !formik.isValid ||
              !!loanAmountError ||
              !!loanTermError ||
              !!interestRateError ||
              !!incrementError ||
              isValidatingIncrement ||
              (showIncrementField && !incrementValue)
            }
            iconAfterNext={iconAfter}
            finalDivider={true}
            width={isMobile ? "290px" : "500px"}
            $height="calc(100vh - 64px)"
            isSendingData={isUsingServices}
          >
            <ScrollableContainer $smallScreen={!isMobile} $width="auto">
              <Stack
                direction="column"
                gap="24px"
                width="100%"
                height={isMobile ? "auto" : "600px"}
                margin="0px 0px 30px 0"
              >
                <Textfield
                  label={fieldLabelsEnum.creditAmount.i18n[lang]}
                  name="creditAmount"
                  id="creditAmount"
                  placeholder={fieldPlaceholdersEnum.creditAmount.i18n[lang]}
                  value={validateCurrencyField(
                    "creditAmount",
                    formik,
                    false,
                    "",
                  )}
                  status={loanAmountError ? "invalid" : undefined}
                  message={loanAmountError}
                  iconBefore={
                    <Icon
                      icon={<MdAttachMoney />}
                      appearance="success"
                      size="18px"
                      spacing="narrow"
                    />
                  }
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={(event) => handleCurrencyChange(formik, event)}
                  fullwidth
                  disabled={isCreditAmountDisabled()}
                />
                <CardGray
                  label={fieldLabelsEnum.paymentMethod.i18n[lang]}
                  placeHolder={capitalizeFirstLetter(
                    formik.values.paymentMethod.charAt(0).toUpperCase() +
                      formik.values.paymentMethod.slice(1),
                  )}
                />
                <CardGray
                  label={fieldLabelsEnum.paymentCycle.i18n[lang]}
                  placeHolder={capitalizeFirstLetter(
                    paymentCycleMap[formik.values.paymentCycle] ||
                      formik.values.paymentCycle,
                  )}
                />
                <Select
                  label={fieldLabelsEnum.termInMonths.i18n[lang]}
                  name="termInMonths"
                  id="termInMonths"
                  size="compact"
                  placeholder={fieldLabelsEnum.termInMonths.i18n[lang]}
                  options={termInMonthsOptions}
                  onBlur={formik.handleBlur}
                  onChange={(name, value) =>
                    handleSelectChange(formik, "termInMonths", name, value)
                  }
                  value={formik.values.termInMonths}
                  fullwidth
                  message={loanTermError}
                  invalid={loanTermError ? true : false}
                  disabled={isTermInMonthsDisabled()}
                />
                <Select
                  label={fieldLabelsEnum.amortizationType.i18n[lang]}
                  name="amortizationType"
                  id="amortizationType"
                  size="compact"
                  placeholder={fieldLabelsEnum.amortizationType.i18n[lang]}
                  options={amortizationTypesList}
                  onBlur={formik.handleBlur}
                  onChange={(name, value) =>
                    handleAmortizationTypeChange(formik, name, value)
                  }
                  disabled={isLoading}
                  value={formik.values.amortizationType}
                  fullwidth
                />
                {showIncrementField && (
                  <Textfield
                    label={
                      incrementType === "value"
                        ? fieldLabelsEnum.incrementValue.i18n[lang]
                        : fieldLabelsEnum.incrementPercentage.i18n[lang]
                    }
                    name="incrementValue"
                    id="incrementValue"
                    placeholder={
                      incrementType === "value"
                        ? fieldPlaceholdersEnum.incrementValue.i18n[lang]
                        : fieldPlaceholdersEnum.incrementPercentage.i18n[lang]
                    }
                    value={incrementValue}
                    status={incrementValuesStatus}
                    message={
                      incrementError ||
                      (isValidatingIncrement
                        ? validationMessagesEnum.incrementValidating.i18n[lang]
                        : "")
                    }
                    iconBefore={
                      incrementType === "value" ? (
                        <Icon
                          icon={<MdAttachMoney />}
                          appearance="success"
                          size="18px"
                          spacing="narrow"
                        />
                      ) : (
                        <Icon
                          icon={<MdPercent />}
                          appearance="dark"
                          size="18px"
                          spacing="narrow"
                        />
                      )
                    }
                    type="number"
                    size="compact"
                    onChange={(event) => {
                      const value = event.target.value;
                      setIncrementValue(value);

                      const timeoutId = setTimeout(() => {
                        validateIncrementValue(value, formik);
                      }, 500);

                      return () => clearTimeout(timeoutId);
                    }}
                    onBlur={() =>
                      validateIncrementValue(incrementValue, formik)
                    }
                    fullwidth
                  />
                )}
                <Textfield
                  label={fieldLabelsEnum.interestRate.i18n[lang]}
                  name="interestRate"
                  id="interestRate"
                  placeholder={fieldPlaceholdersEnum.interestRate.i18n[lang]}
                  value={formik.values.interestRate.toFixed(4)}
                  iconAfter={
                    <Icon
                      icon={<MdPercent />}
                      appearance="dark"
                      size="18px"
                      spacing="narrow"
                    />
                  }
                  type="number"
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={(event) =>
                    handleTextChange(formik, "interestRate", event)
                  }
                  fullwidth
                  message={interestRateError}
                  status={interestRateError ? "invalid" : undefined}
                />
                <Select
                  label={fieldLabelsEnum.rateType.i18n[lang]}
                  name="rateType"
                  id="rateType"
                  size="compact"
                  placeholder={
                    editProductModalLabels.placeholders.selectOption.i18n[lang]
                  }
                  options={rateTypesList}
                  onBlur={formik.handleBlur}
                  onChange={(name, value) =>
                    handleSelectChange(formik, "rateType", name, value)
                  }
                  onFocus={() => handleSelectFocus("rateType")}
                  value={formik.values.rateType}
                  fullwidth
                  disabled={isLoading}
                />
                <Textfield
                  label={simulationFormLabels.installmentAmountLabel.i18n["es"]}
                  name="installmentAmount"
                  id="installmentAmount"
                  placeholder={
                    simulationFormLabels.installmentAmountPlaceholder.i18n["es"]
                  }
                  value={validateCurrencyFieldTruncate(
                    "installmentAmount",
                    formik,
                    false,
                    "",
                  )}
                  iconBefore={
                    <Icon
                      icon={<MdAttachMoney />}
                      appearance="success"
                      size="18px"
                      spacing="narrow"
                    />
                  }
                  type="text"
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={(event) => handleInstallmentChange(formik, event)}
                  fullwidth
                />
              </Stack>
            </ScrollableContainer>
          </BaseModal>
        )}
      </Formik>
      {errorModal && (
        <ErrorModal
          isMobile={isMobile}
          message={errorMessage}
          handleClose={() => {
            setErrorModal(false);
          }}
        />
      )}
    </>
  );
}

export { EditProductModal };
export type { EditProductModalProps };
