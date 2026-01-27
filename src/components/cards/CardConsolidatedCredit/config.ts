import { EPaymentOptionType } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { paymentOptionValues } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";

export const dataConsolidatedCreditEnum = {
  expiredValue: {
    code: "DataConsolidatedCredit_expiredValue",
    description: "Label for expired value",
    i18n: {
      en: "Expired Value",
      es: "Valor vencido",
    },
  },
  nextDueDate: {
    code: "DataConsolidatedCredit_nextInstallment",
    description: "Label for Next installment",
    i18n: {
      en: "Next installment",
      es: "Próximo vencimiento",
    },
  },
  fullPayment: {
    code: "DataConsolidatedCredit_fullPayment",
    description: "Label for full payment",
    i18n: {
      en: "Full Payment",
      es: "Pago total",
    },
  },
  arrears: {
    code: "DataConsolidatedCredit_arrears",
    description: "Label for arrears status",
    i18n: {
      en: "Delinquent",
      es: "En mora",
    },
  },
  regularPayroll: {
    code: "DataConsolidatedCredit_regularPayroll",
    description: "Label for regular monthly payroll",
    i18n: {
      en: "Regular Monthly Payroll",
      es: "Nómina regular mensual",
    },
  },
};

interface IApplyPayOption {
  id: string;
  label: string;
}

const getOptions = (
  customValue: number,
  nextPaymentValue: number,
): IApplyPayOption[] => {
  const options = [
    {
      id: EPaymentOptionType.REDUCEFUTUREQUOTA,
      label: paymentOptionValues[EPaymentOptionType.REDUCEFUTUREQUOTA],
    },
  ];

  if (customValue > nextPaymentValue) {
    const addOptions = [
      {
        id: EPaymentOptionType.REPROGRAMMINGDEADLINE,
        label: paymentOptionValues[EPaymentOptionType.REPROGRAMMINGDEADLINE],
      },
      {
        id: EPaymentOptionType.REPROGRAMMINGMAINTAININGVALUE,
        label:
          paymentOptionValues[EPaymentOptionType.REPROGRAMMINGMAINTAININGVALUE],
      },
    ];

    options.push(...addOptions);
  } else if (customValue < nextPaymentValue) {
    const addOptions = [
      {
        id: EPaymentOptionType.OTHERVALUE,
        label: paymentOptionValues[EPaymentOptionType.OTHERVALUE],
      },
    ];

    options.push(...addOptions);
  }

  return options;
};

export { getOptions };
export type { IApplyPayOption };
