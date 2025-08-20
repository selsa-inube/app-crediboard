interface IlistsOfRequirementsByPackage {
  descriptionEvaluationRequirement: string;
  descriptionUse: string;
  packageId: string;
  requirementCatalogName: string;
  requirementDate: string;
  requirementByPackageId: string;
  requirementStatus: string;
  typeOfRequirementToEvaluate: string;
}

export interface ITracesInRequirementsManagement {
  assignedStatus: string;
  justificationForChangeOfStatus: string;
  packageId: string;
  requirementByPackageId: string;
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
