import { EPaymentOptionType } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { paymentOptionValues } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";

export const dataConsolidatedCredit = {
    expiredValue: "Valor vencido",
    nextDueDate: "Próximo vencimiento",
    fullPayment:"Pago total",
    arrears: "En mora",
    regularPayroll: "Nómina regular mensual"
}

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