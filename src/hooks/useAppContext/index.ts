import { useState, useEffect, useMemo } from "react";
import { useIAuth } from "@inube/iauth-react";

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
import { IBusinessManagers } from "@services/businessManager/types";
import { getSearchOptionForStaff } from "@services/staff/staffs/searchOptionForStaff";
import { IOptionStaff } from "@services/staff/staffs/searchOptionForStaff/types";

interface IBusinessUnits {
  businessUnitPublicCode: string;
  abbreviatedName: string;
  languageId: string;
  urlLogo: string;
}

function useAppContext() {
  const { user, isLoading: isIAuthLoading } = useIAuth();

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
  const [optionStaffData, setOptionStaffData] = useState<IOptionStaff[]>([]);

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
      userAccount: "",
      userName: "",
      identificationDocumentNumber: "",
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
    if (!isIAuthLoading) {
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
    }
  }, [user, isIAuthLoading]);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const userIdentifier = user?.id;
        if (!userIdentifier || isIAuthLoading) {
          return;
        }

        const staffData = await getStaff(userIdentifier);
        if (!staffData.length) return;

        setEventData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            staff: {
              ...prev.user.staff,
              biologicalSex: staffData[0].biologicalSex,
              birthDay: staffData[0].birthDay,
              businessManagerCode: staffData[0].businessManagerCode,
              identificationDocumentNumber:
                staffData[0].identificationDocumentNumber,
              identificationTypeNaturalPerson:
                staffData[0].identificationTypeNaturalPerson,
              missionName: staffData[0].missionName,
              principalEmail: staffData[0].principalEmail,
              principalPhone: staffData[0].principalPhone,
              staffByBusinessUnitAndRole:
                staffData[0].staffByBusinessUnitAndRole,
              staffId: staffData[0].staffId,
              staffName: staffData[0].staffName,
              userAccount: staffData[0].userAccount,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username, isIAuthLoading]);

  useEffect(() => {
    const identificationNumber =
      eventData?.user?.identificationDocumentNumber || "";

    if (
      !eventData.businessUnit.abbreviatedName ||
      !eventData.businessManager.publicCode ||
      !identificationNumber
    ) {
      return;
    }

    (async () => {
      try {
        const staffUseCaseData = await getSearchUseCaseForStaff(
          eventData.businessUnit.abbreviatedName,
          eventData.businessManager.publicCode,
          identificationNumber
        );
        setStaffUseCases(staffUseCaseData);
      } catch (error) {
        console.error("Error fetching use cases:", error);
      }
    })();
  }, [
    eventData.businessUnit.abbreviatedName,
    eventData.businessManager.publicCode,
    eventData?.user?.identificationDocumentNumber,
  ]);

  const userIdentifier = eventData?.user?.identificationDocumentNumber;
  useEffect(() => {
    const fetchOptionStaff = async () => {
      try {
        if (
          !eventData?.portal?.publicCode ||
          !eventData?.businessUnit?.businessUnitPublicCode ||
          !user?.username ||
          isIAuthLoading
        ) {
          return;
        }

        const result = await getSearchOptionForStaff(
          eventData.portal.publicCode,
          eventData.businessUnit.businessUnitPublicCode,
          eventData.businessManager.abbreviatedName,
          userIdentifier || ""
        );
        setOptionStaffData(result);
      } catch (error) {
        console.error("Error fetching option staff:", error);
      }
    };

    fetchOptionStaff();
  }, [
    eventData?.portal?.publicCode,
    eventData?.businessUnit?.businessUnitPublicCode,
    eventData.businessManager.abbreviatedName,
    user?.username,
    isIAuthLoading,
    userIdentifier,
  ]);

  useEffect(() => {
    if (isIAuthLoading || !portalCode) return;

    validateConsultation(portalCode).then((data) => {
      setPortalData(data);
    });
  }, [portalCode, isIAuthLoading]);

  useEffect(() => {
    if (!portalCode || isIAuthLoading) return;

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
  }, [portalData, portalCode, isIAuthLoading]);

  useEffect(() => {
    if (!businessManagers || isIAuthLoading) return;

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
  }, [businessManagers, portalData, portalCode, isIAuthLoading]);

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
          businessUnit.businessUnitPublicCode,
          businessManagers.abbreviatedName
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
  }, [businessUnitSigla, businessUnitsToTheStaff, businessManagers]);

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
      optionStaffData,
      isIAuthLoading,
      setEventData,
      setBusinessUnitSigla,
      setBusinessUnitsToTheStaff,
      setOptionStaffData,
    }),
    [
      eventData,
      businessUnitSigla,
      businessUnitsToTheStaff,
      optionStaffData,
      isIAuthLoading,
    ]
  );

  return appContext;
}

export { useAppContext };
