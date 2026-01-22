export interface dataTabsDisbursement {
  disbursementAmount: string | number;
  isInTheNameOfBorrower: string;
  payeeName: string;
  payeeSurname: string;
  payeeBiologicalSex: string;
  payeeIdentificationType: string;
  payeeIdentificationNumber: string;
  payeeBirthday: string;
  payeePhoneNumber: string;
  payeeEmail: string;
  payeeCityOfResidence: string;
  accountBankName: string;
  accountType: string;
  accountNumber: string;
  observation: string;
}

export type FormAccountType =
  | IDisbursementGeneral['Internal_account']
  | IDisbursementGeneral['External_account']
  | IDisbursementGeneral['Cash']
  | IDisbursementGeneral['Certified_check']
  | IDisbursementGeneral['Business_check'];

export type DisbursementAccountKeys = Exclude<keyof IDisbursementGeneral, "amount">;

export interface IDisbursementGeneral {
  amount: number;
  Internal_account: IInternalAccount;
  External_account: IExternalAccount;
  Certified_check: IPersonData;
  Business_check: IPersonData;
  Cash: IPersonData;
}

export interface IPersonData {
  amount: number;
  check: boolean;
  toggle: boolean;
  description: string;
  name: string;
  lastName: string;
  sex: string;
  documentType: string;
  identification: string;
  birthdate: string;
  phone: string;
  mail: string;
  city: string;
  accountNumber?: string;
}

export interface IInternalAccount extends IPersonData {
  accountNumber: string;
}

export interface IExternalAccount extends IPersonData {
  bank: string;
  accountType: string;
  accountNumber: string;
}

export interface Tab {
  id: string;
  disabled: boolean;
  label: string;
}