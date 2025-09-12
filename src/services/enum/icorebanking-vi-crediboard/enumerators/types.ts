export interface Domain {
  code: string;
  value: string;
  description: string;
  i18nAttribute?: string;
  i18nValue?: Record<string, string>;
  i18nDescription?: Record<string, string>;
  type?: string;
}

export interface EnumeratorsResponse {
  [key: string]: Domain[];
}