export interface IStaffByBusinessUnitAndRole {
  businessUnitCode: string;
  roleName: string;
  staffId: string;
}

export interface IStaff {
  biologicalSex: string;
  birthDay: string;
  businessManagerCode: string;
  identificationDocumentNumber: string;
  identificationTypeNaturalPerson: string;
  missionName: string;
  principalEmail: string;
  principalPhone: string;
  staffByBusinessUnitAndRole: IStaffByBusinessUnitAndRole;
  staffId: string;
  staffName: string;
  userAccount: string;
}

export interface ICommercialManagerAndAnalyst {
  identificationDocumentNumber: string;
  staffId: string;
  staffName: string;
  userAccount: string;
}
export interface IOptionsByStaffPortalBusinessManager {
  staffPortalId: string;
  optionCode: string;
  portalCatalogCode: string;
}

export interface IStaffPortalByBusinessManager {
  staffPortalId?: string;
  publicCode?: string;
  abbreviatedName?: string;
  descriptionUse?: string;
  businessManagerCode?: string;
  businessManagerName?: string;
  staffPortalCatalogCode?: string;
  url?: string;
  externalAuthenticationProvider?: string;
  brandImageUrl?: string;
  optionsByStaffPortalBusinessManager?: IOptionsByStaffPortalBusinessManager[];
}
