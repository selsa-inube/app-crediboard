import { useState, useEffect, useMemo } from "react";

import { IStaffPortalByBusinessManager } from "@services/staff-portals-by-business-manager/types";
import {
  validateBusinessManagers,
  validateConsultation,
} from "@context/AppContext/utils";
import { ICrediboardData } from "@context/AppContext/types";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { getEnumerators } from "@services/enumerators";
import { getStaff } from "@services/staff/staffs";
import { decrypt } from "@utils/encrypt/encrypt";
import { getSearchUseCaseForStaff } from "@services/staffs/SearchUseCaseForStaff";
import { useIAuth } from "@context/AuthContext/useAuthContext";
import { IBusinessManagers } from "@services/businessManager/types";

interface IBusinessUnits {
  businessUnitPublicCode: string;
  abbreviatedName: string;
  languageId: string;
  urlLogo: string;
}

function useAppContext() {
  const { user } = useIAuth();
  const [portalData, setPortalData] = useState<IStaffPortalByBusinessManager[]>(
    []
  );
  const [staffUseCases, setStaffUseCases] = useState<string[]>([]);

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
  useEffect(() => {
    if (user) {
      setEventData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          userAccount: user.username || "",
          userName: user.nickname || "",
          identificationDocumentNumber: user.id || "",
        },
      }));
    }
  }, [user]);
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const userIdentifier = user?.username;
        if (!userIdentifier) return;
        const staffData = await getStaff(userIdentifier);
        if (!staffData.length) return;
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    if (user?.username) {
      fetchStaffData();
    }
  }, [user?.username]);

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
      userAccount: user?.username || "",
      userName: user?.nickname || "",
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
        useCases: [],
      },
      preferences: {
        boardOrientation: "vertical",
        showPinnedOnly: false,
      },
    },
    enumRole: [],
  });

  const { abbreviatedName } = eventData.businessUnit;
  const managerCode = eventData.businessManager.publicCode;
  const userDocId = eventData.user?.identificationDocumentNumber || "";

  useEffect(() => {
    if (!abbreviatedName || !managerCode || !userDocId) return;

    (async () => {
      try {
        const staffUseCaseData = await getSearchUseCaseForStaff(
          abbreviatedName,
          managerCode,
          userDocId
        );
        setStaffUseCases(staffUseCaseData);
      } catch (error) {
        console.error("Error fetching use cases:", error);
      }
    })();
  }, [abbreviatedName, managerCode, userDocId]);

  useEffect(() => {
    validateConsultation(portalCode).then((data) => {
      setPortalData(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!portalCode) return;
    const portalDataFiltered = portalData.filter(
      (data) => data.staffPortalId === portalCode
    );
    const foundBusiness = portalDataFiltered.find(
      (bussines) => bussines
    )?.businessManagerCode;

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
        businessManagerId: portalDataFiltered?.businessManagerCode || "",
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

  useEffect(() => {
    if (staffUseCases) {
      setEventData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          staff: {
            ...prev.user.staff,
            useCases: staffUseCases,
          },
        },
      }));
    }
  }, [staffUseCases]);

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
