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
