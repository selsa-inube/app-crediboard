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
  schedule: Schedule | string;
  lang: EnumType;
  availableEditCreditRequest: boolean;
  showIcons?: boolean;
  onEdit: () => void;
  onDelete: () => void;
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
    lang,
    showIcons = true,
    onEdit,
    onDelete,
    canDelete,
    installmentFrequency,
    availableEditCreditRequest,
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
      lang={lang}
      showIcons={showIcons}
      availableEditCreditRequest={availableEditCreditRequest}
      onEdit={onEdit}
      onDelete={onDelete}
      canDelete={canDelete}
      installmentFrequency={installmentFrequency}
    />
  );
}

export { CreditProductCard };
export type { CreditProductCardProps };
