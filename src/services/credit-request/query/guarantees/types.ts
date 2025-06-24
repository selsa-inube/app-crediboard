export interface IMortgages {
  descriptionUse: string;
  guaranteeId: string;
  mortgageId: string;
  propertyAge: string;
  propertyPrice: number;
  propertyType: string;
  propertyState: string;
}

export interface IPledges {
  descriptionUse: string;
  guaranteeId: string;
  pledgeId: string;
  vehiculeAge: string;
  vehiculePrice: number;
  vehiculeState: string;
}

export interface IGuarantees {
  creditRequestId: string;
  guaranteeId: string;
  guaranteeType: string;
  mortgages: IMortgages[];
  pledges: IPledges[];
}
