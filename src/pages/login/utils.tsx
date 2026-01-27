import { getBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/SearchBusinessUnitsForAnOfficerLinpar";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

const validateBusinessUnits = async (
  portalPublicCode: string,
  identificationDocumentNumber: string,
  token: string,
): Promise<IBusinessUnitsPortalStaff[]> => {
  const newData = await getBusinessUnitsPortalStaff(
    portalPublicCode,
    identificationDocumentNumber,
    token,
  );

  return newData;
};

export { validateBusinessUnits };
