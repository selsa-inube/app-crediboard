import { IOption as IOptionInube } from "@inubekit/inubekit";

export declare interface IOption {
  id: string;
  label: string;
  value: string;
}

export interface ICycleOption extends IOptionInube {
  paymentDates: string[];
  extraordinaryCycleType: string;
  payrollForDeductionAgreementCode: string;
}
