import { Schedule } from "@services/enum/icorebanking-vi-crediboard/schedule";
import { EnumType } from "@hooks/useEnum";

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
  lang: EnumType;
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
    lang
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
      lang={lang}
    />
  );
}

export { CreditProductCard };
export type { CreditProductCardProps };
