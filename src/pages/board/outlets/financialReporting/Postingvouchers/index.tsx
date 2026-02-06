import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { Stack } from "@inubekit/inubekit";
import { useIAuth } from "@inube/iauth-react";

import { ICreditRequest } from "@services/creditRequest/query/types";
import { getAccountingVouchers } from "@services/creditRequest/query/accountingVouchers";
import { IAccountingVouchers } from "@services/creditRequest/query/types";
import { getCreditRequestByCode } from "@services/creditRequest/query/getCreditRequestByCode";
import { AppContext } from "@context/AppContext";
import { IEntries } from "@components/data/TableBoard/types";
import { UnfoundData } from "@components/layout/UnfoundData";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { useEnum } from "@hooks/useEnum";

import {
  actionsPostingvouchers,
  titlesPostingvouchersEnum,
  actionMobile,
  documentCodeText,
} from "./config";
import { errorMessagesEnum, errorObserver } from "../config";

interface IApprovalsProps {
  user: string;
  id: string;
  isMobile: boolean;
}
export const Postingvouchers = (props: IApprovalsProps) => {
  const { id, isMobile } = props;
  const { lang } = useEnum();
  const { user } = useIAuth();

  const [error, setError] = useState(false);
  const [positionsAccountingVouchers, setPositionsAccountingVouchers] =
    useState<IAccountingVouchers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<ICreditRequest | null>(null);
  const { businessUnitSigla, eventData } = useContext(AppContext);

  const titles = useMemo(() => {
    return Object.values(titlesPostingvouchersEnum).map((title) => ({
      id: title.id,
      titleName: title.i18n[lang],
      priority: title.priority,
    }));
  }, [lang]);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.publicCode;

  const fetchCreditRequest = useCallback(async () => {
    try {
      const data = await getCreditRequestByCode(
        businessUnitPublicCode,
        businessManagerCode,
        id,
        eventData.user.identificationDocumentNumber || "",
        eventData.token || "",
      );
      setRequests(data[0] as ICreditRequest);
    } catch (error) {
      console.error(error);
      errorObserver.notify({
        id: "Management",
        message: (error as Error).message.toString(),
      });
    }
  }, [
    businessUnitPublicCode,
    id,
    businessManagerCode,
    eventData.token,
    eventData.user.identificationDocumentNumber,
  ]);

  useEffect(() => {
    fetchCreditRequest();
  }, [fetchCreditRequest]);

  useEffect(() => {
    const fetchAccountingVouchers = async () => {
      if (!requests?.creditRequestId) return;
      setLoading(true);
      try {
        const vouchers = await getAccountingVouchers(
          businessUnitPublicCode,
          businessManagerCode,
          requests.creditRequestId,
          eventData.token || "",
        );
        setPositionsAccountingVouchers(vouchers);
      } catch (error) {
        console.error("Error loading accounting vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountingVouchers();
  }, [
    user,
    requests,
    businessUnitPublicCode,
    businessManagerCode,
    eventData.token,
  ]);

  const transformedEntries = useMemo(() => {
    return positionsAccountingVouchers.map((voucher) => ({
      ...voucher,
      documentCode:
        !voucher.documentCode || voucher.documentCode === "undefined"
          ? documentCodeText.i18n[lang]
          : voucher.documentCode,
    }));
  }, [positionsAccountingVouchers, lang]);

  return (
    <Stack direction="column">
      <Fieldset
        title={errorMessagesEnum.postingVouchers.titleCard.i18n[lang]}
        heightFieldset={isMobile ? "100%" : "162px"}
        hasTable
        hasOverflow={isMobile}
      >
        {error || (!loading && positionsAccountingVouchers.length === 0) ? (
          <UnfoundData
            title={errorMessagesEnum.postingVouchers.title.i18n[lang]}
            description={
              errorMessagesEnum.postingVouchers.description.i18n[lang]
            }
            buttonDescription={
              errorMessagesEnum.postingVouchers.button.i18n[lang]
            }
            onRetry={() => {
              setError(false);
              fetchCreditRequest();
            }}
          />
        ) : (
          <TableBoard
            id="postingvouchers"
            loading={loading}
            titles={titles}
            entries={transformedEntries as unknown as IEntries[]}
            actions={actionsPostingvouchers}
            actionMobile={actionMobile}
            appearanceTable={{
              efectzebra: true,
              title: "primary",
              isStyleMobile: true,
            }}
            isFirstTable={true}
            hideSecondColumnOnMobile={false}
            showUserIconOnTablet={false}
          />
        )}
      </Fieldset>
    </Stack>
  );
};
