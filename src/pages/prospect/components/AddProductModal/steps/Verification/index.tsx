import { useMediaQuery } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { formatPrimaryDate } from "@utils/formatData/date";
import { CardProductSelection } from "@components/cards/CardProductSelection";
import { useEnum } from "@hooks/useEnum";

import { IAttributes, IDataVerificationStep } from "./types";
import { VerificationAddProductUI } from "./interface";
import { getVerificationAddProductConfig } from "../config";
import { IFormValues, TCreditLineTerms } from "../../config";

export interface IVerificationAddProductProps {
  formData: IFormValues;
  creditLineTerms: TCreditLineTerms;
  setCurrentStep: (step: number) => void;
}

function createAttribute(
  attributeName: string,
  attributeValue: string,
): IAttributes {
  return { attribute: attributeName, value: attributeValue };
}

export const VerificationDebtorAddModal = (
  props: IVerificationAddProductProps,
) => {
  const { lang } = useEnum();
  const { formData, creditLineTerms, setCurrentStep } = props;
  const isMobile = useMediaQuery("(max-width: 740px)");

  const selectedCreditLineData = creditLineTerms[formData.creditLine];

  const paymentConfigAttributes = [
    createAttribute(
      getVerificationAddProductConfig(lang).paymentConfiguration.fields.paymentMethod,
      formData.paymentConfiguration.paymentMethod,
    ),
    createAttribute(
      getVerificationAddProductConfig(lang).paymentConfiguration.fields.paymentCycle,
      formData.paymentConfiguration.paymentCycle,
    ),
    createAttribute(
      getVerificationAddProductConfig(lang).paymentConfiguration.fields
        .firstPaymentDate,
      formData.paymentConfiguration.firstPaymentDate
        ? formatPrimaryDate(
          new Date(formData.paymentConfiguration.firstPaymentDate),
        )
        : "",
    ),
  ].filter((attr) => attr.value);

  const termAttributes = [
    ...(formData.quotaCapEnabled
      ? [
        createAttribute(
          getVerificationAddProductConfig(lang).termInfo.fields.quotaCap,
          currencyFormat(formData.quotaCapValue),
        ),
      ]
      : []),
    ...(formData.maximumTermEnabled
      ? [
        createAttribute(
          getVerificationAddProductConfig(lang).termInfo.fields.maximumTerm,
          `${formData.maximumTermValue} meses`,
        ),
      ]
      : []),
  ];

  const amountAttributes = [
    createAttribute(
      getVerificationAddProductConfig(lang).amountInfo.fields.creditAmount,
      currencyFormat(formData.creditAmount),
    ),
  ].filter((attr) => attr.value);

  const dataVerificationStep: IDataVerificationStep[] = [
    {
      sections: {
        creditLineInfo: {
          title: getVerificationAddProductConfig(lang).creditLineInfo.title,
          attributes: [],
          stepNumber: 1,
          customComponent: selectedCreditLineData ? ( 
            <CardProductSelection
              amount={selectedCreditLineData.LoanAmountLimit}
              rate={selectedCreditLineData.RiskFreeInterestRate}
              term={selectedCreditLineData.LoanTermLimit}
              description={formData.creditLine}
              viewOnly={true}
              isMobile={isMobile}
              isSelected={false}
              disabled
            />
          ) : null,
        },
        paymentConfiguration: {
          title: getVerificationAddProductConfig(lang).paymentConfiguration.title,
          attributes: paymentConfigAttributes,
          stepNumber: 2,
        },
        termInfo: {
          title: getVerificationAddProductConfig(lang).termInfo.title,
          attributes: termAttributes,
          stepNumber: 3,
        },
        amountInfo: {
          title: getVerificationAddProductConfig(lang).amountInfo.title,
          attributes: amountAttributes,
          stepNumber: 4,
        },
      },
    },
  ];

  const keySections = dataVerificationStep.flatMap((step) =>
    Object.keys(step.sections),
  );

  return (
    <VerificationAddProductUI
      dataVerificationStep={dataVerificationStep}
      keySections={keySections}
      isMobile={isMobile}
      setCurrentStep={setCurrentStep}
    />
  );
};