import { IBusinessManagers } from "@services/businessManager/types";
import { getBusinessManagers } from "@services/businessManager/SearchByIdBusinessManager";
import { IStaffPortalByBusinessManager } from "@services/staff/types";
import { getStaffPortalsByBusinessManager } from "@services/staff/SearchAllStaffPortalsByBusinessManager";

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
