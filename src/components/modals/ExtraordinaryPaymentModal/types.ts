export interface IExtraordinaryPayment {
  id: number;
  datePayment: string;
  amount?: number;
  value: number;
  paymentMethod: string;
  frequency?: string;
}
interface IHeaders {
  label: string;
  key: keyof IExtraordinaryPayment;
  action?: boolean;
  mask?: (value: string | number) => string;
}

export type { IHeaders };
