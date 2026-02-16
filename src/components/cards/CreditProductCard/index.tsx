import { EnumType } from "@hooks/useEnum";

import { CreditProductCardUI } from "./interface";

interface CreditProductCardProps {
  lineOfCredit: string;
  paymentMethod: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  periodicFee: number;
  schedule: string;
  onEdit: () => void;
  onDelete: () => void;
  availableEditCreditRequest: boolean;
  lang: EnumType;
  canDelete?: boolean;
  installmentFrequency?: string;
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
    lang,
    canDelete,
    installmentFrequency,
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
      canDelete={canDelete}
      installmentFrequency={installmentFrequency}
    />
  );
}

export { CreditProductCard };
export type { CreditProductCardProps };
