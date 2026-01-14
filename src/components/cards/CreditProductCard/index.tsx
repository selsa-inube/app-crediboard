import { Schedule } from "@services/enum/icorebanking-vi-crediboard/schedule";

import { CreditProductCardUI } from "./interface";

interface CreditProductCardProps {
  lineOfCredit: string;
  paymentMethod: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  periodicFee: number;
  schedule: Schedule;
  onEdit: () => void;
  onDelete: () => void;
  availableEditCreditRequest: boolean;
  language: "en" | "es";
}

function CreditProductCard(props: CreditProductCardProps) {
  const {
    lineOfCredit,
    paymentMethod,
    loanAmount,
    interestRate,
    termMonths,
    periodicFee,
    schedule,
    onEdit,
    onDelete,
    availableEditCreditRequest,
    language
  } = props;

  return (
    <CreditProductCardUI
      lineOfCredit={lineOfCredit}
      paymentMethod={paymentMethod}
      loanAmount={loanAmount}
      interestRate={interestRate}
      termMonths={termMonths}
      periodicFee={periodicFee}
      schedule={schedule}
      onEdit={onEdit}
      onDelete={onDelete}
      availableEditCreditRequest={availableEditCreditRequest}
      language={language}
    />
  );
}

export { CreditProductCard };
export type { CreditProductCardProps };
