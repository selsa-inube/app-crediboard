import { useState, useEffect, useCallback, useRef, useContext } from "react";
import {
  MdOutlineSend,
  MdAttachFile,
  MdInfoOutline,
  MdOutlineInfo,
} from "react-icons/md";
import { Stack, Icon, Textfield } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { Message } from "@components/data/Message";
import { ITraceType } from "@services/creditRequest/command/types";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import userNotFound from "@assets/images/ItemNotFound.png";
import { getTraceByCreditRequestId } from "@services/creditRequest/query/getTraceByCreditRequestId";
import { getCreditRequestByCode } from "@services/creditRequest/query/getCreditRequestByCode";
import { registerNewsToCreditRequest } from "@services/creditRequest/command/registerNewsToCreditRequest";
import { ICreditRequest } from "@services/creditRequest/query/types";
import { AppContext } from "@context/AppContext";
import { ListModal } from "@components/modals/ListModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { privilegeCrediboard } from "@config/privilege";
import { ErrorModal } from "@components/modals/ErrorModal";

import { ChatContent, SkeletonContainer, SkeletonLine } from "./styles";
import {
  traceObserver,
  errorObserver,
  errorMessages,
  optionButtons,
  editCreditApplicationLabels,
} from "../config";
import { DetailsModal } from "./DetailsModal";

interface IManagementProps {
  id: string;
  isMobile: boolean;
  updateData?: number;
}

