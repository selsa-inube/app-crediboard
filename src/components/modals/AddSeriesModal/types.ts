export declare interface IOption {
  id: string;
  label: string;
  value: string;
}

export interface ICycleOption extends IOption {
  paymentDates: string[];
  extraordinaryCycleType: string;
  cycleName?: string;
  payrollForDeductionAgreementCode?: string;
  agreementCode?: string;
}
