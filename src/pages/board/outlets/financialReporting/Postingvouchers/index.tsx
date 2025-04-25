import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Stack } from "@inubekit/inubekit";

import { IAccountingVouchers, ICreditRequest } from "@services/types";
import { getAccountingVouchers } from "@services/accountingVouchers";
import { getCreditRequestByCode } from "@services/creditRequets/getCreditRequestByCode";
import { AppContext } from "@context/AppContext";
import { IEntries } from "@components/data/TableBoard/types";
import { UnfoundData } from "@components/layout/UnfoundData";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";

import {
  actionsPostingvouchers,
  titlesPostingvouchers,
  actionMobile,
} from "./config";
import { errorMessages, errorObserver } from "../config";

interface IApprovalsProps {
  user: string;
  id: string;
  isMobile: boolean;
}
export const Postingvouchers = (props: IApprovalsProps) => {
  const { id, isMobile } = props;
  const { user } = useAuth0();
  const [error, setError] = useState(false);
  const [positionsAccountingVouchers, setPositionsAccountingVouchers] =
    useState<IAccountingVouchers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<ICreditRequest | null>(null);
  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const fetchCreditRequest = useCallback(async () => {
    try {
      const data = await getCreditRequestByCode(businessUnitPublicCode, id);
      setRequests(data[0] as ICreditRequest);
    } catch (error) {
      console.error(error);
      errorObserver.notify({
        id: "Management",
        message: (error as Error).message.toString(),
      });
    }
  }, [businessUnitPublicCode, id]);

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
          requests.creditRequestId
        );
        setPositionsAccountingVouchers(vouchers);
      } catch (error) {
        console.error("Error loading accounting vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountingVouchers();
  }, [user, requests, businessUnitPublicCode]);
  return (
    <Stack direction="column">
      <Fieldset
        title={errorMessages.Postingvouchers.titleCard}
        heightFieldset={isMobile ? "100%" : "162px"}
        hasTable
      >
        {error || (!loading && positionsAccountingVouchers.length === 0) ? (
          <UnfoundData
            title={errorMessages.PromissoryNotes.title}
            description={errorMessages.PromissoryNotes.description}
            buttonDescription={errorMessages.PromissoryNotes.button}
            onRetry={() => {
              setError(false);
              fetchCreditRequest();
            }}
          />
        ) : (
          <TableBoard
            id="postingvouchers"
            loading={loading}
            titles={titlesPostingvouchers}
            entries={positionsAccountingVouchers as unknown as IEntries[]}
            actions={actionsPostingvouchers}
            actionMobile={actionMobile}
            appearanceTable={{
              efectzebra: true,
              title: "primary",
              isStyleMobile: true,
            }}
            isFirstTable={true}
          />
        )}
      </Fieldset>
    </Stack>
  );
};
