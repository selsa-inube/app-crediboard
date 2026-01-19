import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useContext, useEffect } from "react";

import { AppContext } from "@context/AppContext";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { useEnum } from "@hooks/useEnum";

import { CheckingCredentialsUI } from "./interface";

function CheckingCredentials({
  businessUnits,
}: {
  businessUnits: IBusinessUnitsPortalStaff[];
}) {
  const { lang } = useEnum();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const { eventData, setBusinessUnitSigla } = useContext(AppContext);

  const checkCredentials = useCallback(async () => {
    try {
      if (!eventData) {
        return;
      }

      if (!businessUnits || businessUnits.length === 0) {
        navigate("/login/error/not-related-businessUnits");
      } else if (businessUnits.length === 1) {
        const selectedBusinessUnit = businessUnits[0];
        const selectJSON = JSON.stringify(selectedBusinessUnit);

        setBusinessUnitSigla(selectJSON);

        const returnTo = searchParams.get("returnTo");
        
        if (returnTo) {
           navigate(decodeURIComponent(returnTo));
        } else {
           navigate("/login/loading-app");
        }

      } else {
        const returnTo = searchParams.get("returnTo");
        let targetPath = `/login/${eventData.user.userAccount}/clients`;
        
        if (returnTo) {
            targetPath += `?returnTo=${encodeURIComponent(returnTo)}`;
        }
        
        navigate(targetPath);
      }
    } catch (error) {
      navigate("/login/error/not-available");
    }
  }, [eventData, navigate, businessUnits, setBusinessUnitSigla, searchParams]);

  useEffect(() => {
    const timer = setTimeout(checkCredentials, 2000);
    return () => clearTimeout(timer);
  }, [checkCredentials]);

  return <CheckingCredentialsUI lang={lang} />;
}

export { CheckingCredentials };
