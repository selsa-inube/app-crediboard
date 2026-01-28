import { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import { getMaximumCreditLimitByLineOfCreditRegulation } from "@services/creditLimit/getMaximumCreditLimitByLineOfCreditRegulation";
import { IMaximumCreditLimit } from "@services/creditLimit/types";
import { IdataMaximumCreditLimitService } from "@pages/simulateCredit/CreditLimitCard/types";
import { useEnum } from "@hooks/useEnum";
import { AppContext } from "@context/AppContext";

import { MaxLimitModalUI } from "./interface";


export interface PaymentCapacityProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  iconVisible?: boolean;
  loading?: boolean;
  handleClose: () => void;
}

export const MaxLimitModal = (props: PaymentCapacityProps) => {
  const {
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
    loading = false,
    handleClose,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const { eventData } = useContext(AppContext);
  const [error, setError] = useState(false);
  const [dataMaximumCreditLimit, setDataMaximumCreditLimit] =
    useState<IMaximumCreditLimit>({
      customerCreditLimitInLineOfCredit: 0,
      customerTotalObligationsInLineOfCredit: 0,
      lineOfCreditLoanAmountLimitRegulation: 0,
    });

  const { lang } = useEnum();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMaximumCreditLimitByLineOfCreditRegulation(
          businessUnitPublicCode,
          businessManagerCode,
          dataMaximumCreditLimitService.lineOfCreditAbbreviatedName || "",
          dataMaximumCreditLimitService.identificationDocumentType,
          dataMaximumCreditLimitService.identificationDocumentNumber,
          dataMaximumCreditLimitService.moneyDestination,
          dataMaximumCreditLimitService.primaryIncomeType,
          eventData.token
        );

        if (data) {
          setDataMaximumCreditLimit(data);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchData();
  }, [
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
    error,
    eventData.token
  ]);

  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 2000);
  }, []);

  return (
    <MaxLimitModalUI
      loading={loading}
      error={error}
      handleClose={handleClose}
      isMobile={isMobile}
      dataMaximumCreditLimitService={dataMaximumCreditLimit}
      lang={lang}
    />
  );
};
