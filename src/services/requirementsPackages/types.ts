interface IlistsOfRequirementsByPackage {
  descriptionEvaluationRequirement: string;
  descriptionUse: string;
  packageId: string;
  requirementCatalogName: string;
  requirementDate: string;
  requirementPackageId: string;
  requirementStatus: string;
  requirementTypeToEvaluate: string;
}

interface IlistsOfRequirements {
  packageId: string;
  requirementCatalogName: string;
  requirementDate: string;
  requirementStatus: string;
  descriptionEvaluationRequirement: string;
  descriptionUse: string;
  requirementTypeToEvaluate: string;
  transactionOperation: string;
}

export interface ITracesInRequirementsManagement {
  assignedStatus: string;
  justificationForChangeOfStatus: string;
  packageId: string;
  requirementPackageId: string;
  traceDate: string;
  traceId: string;
}

export interface IPackagesOfRequirementsById {
  requirementsByPackage: IlistsOfRequirementsByPackage[];
  packageDate: string;
  packageDescription: string;
  packageId: string;
  tracesInRequirementsManagement: ITracesInRequirementsManagement[];
  uniqueReferenceNumber: string;
}

export interface IPatchOfRequirements {
  packageId: string;
  uniqueReferenceNumber: string;
  packageDate: string;
  packageDescription: string;
  modifyJustification?: string;
  requirementsByPackage: IlistsOfRequirements[];
}
