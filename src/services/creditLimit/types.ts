export interface IMaximumCreditLimit {
  customerCreditLimitInLineOfCredit: number;
  customerTotalObligationsInLineOfCredit: number;
  lineOfCreditLoanAmountLimitRegulation: number;
}

export interface IMaximumCreditLimitReciprocity {
  allowedUsageCount: number;
  assignedCreditLimit: number;
  maxAmountAvailableByReciprocity: number;
  permanentSavingsBalance: number;
  unsecuredPortfolioObligation: number;
}
