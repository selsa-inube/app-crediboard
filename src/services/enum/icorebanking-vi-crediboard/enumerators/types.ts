export interface Domain {
  Code: string;
  Value: string;
  Description: string;
  I18nAttribute?: string;
  I18n?: Record<string, string>; 
  I18nValue?: Record<string, string>;
  I18nDescription?: Record<string, string>; 
  Index?: number; 
  Type?: string; 
}

export type EnumeratorsResponse = Record<string, Domain[]>;