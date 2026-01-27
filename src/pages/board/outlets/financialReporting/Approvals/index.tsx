import { useState, useEffect, useCallback, useContext } from "react";
import { Text, useFlag } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { BaseModal } from "@components/modals/baseModal";
import { IEntries } from "@components/data/TableBoard/types";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { getCreditRequestByCode } from "@services/creditRequest/query/getCreditRequestByCode";
import { getNotificationOnApprovals } from "@services/creditRequest/command/notificationOnApprovals";
import { getApprovalsById } from "@services/creditRequest/query/getApprovals";
import { IApprovals } from "@services/creditRequest/query/types";
import { ICreditRequest } from "@services/creditRequest/query/types";
import {
  getActionMobileApprovals,
  getTitlesApprovals,
  handleNotificationClick,
  handleErrorClick,
  desktopActions,
  getMobileActionsConfig,
  entriesApprovals,
  getActionsMobileIcon,
} from "@config/pages/board/outlet/financialReporting/configApprovals";
import { AppContext } from "@context/AppContext";
import { ErrorModal } from "@components/modals/ErrorModal";
import { useEnum } from "@hooks/useEnum";

import { errorObserver, errorMessagesEnum } from "../config";
import { dataInfoApprovalsEnum } from "./config";

interface IApprovalsProps {
  user: string;
  isMobile: boolean;
  id: string;
  setApprovalsEntries: (entries: IEntries[]) => void;
  approvalsEntries: IEntries[];
}

export const Approvals = (props: IApprovalsProps) => {
  const { isMobile, id, setApprovalsEntries, approvalsEntries } = props;
  const { lang } = useEnum();
  const [requests, setRequests] = useState<ICreditRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedData, setSelectedData] = useState<IEntries | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addFlag } = useFlag();
  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const fetchCreditRequest = useCallback(async () => {
    try {
      const data = await getCreditRequestByCode(
        businessUnitPublicCode,
        businessManagerCode,
        id,
        userAccount,
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
    userAccount,
    businessManagerCode,
    eventData.token,
  ]);

  useEffect(() => {
    if (id) fetchCreditRequest();
  }, [fetchCreditRequest, id]);

  const fetchApprovalsData = useCallback(async () => {
    if (!requests?.creditRequestId) return;
    setLoading(true);
    setError(null);
    try {
      const data: IApprovals = await getApprovalsById(
        businessUnitPublicCode,
        businessManagerCode,
        requests.creditRequestId,
        eventData.token || "",
      );
      if (data && Array.isArray(data)) {
        const entries: IEntries[] = entriesApprovals(data, lang).map(
          (entry) => ({
            ...entry,
            error: entry.concept === "Pendiente",
          }),
        );
        setApprovalsEntries(entries);
      }
    } catch (error) {
      console.error(error);
      errorObserver.notify({
        id: "Aprovals",
        message: (error as Error).message.toString(),
      });
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, requests?.creditRequestId, businessManagerCode]);

  useEffect(() => {
    fetchApprovalsData();
  }, [fetchApprovalsData]);

  const handleNotificationClickBound = (data: IEntries) => {
    handleNotificationClick(
      data,
      setSelectedData,
      setShowNotificationModal,
      lang,
    );
  };

  const handleErrorClickBound = (data: IEntries) => {
    handleErrorClick(data, setSelectedData, setErrorModal, lang);
  };

  const desktopActionsConfig = !isMobile
    ? desktopActions(
        [],
        handleNotificationClickBound,
        handleErrorClickBound,
        lang,
      )
    : [];

  const mobileActions = !isMobile
    ? getMobileActionsConfig(
        getActionMobileApprovals(lang),
        handleNotificationClickBound,
        handleErrorClickBound,
        lang,
      )
    : [];

  const handleSubmit = async () => {
    try {
      const code = await getNotificationOnApprovals(
        businessUnitPublicCode,
        businessManagerCode,
        {
          approvalId: selectedData?.approvalId?.toString() ?? "",
          creditRequestId: requests?.creditRequestId ?? "",
        },
        eventData.token,
      );

      addFlag({
        title: dataInfoApprovalsEnum.notifySend.i18n[lang],
        description: `${dataInfoApprovalsEnum.notidyDescription.i18n[lang]} ${code?.codeNotification}.`,
        appearance: "success",
        duration: 5000,
      });
      setShowNotificationModal(false);
    } catch (error) {
      setShowNotificationModal(false);

      setErrorMessage(dataInfoApprovalsEnum.error.i18n[lang]);
      setErrorModal(true);
    }
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
  };

  const handleRetry = () => {
    fetchApprovalsData();
  };

  return (
    <>
      <Fieldset
        title={errorMessagesEnum.approval.titleCard.i18n[lang]}
        heightFieldset="100%"
        hasTable
        hasError={!requests ? true : false}
        hasOverflow={isMobile}
      >
        {!requests || error ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessagesEnum.approval.title.i18n[lang]}
            description={errorMessagesEnum.approval.description.i18n[lang]}
            buttonDescription={errorMessagesEnum.approval.button.i18n[lang]}
            onRetry={handleRetry}
          />
        ) : (
          <TableBoard
            id="usuarios"
            titles={getTitlesApprovals(lang)}
            entries={approvalsEntries}
            actions={desktopActionsConfig}
            actionMobile={mobileActions}
            actionMobileIcon={getActionsMobileIcon(lang)}
            loading={loading}
            isFirstTable={true}
            hideTagOnTablet={false}
            hideSecondColumnOnTablet={true}
            enableStickyActions={false}
            showPendingWarningIcon={true}
          />
        )}
      </Fieldset>
      {showNotificationModal && selectedData && (
        <BaseModal
          title={dataInfoApprovalsEnum.notify.i18n[lang]}
          nextButton="Enviar"
          handleNext={handleSubmit}
          handleClose={handleCloseNotificationModal}
          width={isMobile ? "290px" : "400px"}
        >
          <Text>{dataInfoApprovalsEnum.notifyModal.i18n[lang]}</Text>
        </BaseModal>
      )}

      {errorModal && (
        <ErrorModal
          isMobile={isMobile}
          message={errorMessage}
          handleClose={() => {
            setErrorModal(false);
          }}
        />
      )}
    </>
  );
};
