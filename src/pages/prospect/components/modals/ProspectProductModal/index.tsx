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
import { useState, useEffect } from "react";

import { BaseModal } from "@components/modals/baseModal";
import { truncateTextToMaxLength } from "@utils/formatData/text";
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

import { ScrollableContainer } from "./styles";
import {
  termInMonthsOptions,
  amortizationTypeOptions,
  rateTypeOptions,
  paymentCycleMap,
  interestRateTypeMap,
  modalTexts,
  defaultPaymentOptions,
  repaymentStructureMap,
  validationMessages,
  REPAYMENT_STRUCTURES_WITH_INCREMENT,
  fieldLabels,
  fieldPlaceholders
} from "./config";

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
interface SelectOption {
  id: string;
  value: string;
  label: string;
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


  const [showIncrementField, setShowIncrementField] = useState<boolean>(false);
  const [incrementType, setIncrementType] = useState<
    "value" | "percentage" | null
  >(null);
  const [incrementValue, setIncrementValue] = useState<string>("");
  const [incrementError, setIncrementError] = useState<string>("");
  const [isValidatingIncrement, setIsValidatingIncrement] =
    useState<boolean>(false);
  const [creditAmountModified, setCreditAmountModified] =
    useState<boolean>(false);
  const [termInMonthsModified, setTermInMonthsModified] =
    useState<boolean>(false);
  const [loanAmountError, setLoanAmountError] = useState<string>("");
  const [paymentMethodsList, setPaymentMethodsList] = useState<
    IPaymentMethod[]
  >([]);
  const [paymentCyclesList, setPaymentCyclesList] = useState<IPaymentCycle[]>(
    []
  );
  const [firstPaymentCyclesList, setFirstPaymentCyclesList] = useState<
    IFirstPaymentCycle[]
  >([]);

  const [loanTermError, setLoanTermError] = useState<string>("");
  const [amortizationTypesList, setAmortizationTypesList] = useState<
    SelectOption[]
  >([]);
  const [isLoadingAmortizationTypes, setIsLoadingAmortizationTypes] =
    useState(false);
  const [interestRateError, setInterestRateError] = useState<string>("");
  const [rateTypesList, setRateTypesList] = useState<SelectOption[]>([]);
  const [isLoadingRateTypes, setIsLoadingRateTypes] = useState(false);

  const isMobile = useMediaQuery("(max-width: 550px)");

  useEffect(() => {
    const loadPaymentOptions = async () => {
      try {
        const response = await getPaymentMethods(
          businessUnitPublicCode,
          businessManagerCode,
          initialValues.creditLine
        );

        if (!response) {
          throw new Error(modalTexts.messages.errors.loadPaymentOptions);
        }

        setPaymentMethodsList(response.paymentMethods);
        const mappedPaymentCycles = response.paymentCycles.map((cycle) => ({
          ...cycle,
          label: paymentCycleMap[cycle.value] || cycle.label,
        }));
        setPaymentCyclesList(mappedPaymentCycles);

        const mappedFirstPaymentCycles = response.firstPaymentCycles.map(
          (cycle) => ({
            ...cycle,
            label: paymentCycleMap[cycle.value] || cycle.label,
          })
        );
        setFirstPaymentCyclesList(mappedFirstPaymentCycles);
      } catch (error) {
        setPaymentMethodsList(defaultPaymentOptions);
        setPaymentCyclesList(defaultPaymentOptions);
        setFirstPaymentCyclesList(defaultPaymentOptions);
      }
    };

    loadPaymentOptions();
  }, [businessUnitPublicCode, businessManagerCode, initialValues.creditLine]);

