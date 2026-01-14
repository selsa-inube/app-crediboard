import { useEffect, useState, useMemo, useCallback } from "react";
import * as Yup from "yup";
import { useMediaQuery } from "@inubekit/inubekit";

import { getLinesOfCreditByMoneyDestination } from "@services/prospect/getLinesOfCreditByMoneyDestination";
import { GetSearchAllPaymentChannels } from "@services/prospect/searchAllPaymentChannelsByIdentificationNumber/SearchAllPaymentChannelsByIdentificationNumber";
import { useEnum } from "@hooks/useEnum";

import { ILinesOfCreditByMoneyDestination } from "./types";
import { AddProductModalUI } from "./interface";
import {
  IAddProductModalProps,
  TCreditLineTerms,
  IFormValues,
  stepsAddProductEnum,
  errorMessagesEnum,
  extractBorrowerIncomeData,
  titleButtonTextAssistedEnum,
  StepDetails
} from "./config";

function AddProductModal(props: IAddProductModalProps) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconBefore,
    iconAfter,
    moneyDestination,
    businessUnitPublicCode,
    identificationDocumentNumber,
    businessManagerCode,
    identificationDocumentType,
    dataProspect,
    isSendingData
  } = props;

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creditLineTerms, setCreditLineTerms] = useState<TCreditLineTerms>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddProductEnum.creditLineSelection.id,
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(false);
  const [formData, setFormData] = useState<IFormValues>({
    creditLine: "",
    creditAmount: 0,
    paymentConfiguration: {
      paymentMethod: "",
      paymentCycle: "",
      firstPaymentDate: "",
      paymentChannelData: [],
    },
    quotaCapValue: 0,
    maximumTermValue: 0,
    quotaCapEnabled: true,
    maximumTermEnabled: false,
    selectedProducts: [],
  });

  const language = useEnum().lang;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const lineOfCreditValues = await getLinesOfCreditByMoneyDestination(
          businessUnitPublicCode,
          businessManagerCode,
          moneyDestination,
          identificationDocumentNumber,
        );

        const linesArray = Array.isArray(lineOfCreditValues)
          ? lineOfCreditValues
          : [lineOfCreditValues];

        const result: TCreditLineTerms = {};

        linesArray.forEach((line: ILinesOfCreditByMoneyDestination) => {
          if (line && line.abbreviateName) {
            result[line.abbreviateName] = {
              LoanAmountLimit: line.maxAmount,
              LoanTermLimit: line.maxTerm,
              RiskFreeInterestRate: line.maxEffectiveInterestRate,
              amortizationType: line.amortizationType,
              description: line.description,
            };
          }
        });

        setLoading(false);
        setCreditLineTerms(result);
      } catch (error) {
        setErrorMessage(errorMessagesEnum.linesOfCredit.i18n[language]);
        setErrorModal(true);
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, moneyDestination, identificationDocumentNumber, businessManagerCode]);

  useEffect(() => {
    if (currentStep !== stepsAddProductEnum.paymentConfiguration.id) return;
    const loadPaymentOptions = async () => {
      if (!formData.creditLine) return;

      try {
        const incomeData = extractBorrowerIncomeData(dataProspect);

        const paymentChannelRequest = {
          clientIdentificationNumber: identificationDocumentNumber,
          clientIdentificationType: identificationDocumentType,
          moneyDestination: moneyDestination,
          ...incomeData,
          linesOfCredit: formData.selectedProducts,
        };

        setLoading(true);
        const response = await GetSearchAllPaymentChannels(
          businessUnitPublicCode,
          businessManagerCode,
          paymentChannelRequest,
        );

        if (!response || response.length === 0) {
          throw new Error(errorMessagesEnum.getPaymentMethods.i18n[language]);
        }
        setLoading(false);
        setFormData((prev) => ({
          ...prev,
          paymentConfiguration: {
            ...prev.paymentConfiguration,
            paymentChannelData: response,
          },
        }));
      } catch (error) {
        setErrorMessage(errorMessagesEnum.getPaymentMethods.i18n[language]);
        setErrorModal(true);
        setLoading(false);
      }
    };

    loadPaymentOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    const validateCurrentStep = () => {
      if (currentStep === stepsAddProductEnum.creditLineSelection.id) {
        const isValid = formData.selectedProducts.length > 0;
        setIsCurrentFormValid(isValid);
      } else if (currentStep === stepsAddProductEnum.paymentConfiguration.id) {
        const isValid =
          Boolean(formData.paymentConfiguration.paymentMethod) &&
          Boolean(formData.paymentConfiguration.paymentCycle) &&
          Boolean(formData.paymentConfiguration.firstPaymentDate);
        setIsCurrentFormValid(isValid);
      }
    };

    validateCurrentStep();
  }, [formData, currentStep]);

  const isMobile = useMediaQuery("(max-width: 550px)");

  const steps = Object.values(stepsAddProductEnum);

  const handleNextStep = useCallback(() => {
    if (currentStep === stepsAddProductEnum.creditLineSelection.id) {
      setCurrentStep(stepsAddProductEnum.paymentConfiguration.id);
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    setIsCurrentFormValid(true);
  }, [currentStep]);

  const handleSubmitClick = useCallback(() => {
    onConfirm(formData);
  }, [onConfirm, formData]);

  const handleFormChange = (updatedValues: Partial<IFormValues>) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedValues,
    }));
  };

  const validationSchema = Yup.object({
    creditLine: Yup.string(),
    creditAmount: Yup.number(),
    paymentConfiguration: Yup.object({
      paymentMethod: Yup.string(),
      paymentCycle: Yup.string(),
      firstPaymentDate: Yup.string(),
    }),
    termInMonths: Yup.number(),
    selectedProducts: Yup.array()
      .of(Yup.string().required())
      .default([])
      .required(),
  });

  const assistedControls = useMemo(() => ({
    goBackText: titleButtonTextAssistedEnum.goBackText.i18n[language],
    goNextText: titleButtonTextAssistedEnum.goNextText.i18n[language],
    submitText: titleButtonTextAssistedEnum.submitText.i18n[language],
  }), [language]);

  const stepsMap: StepDetails[] = useMemo(() => [
    {
      ...stepsAddProductEnum.creditLineSelection,
      name: stepsAddProductEnum.creditLineSelection.i18n[language],
    },
    {
      ...stepsAddProductEnum.paymentConfiguration,
      name: stepsAddProductEnum.paymentConfiguration.i18n[language],
    },
    {
      ...stepsAddProductEnum.termSelection,
      name: stepsAddProductEnum.termSelection.i18n[language],
    },
    {
      ...stepsAddProductEnum.amountCapture,
      name: stepsAddProductEnum.amountCapture.i18n[language],
    },
    {
      ...stepsAddProductEnum.verification,
      name: stepsAddProductEnum.verification.i18n[language],
    },
  ], [language]);

  const stepsList: StepDetails[] = useMemo(() =>
    Object.values(stepsAddProductEnum).map((step) => ({
      id: step.id,
      number: step.number,
      name: step.i18n[language as "en" | "es"],
      description: step.description,
    })),
    [language]);


  const currentStepsNumberReference = stepsList[currentStep - 1];

  return (
    <AddProductModalUI
      title={title}
      confirmButtonText={confirmButtonText}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onConfirm={onConfirm}
      onCloseModal={onCloseModal}
      iconBefore={iconBefore}
      iconAfter={iconAfter}
      creditLineTerms={creditLineTerms}
      isMobile={isMobile}
      steps={stepsMap}
      currentStep={currentStep}
      currentStepsNumber={currentStepsNumberReference}
      isCurrentFormValid={isCurrentFormValid}
      formData={formData}
      setIsCurrentFormValid={setIsCurrentFormValid}
      handleFormChange={handleFormChange}
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      handleSubmitClick={handleSubmitClick}
      businessUnitPublicCode={businessUnitPublicCode}
      businessManagerCode={businessManagerCode}
      loading={loading}
      prospectData={{
        lineOfCredit: formData.creditLine,
        moneyDestination: moneyDestination,
      }}
      errorMessage={errorMessage}
      setErrorModal={setErrorModal}
      errorModal={errorModal}
      setCurrentStep={setCurrentStep}
      isSendingData={isSendingData}
      language={language}
      assistedControls={assistedControls}
    />
  );
}

export { AddProductModal };
