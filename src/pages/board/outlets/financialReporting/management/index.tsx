import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { MdOutlineSend, MdAttachFile, MdInfoOutline } from "react-icons/md";
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

import { ChatContent, SkeletonContainer, SkeletonLine } from "./styles";
import {
  traceObserver,
  errorObserver,
  errorMessages,
  optionButtons,
} from "../config";
import { DetailsModal } from "./DetailsModal";

interface IManagementProps {
  id: string;
  isMobile: boolean;
  updateData?: boolean;
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
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const chatContentRef = useRef<HTMLDivElement>(null);

  const notifyError = useCallback((message: string) => {
    errorObserver.notify({ id: "Management", message });
  }, []);

  const fetchCreditRequest = useCallback(async () => {
    try {
      const data = await getCreditRequestByCode(
        businessUnitPublicCode,
        id,
        userAccount
      );
      setCreditRequest(data[0] as ICreditRequest);
    } catch (error) {
      console.error(error);
      notifyError((error as Error).message);
    }
  }, [businessUnitPublicCode, id, userAccount, notifyError]);

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
        creditRequest.creditRequestId
      );
      setTraces(Array.isArray(data) ? data.flat() : []);
    } catch (err) {
      notifyError((err as Error).message);
      setError("Error al intentar conectar con el servicio de trazabilidad.");
    } finally {
      setLoading(false);
    }
  }, [businessUnitPublicCode, creditRequest?.creditRequestId, notifyError]);

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
        userAccount,
        newTrace
      );
      setTraces((prev) => [...prev, newTrace]);
      setNewMessage("");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      notifyError("Error al enviar el mensaje. Intente nuevamente.");
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

  return (
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
                />
                <Textfield
                  id="text"
                  placeholder="Ej.: Escribe tu mensaje"
                  fullwidth
                  value={newMessage}
                  onChange={handleInputChange}
                />
                <Icon
                  appearance="primary"
                  cursorHover
                  size="24px"
                  icon={<MdOutlineSend />}
                  onClick={handleFormSubmit}
                />
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
              handleClose={() => setShowAttachments(false)}
              optionButtons={optionButtons}
              buttonLabel="Guardar"
              id={creditRequest.creditRequestId}
              isViewing={false}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          )}
        </>
      )}
    </Fieldset>
  );
};