  useEffect(() => {
    const loadAmortizationTypes = async () => {
      setIsLoadingAmortizationTypes(true);

      if (!moneyDestination) return;
      setIsLoadingAmortizationTypes(true);

      try {
        const payload: IBusinessUnitRules = {
          ruleName: "RepaymentStructure",
          conditions: [],
        };

        const response = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          payload
        );

        const decisions = response as unknown as IRuleDecision[];

        if (decisions && Array.isArray(decisions) && decisions.length > 0) {
          const options = decisions
            .filter((decision) => typeof decision.value === "string")
            .map((decision, index) => ({
              id: decision.decisionId || `${index}`,
              value: decision.value as string,
              label:
                repaymentStructureMap[decision.value as string] ||
                (decision.value as string),
            }));
          setAmortizationTypesList(options);
        } else {
          setAmortizationTypesList(amortizationTypeOptions);
        }
      } catch (error) {
        setAmortizationTypesList(amortizationTypeOptions);
      } finally {
        setIsLoadingAmortizationTypes(false);
      }
    };

    loadAmortizationTypes();
  }, [businessUnitPublicCode, businessManagerCode, moneyDestination]);

  useEffect(() => {
    const loadRateTypes = async () => {
      setIsLoadingRateTypes(true);

      try {
        const payload: IBusinessUnitRules = {
          ruleName: "InterestRateType",
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
          payload
        );

        const decisions = response as unknown as IRuleDecision[];

        if (decisions && Array.isArray(decisions) && decisions.length > 0) {
          const options = decisions
            .filter((decision) => typeof decision.value === "string")
            .map((decision, index) => ({
              id: decision.decisionId || `${index}`,
              value: decision.value as string,
              label:
                interestRateTypeMap[decision.value as string] ||
                (decision.value as string),
            }));
          setRateTypesList(options);
        } else {
          setRateTypesList(rateTypeOptions);
        }
      } catch (error) {
        console.error("Error cargando tipos de tasa:", error);
        setRateTypesList(rateTypeOptions);
      } finally {
        setIsLoadingRateTypes(false);
      }
    };

    loadRateTypes();
  }, [businessUnitPublicCode, businessManagerCode, moneyDestination]);

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
    value: string
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
    event: React.ChangeEvent<HTMLInputElement>
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
        payload
      );

      const decisions = response as unknown as IRuleDecision[];

      if (decisions && Array.isArray(decisions) && decisions.length > 0) {
        const decision = decisions[0];

        if (typeof decision.value === "object" && decision.value !== null) {
          const { from, to } = decision.value;

          if (amount < from || amount > to) {
            setLoanAmountError(
              modalTexts.messages.errors.loanAmountRange(amount, from, to)
            );
          }
        } else if (typeof decision.value === "string") {
          const maxAmount = Number(decision.value);

          if (!isNaN(maxAmount) && amount > maxAmount) {
            setLoanAmountError(
              modalTexts.messages.errors.loanAmountMax(amount, maxAmount)
            );
          }
        }
      } else {
        setLoanAmountError(modalTexts.messages.errors.loanAmountValidation);
      }
    } catch (error) {
      console.error("Error validando monto del crédito:", error);
      setLoanAmountError(modalTexts.messages.errors.loanAmountGeneric);
    }
  };

  const validateLoanTerm = async (
    term: number,
    loanAmount: number
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
        payload
      );

      const decisions = response as unknown as IRuleDecision[];

      if (decisions && Array.isArray(decisions) && decisions.length > 0) {
        const decision = decisions[0];

        if (typeof decision.value === "object" && decision.value !== null) {
          const { from, to } = decision.value;

          if (term < from || term > to) {
            setLoanTermError(
              modalTexts.messages.errors.loanTermRange(term, from, to)
            );
          }
        } else if (typeof decision.value === "string") {
          const rangeParts = decision.value.split("-");
          if (rangeParts.length === 2) {
            const [min, max] = rangeParts.map(Number);
            if (!isNaN(min) && !isNaN(max) && (term < min || term > max)) {
              setLoanTermError(
                modalTexts.messages.errors.loanTermRange(term, min, max)
              );
            }
          }
        }
      } else {
        setLoanTermError(modalTexts.messages.errors.loanTermValidation);
      }
    } catch (error) {
      console.error("Error validando plazo:", error);
      setLoanTermError(modalTexts.messages.errors.loanTermGeneric);
    }
  };

  const validateInterestRate = async (rate: number): Promise<void> => {
    try {
      setInterestRateError("");

      const response = await getEffectiveInterestRate(
        businessUnitPublicCode,
        businessManagerCode,
        initialValues.creditLine,
        clientIdentificationNumber
      );

      const periodicInterestRateMin = response?.periodicInterestRateMin || 0;
      const periodicInterestRateMax = response?.periodicInterestRateMax || 2;

      if (rate <= periodicInterestRateMin || rate >= periodicInterestRateMax) {
        setInterestRateError(
          modalTexts.messages.errors.interestRateRange(
            rate,
            periodicInterestRateMin,
            periodicInterestRateMax
          )
        );
      }
    } catch (error) {
      console.error("Error validando tasa de interés:", error);
      setInterestRateError(modalTexts.messages.errors.interestRateValidation);
    }
  };

  const handleCurrencyChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>
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

      const updatedProspect = await updateCreditProduct(
        businessUnitPublicCode,
        businessManagerCode,
        payload
      );

      const normalizedProspect = {
        ...updatedProspect,
        creditProducts: updatedProspect!.creditProducts?.map((product) => ({
          ...product,
          schedule: product.schedule || product.installmentFrequency,
        })),
      };

      onProspectUpdate(normalizedProspect as IProspect);

      onCloseModal();
    } catch (error) {
      console.error("Error al agregar producto:", error);
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
        setIncrementError(validationMessages.incrementMustBePositive);
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
          setIncrementError(
            validationMessages.incrementValueRange(response.minValue, response.maxValue),
          );
        } else {
          setIncrementError(
            validationMessages.incrementPercentageRange(response.minValue, response.maxValue)
          );
        }
      } else {
        setIncrementError("");
      }
    } catch (error) {
      setIncrementError(validationMessages.incrementValidationError);
    } finally {
      setIsValidatingIncrement(false);
    }
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(
        values: FormikValues,
        formikHelpers: FormikHelpers<FormikValues>
      ) => {
        handleConfirm(values);
        formikHelpers.setSubmitting(false);
      }}
    >
      {(formik) => (
        <BaseModal
          title={truncateTextToMaxLength(title, 25)}
          backButton={modalTexts.buttons.cancel}
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
        >
          <ScrollableContainer $smallScreen={isMobile}>
            <Stack
              direction="column"
              gap="24px"
              width="100%"
              height={isMobile ? "auto" : "600px"}
              margin="0px 0px 30px 0"
            >
              <Textfield
                label={modalTexts.labels.creditAmount}
                name="creditAmount"
                id="creditAmount"
                placeholder={modalTexts.placeholders.creditAmount}
                value={validateCurrencyField("creditAmount", formik, false, "")}
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
              <Select
                label={modalTexts.labels.paymentMethod}
                name="paymentMethod"
                id="paymentMethod"
                size="compact"
                placeholder={modalTexts.placeholders.selectOption}
                options={paymentMethodsList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "paymentMethod", name, value)
                }
                value={
                  formik.values.paymentMethod.charAt(0).toUpperCase() +
                  formik.values.paymentMethod.slice(1)
                }
                fullwidth
                disabled={true}
              />
              <Select
                label={modalTexts.labels.paymentCycle}
                name="paymentCycle"
                id="paymentCycle"
                size="compact"
                placeholder={modalTexts.placeholders.selectOption}
                options={paymentCyclesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "paymentCycle", name, value)
                }
                value={
                  paymentCycleMap[formik.values.paymentCycle] ||
                  formik.values.paymentCycle
                }
                fullwidth
                disabled={true}
              />
              <Select
                label={modalTexts.labels.firstPaymentCycle}
                name="firstPaymentCycle"
                id="firstPaymentCycle"
                size="compact"
                placeholder={modalTexts.placeholders.selectOption}
                options={firstPaymentCyclesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "firstPaymentCycle", name, value)
                }
                value={formik.values.firstPaymentCycle}
                fullwidth
                disabled={true}
              />
              <Select
                label={modalTexts.labels.termInMonths}
                name="termInMonths"
                id="termInMonths"
                size="compact"
                placeholder={modalTexts.placeholders.selectOption}
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
                label={modalTexts.labels.amortizationType}
                name="amortizationType"
                id="amortizationType"
                size="compact"
                placeholder={modalTexts.placeholders.selectOption}
                options={amortizationTypesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleAmortizationTypeChange(formik, name, value)
                }
                disabled={isLoadingAmortizationTypes}
                value={formik.values.amortizationType}
                fullwidth
              />
              {showIncrementField && (
                <Textfield
                  label={
                    incrementType === "value"
                      ? fieldLabels.incrementValue
                      : fieldLabels.incrementPercentage
                  }
                  name="incrementValue"
                  id="incrementValue"
                  placeholder={
                    incrementType === "value" ? fieldPlaceholders.incrementValue : fieldPlaceholders.incrementPercentage
                  }
                  value={incrementValue}
                  status={incrementValuesStatus}
                  message={
                    incrementError ||
                    (isValidatingIncrement ? validationMessages.incrementValidating : "")
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
                  onBlur={() => validateIncrementValue(incrementValue, formik)}
                  fullwidth
                />
              )}
              <Textfield
                label={modalTexts.labels.interestRate}
                name="interestRate"
                id="interestRate"
                placeholder={modalTexts.placeholders.interestRate}
                value={formik.values.interestRate}
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
                label={modalTexts.labels.rateType}
                name="rateType"
                id="rateType"
                size="compact"
                placeholder={modalTexts.placeholders.selectOption}
                options={rateTypesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "rateType", name, value)
                }
                onFocus={() => handleSelectFocus("rateType")}
                value={formik.values.rateType}
                fullwidth
                disabled={isLoadingRateTypes}
              />
            </Stack>
          </ScrollableContainer>
        </BaseModal>
      )}
    </Formik>
  );
}

export { EditProductModal };
export type { EditProductModalProps };
