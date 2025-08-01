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
import { getSearchUseCaseForStaff } from "@services/staffs/SearchUseCaseForStaff";

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
    const fetchStaffData = async () => {
      try {
        const staffData = await getStaff();
        if (!staffData.length) return;
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
        useCases: [],
      },
      preferences: {
        boardOrientation: "vertical",
        showPinnedOnly: false,
      },
    },
    enumRole: [],
  });

  useEffect(() => {
    if (
      !eventData.businessUnit.abbreviatedName ||
      !eventData.businessManager.publicCode ||
      !eventData.user.userAccount
    ) {
      return;
    }
    (async () => {
      try {
        const staffUseCaseData = await getSearchUseCaseForStaff(
          eventData.businessUnit.abbreviatedName,
          eventData.businessManager.publicCode,
          eventData.user.userAccount.substring(0, 20)
        );
        setStaffUseCases(staffUseCaseData);
      } catch (error) {
        console.error("Error fetching use cases:", error);
      }
    })();
  }, [
    eventData.businessUnit.abbreviatedName,
    eventData.businessManager.publicCode,
    eventData.user.userAccount,
  ]);

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
