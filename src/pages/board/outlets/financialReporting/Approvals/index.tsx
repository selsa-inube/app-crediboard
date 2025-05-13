import { useState, useEffect, useCallback, useContext } from "react";
import { Text, useFlag } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { BaseModal } from "@components/modals/baseModal";
import { IEntries } from "@components/data/TableBoard/types";
import { TextAreaModal } from "@components/modals/TextAreaModal";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { getCreditRequestByCode } from "@services/creditRequets/getCreditRequestByCode";
import { getNotificationOnApprovals } from "@services/notificationOnApprovals";
import { getApprovalsById } from "@services/financialReporting/getApprovals";
import { IApprovals } from "./types";
import { ICreditRequest } from "@services/types";
import {
  actionMobileApprovals,
  titlesApprovals,
  actionsApprovals,
  handleNotificationClick,
  handleErrorClick,
  desktopActions,
  getMobileActionsConfig,
  infoItems,
  entriesApprovals,
} from "@config/pages/board/outlet/financialReporting/configApprovals";
import { AppContext } from "@context/AppContext";

import { errorObserver, errorMessages } from "../config";
import { dataInfoApprovals } from "./config";

interface IApprovalsProps {
  user: string;
  isMobile: boolean;
  id: string;
}

export const Approvals = (props: IApprovalsProps) => {
  const { isMobile, id } = props;
  const [requests, setRequests] = useState<ICreditRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvalsEntries, setApprovalsEntries] = useState<IEntries[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedData, setSelectedData] = useState<IEntries | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addFlag } = useFlag();
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
    if (id) fetchCreditRequest();
  }, [fetchCreditRequest, id]);

  const fetchApprovalsData = useCallback(async () => {
    if (!requests?.creditRequestId) return;
    setLoading(true);
    setError(null);
    try {
      const data: IApprovals = await getApprovalsById(
        businessUnitPublicCode,
        requests.creditRequestId
      );
      if (data && Array.isArray(data)) {
        const entries: IEntries[] = entriesApprovals(data).map((entry) => ({
          ...entry,
          error: entry.concept === "Pendiente",
        }));
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
  }, [businessUnitPublicCode, requests?.creditRequestId]);

  useEffect(() => {
    fetchApprovalsData();
  }, [fetchApprovalsData]);

  const handleNotificationClickBound = (data: IEntries) => {
    handleNotificationClick(data, setSelectedData, setShowNotificationModal);
  };

  const handleErrorClickBound = (data: IEntries) => {
    handleErrorClick(data, setSelectedData, setShowErrorModal);
  };

  const desktopActionsConfig = desktopActions(
    actionsApprovals,
    handleNotificationClickBound,
    handleErrorClickBound
  );

  const mobileActions = getMobileActionsConfig(
    actionMobileApprovals,
    handleNotificationClickBound,
    handleErrorClickBound
  );

  const handleSubmit = async () => {
    try {
      const code = await getNotificationOnApprovals("test", {
        approvalId: selectedData?.approvalId?.toString() ?? "",
        creditRequestId: requests?.creditRequestId ?? "",
      });

      addFlag({
        title: dataInfoApprovals.notifySend,
        description: `${dataInfoApprovals.notidyDescription} ${code?.codeNotification}.`,
        appearance: "success",
        duration: 5000,
      });
      setShowNotificationModal(false);
    } catch (error) {
      console.error("Error:", error);
      addFlag({
        title: dataInfoApprovals.error,
        description: `${error}.`,
        appearance: "danger",
        duration: 5000,
      });
      setShowNotificationModal(false);
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
        title={errorMessages.approval.titleCard}
        heightFieldset="100%"
        hasTable
        hasError={!requests ? true : false}
      >
        {!requests || error ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessages.approval.title}
            description={errorMessages.approval.description}
            buttonDescription={errorMessages.approval.button}
            onRetry={handleRetry}
          />
        ) : (
          <TableBoard
            id="usuarios"
            titles={titlesApprovals}
            entries={approvalsEntries}
            actions={desktopActionsConfig}
            actionMobile={mobileActions}
            loading={loading}
            appearanceTable={{
              widthTd: isMobile ? "70%" : undefined,
              efectzebra: true,
              title: "primary",
              isStyleMobile: true,
            }}
            isFirstTable={true}
            infoItems={infoItems}
          />
        )}
      </Fieldset>
      {showNotificationModal && selectedData && (
        <BaseModal
          title={dataInfoApprovals.notify}
          nextButton="Enviar"
          handleNext={handleSubmit}
          handleClose={handleCloseNotificationModal}
          width="400px"
        >
          <Text>{dataInfoApprovals.notifyModal}</Text>
        </BaseModal>
      )}
      {showErrorModal && selectedData && (
        <TextAreaModal
          title="Error"
          buttonText="Cerrar"
          inputLabel="Descripción del error"
          inputPlaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec mollis felis. Donec eget sapien viverra, tincidunt ex ut, ornare nisi. Nulla eget fermentum velit."
          readOnly
          disableTextarea={true}
          onCloseModal={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};
