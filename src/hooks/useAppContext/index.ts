import { useState, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { IStaffPortalByBusinessManager } from "@services/staffPortal/types";
import { IBusinessManagers } from "@services/businessManager/types";

import {
  validateBusinessManagers,
  validateConsultation,
} from "@context/AppContext/utils";
import { ICrediboardData } from "@context/AppContext/types";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { getEnumerators } from "@services/enumerators";
import { getStaff } from "@services/staffs";
import { decrypt } from "@utils/encrypt/encrypt";

interface IBusinessUnits {
  businessUnitPublicCode: string;
  abbreviatedName: string;
  languageId: string;
  urlLogo: string;
}

function useAppContext() {
  const { user } = useAuth0();
  const [portalData, setPortalData] = useState<IStaffPortalByBusinessManager[]>(
    []
  );
  const [businessManagers, setBusinessManagers] = useState<IBusinessManagers>(
    {} as IBusinessManagers
  );
  const [businessUnitSigla, setBusinessUnitSigla] = useState(
    localStorage.getItem("businessUnitSigla") || ""
  );
  const [businessUnitsToTheStaff, setBusinessUnitsToTheStaff] = useState<
    IBusinessUnitsPortalStaff[]
  >(() => {
    const savedBusinessUnits = localStorage.getItem("businessUnitsToTheStaff");
    return savedBusinessUnits ? JSON.parse(savedBusinessUnits) : [];
  });

  const portalId = localStorage.getItem("portalCode");
  let portalCode = "";
  if (portalId) {
    portalCode = decrypt(portalId);
  }

  let businessUnit: IBusinessUnits | null = null;
  try {
    businessUnit = JSON.parse(businessUnitSigla || "{}") as IBusinessUnits;
  } catch (error) {
    console.error("Error parsing businessUnitSigla: ", error);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getUserPermissions = (IStaff: any) => {
    const isAdmon =
      IStaff.identificationDocumentNumber === "ca.rincon97@gmail.co";
    return {
      canReject: isAdmon,
      canCancel: isAdmon,
      canPrint: isAdmon,
      canAttach: isAdmon,
      canViewAttachments: isAdmon,
      canManageGuarantees: isAdmon,
      canViewCreditProfile: isAdmon,
      canManageDisbursementMethods: isAdmon,
      canAddRequirements: isAdmon,
      canSendDecision: isAdmon,
      canChangeUsers: isAdmon,
      canApprove: isAdmon,
    };
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const staffData = await getStaff();
        if (!staffData.length) return;
        const matchedStaff = staffData.find(
          (staff) =>
            staff.identificationDocumentNumber === user?.email?.substring(0, 20)
        );

        if (matchedStaff) {
          const userPermissions = getUserPermissions(matchedStaff);
          setEventData((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              staff: {
                biologicalSex: matchedStaff.biologicalSex,
                birthDay: matchedStaff.birthDay,
                businessManagerCode: matchedStaff.businessManagerCode,
                identificationDocumentNumber:
                  matchedStaff.identificationDocumentNumber,
                identificationTypeNaturalPerson:
                  matchedStaff.identificationTypeNaturalPerson,
                missionName: matchedStaff.missionName,
                principalEmail: matchedStaff.principalEmail,
                principalPhone: matchedStaff.principalPhone,
                staffByBusinessUnitAndRole:
                  matchedStaff.staffByBusinessUnitAndRole,
                staffId: matchedStaff.staffId,
                staffName: matchedStaff.staffName,
                userAccount: matchedStaff.userAccount,
                useCases: userPermissions,
              },
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    if (user?.email) {
      fetchStaffData();
    }
  }, [user?.email]);

  const [eventData, setEventData] = useState<ICrediboardData>({
    portal: {
      abbreviatedName: "",
      staffPortalCatalogId: "",
      businessManagerId: "",
      publicCode: "",
    },
    businessManager: {
      publicCode: "",
      abbreviatedName: "",
      urlBrand: "",
      urlLogo: "",
    },
    businessUnit: {
      businessUnitPublicCode: businessUnit?.businessUnitPublicCode || "",
      abbreviatedName: businessUnit?.abbreviatedName || "",
      languageId: businessUnit?.languageId || "",
      urlLogo: businessUnit?.urlLogo || "",
    },
    user: {
      userAccount: user?.email || "",
      userName: user?.name || "",
      staff: {
        biologicalSex: "",
        birthDay: "",
        businessManagerCode: "",
        identificationDocumentNumber: "",
        identificationTypeNaturalPerson: "",
        missionName: "",
        principalEmail: "",
        principalPhone: "",
        staffByBusinessUnitAndRole: {
          businessUnitCode: "",
          roleName: "",
          staffId: "",
        },
        staffId: "",
        staffName: "",
        userAccount: "",
        useCases: {
          canReject: false,
          canCancel: false,
          canPrint: false,
          canAttach: false,
          canViewAttachments: false,
          canManageGuarantees: false,
          canViewCreditProfile: false,
          canManageDisbursementMethods: false,
          canAddRequirements: false,
          canSendDecision: false,
          canChangeUsers: false,
          canApprove: false,
        },
      },
      preferences: {
        boardOrientation: "vertical",
        showPinnedOnly: false,
      },
    },
    enumRole: [],
  });

  useEffect(() => {
    validateConsultation().then((data) => {
      setPortalData(data);
    });
  }, []);

  useEffect(() => {
    if (!portalCode) return;
    const portalDataFiltered = portalData.filter(
      (data) => data.staffPortalId === portalCode
    );
    const foundBusiness = portalDataFiltered.find(
      (bussines) => bussines
    )?.businessManagerId;

    if (portalDataFiltered.length > 0 && foundBusiness) {
      validateBusinessManagers(foundBusiness).then((data) => {
        setBusinessManagers(data);
      });
    }
  }, [portalData, portalCode]);

  useEffect(() => {
    if (!businessManagers) return;

    const portalDataFiltered = portalData.find(
      (data) => data.staffPortalId === portalCode
    );
    setEventData((prev) => ({
      ...prev,
      portal: {
        ...prev.portal,
        abbreviatedName: portalDataFiltered?.abbreviatedName || "",
        staffPortalCatalogId: portalDataFiltered?.staffPortalId || "",
        businessManagerId: portalDataFiltered?.businessManagerId || "",
        publicCode: portalDataFiltered?.publicCode || "",
      },
      businessManager: {
        ...prev.businessManager,
        publicCode: businessManagers.publicCode || "",
        abbreviatedName: businessManagers.abbreviatedName || "",
        urlBrand: businessManagers.urlBrand || "",
        urlLogo: businessManagers.urlLogo || "",
      },
    }));
  }, [businessManagers, portalData, portalCode]);

  useEffect(() => {
    localStorage.setItem("businessUnitSigla", businessUnitSigla);

    if (businessUnitsToTheStaff && businessUnitSigla) {
      let businessUnit: IBusinessUnits | null = null;
      try {
        businessUnit = JSON.parse(businessUnitSigla) as IBusinessUnits;
      } catch (error) {
        console.error("Error parsing businessUnitSigla: ", error);
        return;
      }

      (async () => {
        const enumRoles = await getEnumerators(
          businessUnit.businessUnitPublicCode
        );
        setEventData((prev) => ({
          ...prev,
          businessUnit: {
            ...prev.businessUnit,
            abbreviatedName: businessUnit?.abbreviatedName || "",
            businessUnitPublicCode: businessUnit?.businessUnitPublicCode || "",
            languageId: businessUnit?.languageId || "",
            urlLogo: businessUnit?.urlLogo || "",
          },
          enumRole: enumRoles,
        }));
      })();
    }
  }, [businessUnitSigla, businessUnitsToTheStaff]);

  useEffect(() => {
    localStorage.setItem(
      "businessUnitsToTheStaff",
      JSON.stringify(businessUnitsToTheStaff)
    );
  }, [businessUnitsToTheStaff]);

  const appContext = useMemo(
    () => ({
      eventData,
      businessUnitSigla,
      businessUnitsToTheStaff,
      setEventData,
      setBusinessUnitSigla,
      setBusinessUnitsToTheStaff,
    }),
    [
      eventData,
      businessUnitSigla,
      businessUnitsToTheStaff,
      setEventData,
      setBusinessUnitSigla,
      setBusinessUnitsToTheStaff,
    ]
  );

  return appContext;
}

export { useAppContext };