export const Management = ({ id, isMobile, updateData }: IManagementProps) => {
  const [creditRequest, setCreditRequest] = useState<ICreditRequest | null>(
    null
  );
  const [traces, setTraces] = useState<ITraceType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ITraceType | null>(
    null
  );
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; name: string; file: File }[]
  >([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const chatContentRef = useRef<HTMLDivElement>(null);

  const notifyError = useCallback((message: string) => {
    errorObserver.notify({ id: "Management", message });
  }, []);

  const fetchCreditRequest = useCallback(async () => {
    try {
      const data = await getCreditRequestByCode(
        businessUnitPublicCode,
        businessManagerCode,
        id,
        userAccount
      );
      setCreditRequest(data[0] as ICreditRequest);
    } catch (error) {
      console.error(error);
      notifyError((error as Error).message);
    }
  }, [
    businessUnitPublicCode,
    id,
    userAccount,
    notifyError,
    businessManagerCode,
  ]);

  useEffect(() => {
    if (id) fetchCreditRequest();
  }, [fetchCreditRequest, id]);

  const fetchData = useCallback(async () => {
    if (!creditRequest?.creditRequestId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getTraceByCreditRequestId(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequest.creditRequestId
      );
      setTraces(Array.isArray(data) ? data.flat() : []);
    } catch (err) {
      notifyError((err as Error).message);
      setError("Error al intentar conectar con el servicio de trazabilidad.");
    } finally {
      setLoading(false);
    }
  }, [
    businessUnitPublicCode,
    creditRequest?.creditRequestId,
    businessManagerCode,
    notifyError,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData, updateData]);

  useEffect(() => {
    traceObserver.subscribe(fetchData);
    return () => traceObserver.unsubscribe(fetchData);
  }, [fetchData]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [traces]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const newTrace: ITraceType = {
      creditRequestId: creditRequest?.creditRequestId,
      traceValue: newMessage,
      traceType: "Message",
      executionDate: new Date().toISOString(),
    };

    try {
      await registerNewsToCreditRequest(
        businessUnitPublicCode,
        businessManagerCode,
        eventData.user.identificationDocumentNumber || "",
        newTrace
      );
      setTraces((prev) => [...prev, newTrace]);
      setNewMessage("");
    } catch (error) {
      setErrorMessage(errorMessages.registerNewsToACreditRequest.description);
      setErrorModal(true);
    }
  };

  const handleFormSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleRetry = () => {
    setError(null);
    fetchData();
  };

  const renderSkeletons = () =>
    [...Array(5)].map((_, index) => (
      <SkeletonContainer
        key={index}
        type={index % 2 === 0 ? "sent" : "received"}
      >
        <SkeletonLine width="30%" animated={true} />
      </SkeletonContainer>
    ));

  const handleIconClick = (trace: ITraceType) => {
    setSelectedMessage(trace);
    setDetailsOpen(true);
  };

  const getMessageType = (
    traceType: string
  ): "sent" | "received" | "system" => {
    const map: Record<string, "sent" | "received" | "system"> = {
      Novelty: "sent",
      Message: "received",
      Executed_task: "system",
    };

    return map[traceType] ?? "sent";
  };

  const renderMessages = () =>
    traces.map((trace, index) => (
      <Message
        key={index}
        type={getMessageType(trace.traceType)}
        timestamp={trace.executionDate || ""}
        message={trace.traceValue}
        icon={<MdInfoOutline size={14} />}
        onIconClick={() => {
          handleIconClick(trace);
        }}
      />
    ));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };

  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });

  const handleAttachmentsClose = async (filesSaved: boolean = false) => {
    setShowAttachments(false);
    if (filesSaved) {
      setLoading(true);
      await fetchData();
    }
  };

  return (
    <>
      <Fieldset
        title={errorMessages.Management.titleCard}
        heightFieldset="340px"
        aspectRatio={isMobile ? "auto" : "1"}
        hasError={error ? true : false}
      >
        {!creditRequest || error ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessages.Management.title}
            description={errorMessages.Management.description}
            buttonDescription={errorMessages.Management.button}
            onRetry={handleRetry}
          />
        ) : (
          <>
            <Stack direction="column" height={!isMobile ? "100%" : "292px"}>
              <ChatContent ref={chatContentRef}>
                {loading ? renderSkeletons() : renderMessages()}
              </ChatContent>
              <form>
                <Stack
                  alignItems="center"
                  direction="row"
                  gap="16px"
                  margin="2px 4px"
                >
                  <Icon
                    appearance="primary"
                    cursorHover
                    size="24px"
                    icon={<MdAttachFile />}
                    onClick={() => setShowAttachments(true)}
                    disabled={editCreditApplication}
                  />
                  <Textfield
                    id="text"
                    placeholder={editCreditApplicationLabels.placeholderExample}
                    fullwidth
                    value={newMessage}
                    onChange={handleInputChange}
                    disabled={editCreditApplication}
                  />
                  <Icon
                    appearance="primary"
                    cursorHover
                    size="24px"
                    icon={<MdOutlineSend />}
                    onClick={handleFormSubmit}
                    disabled={editCreditApplication}
                  />
                  {editCreditApplication ? (
                    <Icon
                      icon={<MdOutlineInfo />}
                      appearance="primary"
                      size="16px"
                      cursorHover
                      onClick={handleInfo}
                    />
                  ) : (
                    <></>
                  )}
                </Stack>
              </form>
            </Stack>
            {detailsOpen && selectedMessage && (
              <DetailsModal
                data={selectedMessage as ITraceType}
                handleClose={() => setDetailsOpen(false)}
              />
            )}
            {showAttachments && (
              <ListModal
                title="Adjuntar"
                handleClose={handleAttachmentsClose}
                optionButtons={optionButtons}
                buttonLabel="Guardar"
                id={creditRequest.creditRequestId}
                isViewing={false}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
              />
            )}
            {isModalOpen ? (
              <InfoModal
                onClose={handleInfoModalClose}
                title={privilegeCrediboard.title}
                subtitle={privilegeCrediboard.subtitle}
                description={privilegeCrediboard.description}
                nextButtonText={privilegeCrediboard.nextButtonText}
                isMobile={isMobile}
              />
            ) : (
              <></>
            )}
          </>
        )}
      </Fieldset>
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
