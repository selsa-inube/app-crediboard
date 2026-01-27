import { IStaffPortalByBusinessManager } from "@services/staff-portals-by-business-manager/types";
import { getStaffPortalsByBusinessManager } from "@services/staff-portals-by-business-manager/SearchAllStaffPortalsByBusinessManager";
import { IBusinessManagers } from "@services/businessManager/types";
import { getBusinessManagers } from "@services/businessManager/SearchByIdBusinessManager";

const validateBusinessManagers = async (
  code: string,
  token: string,
): Promise<IBusinessManagers> => {
  const newData = await getBusinessManagers(code, token);

  return newData;
};

const validateConsultation = async (
  staffPortalId: string,
  token: string,
): Promise<IStaffPortalByBusinessManager[]> => {
  const newData = await getStaffPortalsByBusinessManager(staffPortalId, token);
  return newData;
};
export { validateBusinessManagers, validateConsultation };
