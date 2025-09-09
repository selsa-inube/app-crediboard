import { ReactNode } from 'react';

export type TransformedEnums = Record<string, Record<string, string>>;

export interface IEnumContextType {
  enums: TransformedEnums;
  getEnums: (businessUnitPublicCode: string) => Promise<void>;
}

export interface EnumProviderProps {
  children: ReactNode;
}