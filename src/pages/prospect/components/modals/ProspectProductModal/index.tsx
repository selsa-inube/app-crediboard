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
import { IBusinessUnitRules } from "@services/businessUnitRules/types";
import {
  IPaymentMethod,
  IPaymentCycle,
  IFirstPaymentCycle,
} from "@services/creditLimit/getPaymentMethods/types";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { getEffectiveInterestRate } from "@services/lineOfCredit/getEffectiveInterestRate";
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

import { ScrollableContainer } from "./styles";
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

interface IRuleDecision {
  decisionId?: string;
  typeDecision?: string;
  value?: string | { from: number; to: number };
  ruleDataType?: "Alphabetical" | "Numerical" | "Range" | "Monetary";
  ruleName?: string;
  howToSetTheDecision?: string;
  coverage?: number;
  effectiveFrom?: string;
  validUntil?: string;
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
  const [paymentCyclesList, setPaymentCyclesList] = useState<IPaymentCycle[]>(
    [],
  );
  const [firstPaymentCyclesList, setFirstPaymentCyclesList] = useState<
    IFirstPaymentCycle[]
  >([]);

  const [loanTermError, setLoanTermError] = useState<string>("");
  const [interestRateError, setInterestRateError] = useState<string>("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isMobile = useMediaQuery("(max-width: 550px)");

  useEffect(() => {
    const loadPaymentOptions = async () => {
      try {
        const response = await getPaymentMethods(
          businessUnitPublicCode,
          businessManagerCode,
          clientIdentificationNumber,
          eventData.token,
        );

        if (!response) {
          throw new Error(
            editProductModalLabels.validationMessages.genericFetchError.i18n[
              lang
            ],
          );
        }

        setPaymentMethodsList(response.paymentMethods);
        const mappedPaymentCycles = response.paymentCycles.map((cycle) => ({
          ...cycle,
          label: paymentCycleMap[cycle.value] || cycle.label,
        }));
        setPaymentCyclesList(mappedPaymentCycles);
        paymentCyclesList;

        const mappedFirstPaymentCycles = response.firstPaymentCycles.map(
          (cycle) => ({
            ...cycle,
            label: paymentCycleMap[cycle.value] || cycle.label,
          }),
        );
        setFirstPaymentCyclesList(mappedFirstPaymentCycles);
        firstPaymentCyclesList;
      } catch (error) {
        setPaymentMethodsList(defaultPaymentOptions);
        paymentMethodsList;
        setPaymentCyclesList(defaultPaymentOptions);
        setFirstPaymentCyclesList(defaultPaymentOptions);
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
    if (!enums?.RepaymentStructure) return [];

    return enums.RepaymentStructure.map((item) => ({
      id: item.code,
      value: item.code,
      label: item.i18n[lang] || item.description || item.code,
    }));
  }, [enums, lang]);

  const rateTypesList = useMemo(() => {
    if (!enums?.InterestRateType) return [];

    return enums.InterestRateType.map((item) => ({
      id: item.code,
      value: item.code,
      label: item.i18n[lang] || item.description || item.code,
    }));
  }, [enums, lang]);

  //   const loadAmortizationTypes = async () => {
  //     setIsLoadingAmortizationTypes(true);

  //     if (!moneyDestination) return;
  //     setIsLoadingAmortizationTypes(true);

  //     try {
  //       const payload: IBusinessUnitRules = {
  //         ruleName: "RepaymentStructure",
  //         conditions: [],
  //       };

  //       const response = await postBusinessUnitRules(
  //         businessUnitPublicCode,
  //         businessManagerCode,
  //         payload,
  //         eventData.token || "",
  //       );

  //       const decisions = response as unknown as IRuleDecision[];

  //       if (decisions && Array.isArray(decisions) && decisions.length > 0) {
  //         const options = decisions
  //           .filter((decision) => typeof decision.value === "string")
  //           .map((decision, index) => ({
  //             id: decision.decisionId || `${index}`,
  //             value: decision.value as string,
  //             label:
  //               repaymentStructureMap[decision.value as string] ||
  //               (decision.value as string),
  //           }));
  //         setAmortizationTypesList(options);
  //       } else {
  //         setAmortizationTypesList(amortizationTypeOptions);
  //       }
  //     } catch (error) {
  //       setAmortizationTypesList(amortizationTypeOptions);
  //     } finally {
  //       setIsLoadingAmortizationTypes(false);
  //       isLoadingAmortizationTypes;
  //     }
  //   };

  //   loadAmortizationTypes();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [businessUnitPublicCode, businessManagerCode, moneyDestination]);
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

    const initialValue = initialValues[name];
    if (fieldName === "termInMonths") {
      if (value === initialValue) {
        setTermInMonthsModified(false);
        setLoanTermError("");
      } else {
        setTermInMonthsModified(true);

        const numericValue = Number(value);
        const currentAmount = Number(formik.values.creditAmount) || 0;

        if (numericValue >= 0 && currentAmount >= 0) {
          validateLoanTerm(numericValue, currentAmount);
        } else {
          setLoanTermError("");
        }
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

  const validateLoanAmount = async (amount: number): Promise<void> => {
    try {
      setLoanAmountError("");

      const payload: IBusinessUnitRules = {
        ruleName: "LoanAmountLimit",
        conditions: [
          {
            condition: "MoneyDestination",
            value: moneyDestination,
          },
        ],
      };

      const response = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
        eventData.token || "",
      );

      const decisions = response as unknown as IRuleDecision[];

      if (decisions && Array.isArray(decisions) && decisions.length > 0) {
        const decision = decisions[0];

        if (typeof decision.value === "object" && decision.value !== null) {
          const { from, to } = decision.value;

          if (amount < from || amount > to) {
            const message =
              editProductModalLabels.validationMessages.loanAmountRange.i18n[
                lang
              ]
                .replace("{amount}", amount.toLocaleString())
                .replace("{from}", from.toLocaleString())
                .replace("{to}", to.toLocaleString());

            setLoanAmountError(message);
          }
        } else if (typeof decision.value === "string") {
          const maxAmount = Number(decision.value);

          if (!isNaN(maxAmount) && amount > maxAmount) {
            const message =
              editProductModalLabels.validationMessages.loanAmountMax.i18n[lang]
                .replace("{amount}", amount.toLocaleString())
                .replace("{max}", maxAmount.toLocaleString());

            setLoanAmountError(message);
          }
        }
      } else {
        setLoanAmountError(
          editProductModalLabels.validationMessages.genericFetchError.i18n[
            lang
          ],
        );
      }
    } catch (error) {
      console.error("Error validando monto del crédito:", error);
      setLoanAmountError(
        editProductModalLabels.validationMessages.genericFetchError.i18n[lang],
      );
    }
  };

  const validateLoanTerm = async (
    term: number,
    loanAmount: number,
  ): Promise<void> => {
    try {
      setLoanTermError("");

      const payload: IBusinessUnitRules = {
        ruleName: "LoanTerm",
        conditions: [
          {
            condition: "MoneyDestination",
            value: moneyDestination,
          },
          { condition: "LoanAmount", value: loanAmount },
        ],
      };

      const response = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
        eventData.token || "",
      );

      const decisions = response as unknown as IRuleDecision[];

      if (decisions && Array.isArray(decisions) && decisions.length > 0) {
        const decision = decisions[0];

        if (typeof decision.value === "object" && decision.value !== null) {
          const { from, to } = decision.value;

          if (term < from || term > to) {
            const message = validationMessagesEnum.loanTermOutOfRange.i18n[lang]
              .replace("{min}", from.toLocaleString())
              .replace("{max}", to.toLocaleString())
              .replace("{term}", term.toLocaleString());

            setLoanTermError(message);
          }
        } else if (typeof decision.value === "string") {
          const rangeParts = decision.value.split("-");
          if (rangeParts.length === 2) {
            const [min, max] = rangeParts.map(Number);
            if (!isNaN(min) && !isNaN(max) && (term < min || term > max)) {
              const message = validationMessagesEnum.loanTermOutOfRange.i18n[
                lang
              ]
                .replace("{min}", min.toLocaleString())
                .replace("{max}", max.toLocaleString())
                .replace("{term}", term.toLocaleString());

              setLoanTermError(message);
            }
          }
        }
      } else {
        setLoanTermError(
          validationMessagesEnum.loanTermValidationFailed.i18n[lang],
        );
      }
    } catch (error) {
      console.error("Error validando plazo:", error);
      setLoanTermError(
        validationMessagesEnum.loanTermValidationFailed.i18n[lang],
      );
    }
  };

  const validateInterestRate = async (rate: number): Promise<void> => {
    try {
      setInterestRateError("");

      const response = await getEffectiveInterestRate(
        businessUnitPublicCode,
        businessManagerCode,
        initialValues.creditLine,
        clientIdentificationNumber,
        eventData?.token || "",
      );

      const periodicInterestRateMin = response?.periodicInterestRateMin || 0;
      const periodicInterestRateMax = response?.periodicInterestRateMax || 2;

      if (rate <= periodicInterestRateMin || rate >= periodicInterestRateMax) {
        const message = validationMessagesEnum.interestRateOutOfRange.i18n[lang]
          .replace("{min}", periodicInterestRateMin.toLocaleString())
          .replace("{max}", periodicInterestRateMax.toLocaleString())
          .replace("{rate}", rate.toLocaleString());

        setInterestRateError(message);
      }
    } catch (error) {
      console.error("Error validando tasa de interés:", error);
      setInterestRateError(
        validationMessagesEnum.interestRateValidationError.i18n[lang],
      );
    }
  };

  const handleCurrencyChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChangeWithCurrency(formik, event);

    const rawValue = event.target.value
      .replace(/\$/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .trim();

    const numericValue = Number(rawValue);

    const initialAmount = initialValues.creditAmount;
    if (numericValue === initialAmount || rawValue === "") {
      setCreditAmountModified(false);
      setLoanAmountError("");
    } else {
      setCreditAmountModified(true);

      if (numericValue > 0) {
        validateLoanAmount(numericValue);
      } else {
        setLoanAmountError("");
      }
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
      const payload = {
        creditProductCode: creditProductCode,
        interestRate: values.interestRate,
        loanTerm: Number(values.termInMonths),
        creditRequestCode: creditRequestCode,
      };

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
