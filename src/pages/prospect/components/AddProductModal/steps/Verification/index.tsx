import { useMediaQuery } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { formatPrimaryDate } from "@utils/formatData/date";
import { CardProductSelection } from "@components/cards/CardProductSelection";

import { IAttributes, IDataVerificationStep } from "./types";
import { VerificationAddProductUI } from "./interface";
import { verificationAddProductConfig } from "../config";
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
  const { formData, creditLineTerms, setCurrentStep } = props;
  const isMobile = useMediaQuery("(max-width: 740px)");

  const selectedCreditLineData = creditLineTerms[formData.creditLine];

  const paymentConfigAttributes = [
    createAttribute(
      verificationAddProductConfig.paymentConfiguration.fields.paymentMethod,
      formData.paymentConfiguration.paymentMethod,
    ),
    createAttribute(
      verificationAddProductConfig.paymentConfiguration.fields.paymentCycle,
      formData.paymentConfiguration.paymentCycle,
    ),
    createAttribute(
      verificationAddProductConfig.paymentConfiguration.fields
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
          verificationAddProductConfig.termInfo.fields.quotaCap,
          currencyFormat(formData.quotaCapValue),
        ),
      ]
      : []),
    ...(formData.maximumTermEnabled
      ? [
        createAttribute(
          verificationAddProductConfig.termInfo.fields.maximumTerm,
          `${formData.maximumTermValue} meses`,
        ),
      ]
      : []),
  ];

  const amountAttributes = [
    createAttribute(
      verificationAddProductConfig.amountInfo.fields.creditAmount,
      currencyFormat(formData.creditAmount),
    ),
  ].filter((attr) => attr.value);

  const dataVerificationStep: IDataVerificationStep[] = [
    {
      sections: {
        creditLineInfo: {
          title: verificationAddProductConfig.creditLineInfo.title,
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
          title: verificationAddProductConfig.paymentConfiguration.title,
          attributes: paymentConfigAttributes,
          stepNumber: 2,
        },
        termInfo: {
          title: verificationAddProductConfig.termInfo.title,
          attributes: termAttributes,
          stepNumber: 3,
        },
        amountInfo: {
          title: verificationAddProductConfig.amountInfo.title,
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