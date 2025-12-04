export interface IAttributes {
  attribute: string;
  value: string;
}

export interface ISection {
  title: string;
  attributes: IAttributes[];
  stepNumber: number;
  customComponent?: JSX.Element | null;
}

export interface IDataVerificationStep {
  sections: {
    [key: string]: ISection;
  };
}
