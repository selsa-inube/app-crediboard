export interface IOptionsSelect {
  id: string;
  label: string;
  value: string;
}

export interface IApprovalSystem {
  observations: string;
  toggleChecked: boolean;
  labelText: string;
}

export interface IApprovalDocumentaries {
  answer: string;
  observations: string;
  check?: boolean;
}

export interface IApprovalHuman {
  answer: string;
  observations: string;
}
