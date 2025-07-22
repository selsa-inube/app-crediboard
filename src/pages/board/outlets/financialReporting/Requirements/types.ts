export interface DocumentItem {
  creditRequestId: string;
  documentId: string;
  documentManagmentReference: string;
  abbreviatedName: string;
  fileName: string;
}

interface IRequirementByPackage {
  requirementPackageId: string;
  packageId: string;
  requirementCatalogName: string;
  requirementDate: string;
  requirementStatus: string;
  descriptionEvaluationRequirement: string;
  descriptionUse: string;
  requirementTypeToEvaluate: string;
  statusChangeJustification?: string;
}

export interface IRequirement {
  packageId: string;
  packageDate: string;
  uniqueReferenceNumber: string;
  requirementsByPackage: IRequirementByPackage[];
}
