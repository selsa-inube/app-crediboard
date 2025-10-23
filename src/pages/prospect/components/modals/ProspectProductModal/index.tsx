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

type FieldGroup =
  | "creditAmount"
  | "paymentGroup"
  | "termInMonths"
  | "amortizationType"
  | "interestRate"
  | "rateType";

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

  const [modifiedGroup, setModifiedGroup] = useState<FieldGroup | null>(null);
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
    { id: string; value: string; label: string }[]
  >([]);
  const [isLoadingAmortizationTypes, setIsLoadingAmortizationTypes] =
    useState(false);
  const [interestRateError, setInterestRateError] = useState<string>("");
  const [rateTypesList, setRateTypesList] = useState<
    { id: string; value: string; label: string }[]
  >([]);
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

  const getFieldGroup = (fieldName: string): FieldGroup | null => {
    if (fieldName === "creditAmount") return "creditAmount";

    if (
      ["paymentMethod", "paymentCycle", "firstPaymentCycle"].includes(fieldName)
    ) {
      return "paymentGroup";
    }

    if (fieldName === "termInMonths") return "termInMonths";
    if (fieldName === "amortizationType") return "amortizationType";
    if (fieldName === "interestRate") return "interestRate";
    if (fieldName === "rateType") return "rateType";
    return null;
  };

  const isFieldDisabled = (fieldName: string): boolean => {
    if (!modifiedGroup) return false;

    const fieldGroup = getFieldGroup(fieldName);

    return fieldGroup !== modifiedGroup;
  };

  const handleFieldModification = (fieldName: string) => {
    if (!modifiedGroup) {
      const group = getFieldGroup(fieldName);
      if (group) {
        setModifiedGroup(group);
      }
    }
  };

  const handleSelectChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    name: string,
    value: string
  ) => {
    handleFieldModification(fieldName);
    formik.setFieldValue(name, value);

    const initialValue = initialValues[name];
    if (value === initialValue) {
      setModifiedGroup(null);
      if (fieldName === "termInMonths") {
        setLoanTermError("");
      }
    } else {
      handleFieldModification(fieldName);

      if (fieldName === "termInMonths" && value) {
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

    if (newValue === "" || newNumericValue === initialNumericValue) {
      setModifiedGroup(null);
      if (fieldName === "interestRate") {
        setInterestRateError("");
      }
    } else {
      handleFieldModification(fieldName);

      if (fieldName === "interestRate") {
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
    handleFieldModification("creditAmount");
    handleChangeWithCurrency(formik, event);

    const rawValue = event.target.value
      .replace(/\$/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .trim();

    const numericValue = Number(rawValue);

    const initialAmount = initialValues.creditAmount;
    if (numericValue === initialAmount || rawValue === "") {
      setModifiedGroup(null);
      setLoanAmountError("");
    } else {
      handleFieldModification("creditAmount");

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
            !formik.dirty ||
            !formik.isValid ||
            Boolean(loanAmountError) ||
            Boolean(loanTermError) ||
            Boolean(interestRateError)
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
                disabled={isFieldDisabled("creditAmount")}
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
                disabled={isFieldDisabled("termInMonths")}
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
                  handleSelectChange(formik, "amortizationType", name, value)
                }
                value={formik.values.amortizationType}
                fullwidth
                disabled={
                  isFieldDisabled("amortizationType") ||
                  isLoadingAmortizationTypes
                }
              />
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
                disabled={isFieldDisabled("interestRate")}
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
                disabled={isFieldDisabled("rateType") || isLoadingRateTypes}
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
