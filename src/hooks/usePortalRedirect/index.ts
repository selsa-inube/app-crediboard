import { useState, useEffect, useMemo } from "react";

import { IStaffPortalByBusinessManager } from "@services/staff-portals-by-business-manager/types";
import { getStaffPortalsByBusinessManager } from "@services/staff-portals-by-business-manager/SearchAllStaffPortalsByBusinessManager";
import { getBusinessManagers } from "@services/businessManager/SearchByIdBusinessManager";
import { decrypt, encrypt } from "@utils/encrypt/encrypt";
import { IBusinessManagers } from "@services/businessManager/types";

interface AuthConfig {
  clientId: string;
  clientSecret: string;
}

const usePortalLogic = () => {
  const [portalData, setPortalData] =
    useState<IStaffPortalByBusinessManager | null>(null);
  const [businessManager, setBusinessManager] = useState<IBusinessManagers>(
    {} as IBusinessManagers
  );
  const [authConfig, setAuthConfig] = useState<AuthConfig | null>(null);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const rawPortalCode = useMemo(() => {
    const urlCode = new URLSearchParams(window.location.search)
      .get("portal")
      ?.trim();
    if (urlCode) {
      localStorage.setItem("portalCode", encrypt(urlCode));
      return urlCode;
    }

    const storedEncrypted = localStorage.getItem("portalCode");
    if (storedEncrypted) {
      try {
        return decrypt(storedEncrypted);
      } catch (err) {
        return null;
      }
    }

    return null;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!rawPortalCode) {
        setCodeError(1000);
        setLoading(false);
        return;
      }

      try {
        const portals = await getStaffPortalsByBusinessManager(rawPortalCode);

        if (!portals || portals.length === 0) {
          setCodeError(1001);
          setLoading(false);
          return;
        }
        const portalData = portals[0];
        setPortalData(portalData);

        const { businessManagerCode } = portalData;

        if (!businessManagerCode) {
          setCodeError(1002);
          setLoading(false);
          return;
        }

        const manager = await getBusinessManagers(businessManagerCode);
        setBusinessManager(manager);
        if (manager.clientId && manager.clientSecret) {
          setAuthConfig({
            clientId: manager.clientId,
            clientSecret: manager.clientSecret,
          });
        }

        setLoading(false);
      } catch (error) {
        setCodeError(1003);
        setLoading(false);
      }
    };

    loadData();
  }, [rawPortalCode]);

  const hasAuthError = !authConfig || !!codeError;

  return {
    portalData,
    businessManager,
    authConfig,
    codeError,
    loading,
    hasAuthError,
  };
};

export { usePortalLogic };
