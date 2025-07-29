interface IDocumentsByRequirement {
  documentCode: string;
  requirementPackageId: string;
  transactionOperation: string;
}

export interface IapproveRequirement {
  modifyJustification: string;
  nextStatusValue: string;
  packageId: string;
  requirementPackageId: string;
  statusChangeJustification: string;
  transactionOperation: string;
  documentsByRequirement: IDocumentsByRequirement[];
}

interface IRequirementsByPackage {
  requirementPackageId: string;
  packageId: string;
  requirementCatalogName: string;
  requirementDate: string;
  requirementStatus: string;
  descriptionEvaluationRequirement: string;
  descriptionUse: string;
  requirementTypeToEvaluate: string;
  statusChangeJustification: string;
  transactionOperation: string;
}

export interface IapproveRequirementResponse {
  packageId: string;
  requirementsByPackage: IRequirementsByPackage[];
}
