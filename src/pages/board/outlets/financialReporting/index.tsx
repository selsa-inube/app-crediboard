import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  useFlag,
  useMediaQuery,
  Blanket,
  Text,
  Spinner,
} from "@inubekit/inubekit";
import { useIAuth } from "@inube/iauth-react";

import { OfferedGuaranteeModal } from "@components/modals/OfferedGuaranteeModal";
import { ErrorAlert } from "@components/ErrorAlert";
import { ContainerSections } from "@components/layout/ContainerSections";
import { StockTray } from "@components/layout/ContainerSections/StockTray";
import { ListModal } from "@components/modals/ListModal";
import { MobileMenu } from "@components/modals/MobileMenu";
import { TextAreaModal } from "@components/modals/TextAreaModal";
import {
  IDeleteCreditRequest,
  IPaymentChannel,
} from "@services/creditRequest/command/types";
import { ICreditRequest } from "@services/creditRequest/query/types";
import { getCreditRequestByCode } from "@services/creditRequest/query/getCreditRequestByCode";
import { getUnreadErrorsById } from "@services/creditRequest/command/unreadErrors";
import { getSearchAllDocumentsById } from "@services/creditRequest/query/SearchAllDocuments";
import { generatePDF } from "@utils/pdf/generetePDF";
import { AppContext } from "@context/AppContext";
import { patchAssignAccountManager } from "@services/creditRequest/command/patchAssignAccountManager";
import { lateRejectionOfACreditRequest } from "@services/creditRequest/command/lateRejectionCreditRequest";
import {
  textFlagsCancel,
  textFlagsReject,
  textFlagsUsers,
} from "@config/pages/staffModal/addFlag";
import { getSearchProspectByCode } from "@services/creditRequest/query/ProspectByCode";
import {
  IProspect,
  IExtraordinaryInstallments,
} from "@services/prospect/types";
import { ErrorModal } from "@components/modals/ErrorModal";
import { ShareModal } from "@components/modals/ShareModal";

import { infoIcon } from "./ToDo/config";
import { ToDo } from "./ToDo";
import {
  configHandleactions,
  optionButtons,
  labelsAndValuesShare,
  errorMessages,
} from "./config";
import {
  StyledMarginPrint,
  StyledPageBreak,
  StyledScreenPrint,
  StyledToast,
  StyledContainerSpinner,
  BlockPdfSection,
  GlobalPdfStyles,
} from "./styles";
import { Approvals } from "./Approvals";
import { Requirements } from "./Requirements";
import { Management } from "./management";
import { PromissoryNotes } from "./PromissoryNotes";
import { Postingvouchers } from "./Postingvouchers";
import { IDocumentData, IErrorService, IErrorsUnread } from "./types";
import { deleteCreditRequest } from "./utils";
import { ComercialManagement } from "./CommercialManagement";

interface IListdataProps {
  data: { id: string; name: string }[];
  icon?: React.ReactNode;
  onPreview: (id: string, name: string) => void;
}

const removeErrorByIdServices = (
  errorsList: IErrorService[],
  errorId: string
) => {
  return errorsList.filter((error) => error.id !== errorId);
};

export const FinancialReporting = () => {
  const [data, setData] = useState({} as ICreditRequest);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachDocuments, setAttachDocuments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [sentData, setSentData] = useState<IExtraordinaryInstallments | null>(
    null
  );
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");

  const [showGuarantee, setShowGuarantee] = useState(false);

  const [document, setDocument] = useState<IListdataProps["data"]>([]);

  const [dataProspect, setDataProspect] = useState<IProspect>();
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; name: string; file: File }[]
  >([]);
  const [idProspect, setIdProspect] = useState("");
  const [pdfState, setPdfState] = useState({
    isGenerating: false,
    blob: null as Blob | null,
    showShareModal: false,
  });

  const { creditRequestCode } = useParams();
  const { user } = useIAuth();

  const navigation = useNavigate();

  const isMobile: boolean = useMediaQuery("(max-width: 880px)");

  const dataCommercialManagementRef = useRef<HTMLDivElement>(null);

  const [errorsService, setErrorsService] = useState<IErrorService[]>([]);
  const [removalJustification, setRemovalJustification] = useState("");
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const { addFlag } = useFlag();

  useEffect(() => {
    getCreditRequestByCode(
      businessUnitPublicCode,
      businessManagerCode,
      creditRequestCode!,
      userAccount
    )
      .then((data) => {
        setData(data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [
    creditRequestCode,
    businessUnitPublicCode,
    userAccount,
    businessManagerCode,
  ]);

  const fetchAndShowDocuments = async () => {
    if (!data?.creditRequestId || !user?.id || !businessUnitPublicCode) return;

    try {
      const documents = await getSearchAllDocumentsById(
        data.creditRequestId,
        user.id,
        businessUnitPublicCode,
        businessManagerCode
      );

      const dataToMap = Array.isArray(documents) ? documents : documents.value;
      const documentsUser = dataToMap.map(
        (dataListDocument: IDocumentData) => ({
          id: dataListDocument.documentId,
          name: dataListDocument.fileName,
        })
      );
      setDocument(documentsUser);
      setAttachDocuments(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!creditRequestCode) return;

      try {
        const result = await getSearchProspectByCode(
          businessUnitPublicCode,
          businessManagerCode,
          creditRequestCode
        );

        setDataProspect(Array.isArray(result) ? result[0] : result);
      } catch (error) {
        console.error("Error al obtener los prospectos:", error);
      }
    };

    idProspect && businessUnitPublicCode && fetchData();
  }, [
    businessUnitPublicCode,
    idProspect,
    sentData,
    creditRequestCode,
    businessManagerCode,
  ]);
  const generateAndSharePdf = async () => {
    setPdfState({ isGenerating: true, blob: null, showShareModal: false });

    try {
      const pdfBlob = await generatePDF(
        dataCommercialManagementRef,
        labelsAndValuesShare.titleOnPdf,
        setShowErrorModal,
        true
      );

      if (pdfBlob) {
        setPdfState({
          isGenerating: false,
          blob: pdfBlob,
          showShareModal: true,
        });
      }
    } catch (error) {
      setPdfState({ isGenerating: false, blob: null, showShareModal: false });
      setMessageError(errorMessages.share.description);
      setShowErrorModal(true);
    }
  };

  const handleSharePdf = async () => {
    if (!pdfState.blob) return;

    try {
      const pdfFile = new File([pdfState.blob], labelsAndValuesShare.fileName, {
        type: "application/pdf",
      });

      await navigator.share({
        files: [pdfFile],
        title: labelsAndValuesShare.titleOnPdf,
        text: labelsAndValuesShare.text,
      });

      setPdfState({ isGenerating: false, blob: null, showShareModal: false });
    } catch (error) {
      setPdfState({ isGenerating: false, blob: null, showShareModal: false });
      setMessageError(errorMessages.share.description);
      setShowErrorModal(true);
    }
  };

  const handleActions = configHandleactions({
    buttonReject: () => setShowRejectModal(true),
    buttonCancel: () => setShowCancelModal(true),
    buttonPrint: () => {
      if (collapse === true) {
        setCollapse(false);
        setTimeout(() => {
          print();
        }, 1);
        setTimeout(() => {
          setCollapse(true);
        }, 1);
      } else {
        print();
      }
    },
    buttonAttach: () => setShowAttachments(true),
    buttonViewAttachments: () => fetchAndShowDocuments(),
    buttonWarranty: () => setShowGuarantee(true),
    menuIcon: () => setShowMenu(true),
  });

  const handleCloseErrorService = (errorId: string) => {
    setErrorsService(removeErrorByIdServices(errorsService, errorId));
  };

  const handleOnCancel = () => {
    setShowCancelModal(true);
    setShowMenu(false);
  };

  const hanleOnReject = () => {
    setShowRejectModal(true);
    setShowMenu(false);
  };

  const handleOnAttach = () => {
    setShowAttachments(true);
    setShowMenu(false);
  };

  const handleSubmit = async () => {
    try {
      await lateRejectionOfACreditRequest(
        data?.creditRequestId || "",
        user?.id || "",
        businessUnitPublicCode,
        businessManagerCode,
        "RECHAZAR_SOLICITUD", // o "RECHAZO_HUMANO"
        removalJustification
      );

      addFlag({
        title: textFlagsReject.titleSuccess,
        description: textFlagsReject.descriptionSuccess,
        appearance: "success",
        duration: 5000,
      });
    } catch (error) {
      console.error(error);
      addFlag({
        title: textFlagsReject.titleError,
        description: textFlagsReject.descriptionError,
        appearance: "danger",
        duration: 5000,
      });
    }
  };

  const handleOnViewAttachments = () => {
    setAttachDocuments(true);
    setShowMenu(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!data?.creditRequestId || !businessUnitPublicCode || !user?.id)
        return;
      try {
        await patchAssignAccountManager(
          data?.creditRequestId ?? "",
          businessUnitPublicCode,
          businessManagerCode,
          user?.id ?? ""
        );
      } catch (error) {
        setMessageError(errorMessages.getData.description);
      } finally {
        handleToggleModal();
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.creditRequestId, businessUnitPublicCode, user?.id]);

  const fetchErrors = async () => {
    if (!data?.creditRequestId || !businessUnitPublicCode) return;

    try {
      const unreadErrors = await getUnreadErrorsById(
        businessUnitPublicCode,
        businessManagerCode,
        {
          creditRequestId: data.creditRequestId,
        }
      );

      if (Array.isArray(unreadErrors)) {
        const mappedErrors = unreadErrors.map((error: IErrorsUnread) => ({
          id: error.errorIssuedId,
          message: error.errorDescription,
        }));

        setErrorsService(mappedErrors);
      }
    } catch (error) {
      console.error("Error fetching unread errors", error);
    }
  };

  useEffect(() => {
    if (data?.creditRequestId) {
      fetchErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleDeleteCreditRequest = async () => {
    const creditRequests: IDeleteCreditRequest = {
      creditRequestId: data?.creditRequestId ?? "",
      removalJustification,
    };
    await deleteCreditRequest(
      businessUnitPublicCode,
      businessManagerCode,
      creditRequests
    )
      .then(() => {
        addFlag({
          title: textFlagsUsers.titleSuccess,
          description: textFlagsUsers.descriptionSuccess,
          appearance: "success",
          duration: 5000,
        });
      })
      .catch(() => {
        addFlag({
          title: textFlagsCancel.titleError,
          description: textFlagsCancel.descriptionError,
          appearance: "danger",
          duration: 5000,
        });
      })
      .finally(() => {
        handleToggleModal();
        setTimeout(() => {
          navigation("/");
        }, 1000);
      });
  };
  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleSharePdfModal = () => {
    setPdfState({ isGenerating: false, blob: null, showShareModal: false });
  };

  return (
    <div ref={dataCommercialManagementRef}>
      <GlobalPdfStyles $isGeneratingPdf={pdfState.isGenerating} />
      <StyledMarginPrint $isMobile={isMobile}>
        <Stack direction="column">
          <Stack justifyContent="center" alignContent="center">
            <StyledToast $isMobile={isMobile}>
              {errorsService.map((error) => (
                <ErrorAlert
                  key={error.id}
                  message={error.message.toString()}
                  onClose={() => handleCloseErrorService(error.id)}
                  isMobile={isMobile}
                />
              ))}
            </StyledToast>
          </Stack>
          <ContainerSections
            isMobile={isMobile}
            stockTray={
              <StockTray
                isMobile={isMobile}
                actionButtons={handleActions}
                navigation={() => navigation("/")}
                eventData={eventData}
              />
            }
          >
            <>
              <Stack direction="column" gap="20px">
                <Stack direction="column">
                  <Stack direction="column">
                    <BlockPdfSection className="pdf-block">
                      <ComercialManagement
                        generateAndSharePdf={generateAndSharePdf}
                        data={data}
                        collapse={collapse}
                        setCollapse={setCollapse}
                        creditRequestCode={creditRequestCode!}
                        hideContactIcons={true}
                        prospectData={dataProspect!}
                        sentData={null}
                        setSentData={setSentData}
                        setRequestValue={setRequestValue}
                        requestValue={requestValue}
                      />
                    </BlockPdfSection>
                  </Stack>
                </Stack>
                <StyledScreenPrint $isMobile={isMobile}>
                  <BlockPdfSection className="pdf-block">
                    <Stack direction="column">
                      <ToDo
                        icon={infoIcon}
                        isMobile={isMobile}
                        id={creditRequestCode!}
                        user={user!.nickname!}
                        setIdProspect={setIdProspect}
                      />
                    </Stack>
                  </BlockPdfSection>
                  <Stack
                    direction="column"
                    height={isMobile ? "auto" : "277px"}
                  >
                    <BlockPdfSection className="pdf-block">
                      <Approvals
                        user={creditRequestCode!}
                        isMobile={isMobile}
                        id={creditRequestCode!}
                      />
                    </BlockPdfSection>
                  </Stack>
                  <Stack
                    direction="column"
                    height={isMobile ? "auto" : "340px"}
                  >
                    <StyledPageBreak />
                    <BlockPdfSection className="pdf-block">
                      <Requirements
                        isMobile={isMobile}
                        id={data.creditRequestId!}
                        user={user!.id!}
                        businessUnitPublicCode={businessUnitPublicCode}
                        creditRequestCode={data.creditRequestCode!}
                        businessManagerCode={businessManagerCode}
                      />
                    </BlockPdfSection>
                  </Stack>
                  <Stack direction="column">
                    <BlockPdfSection className="pdf-block">
                      <Management id={creditRequestCode!} isMobile={isMobile} />
                    </BlockPdfSection>
                  </Stack>
                  <Stack
                    direction="column"
                    height={isMobile ? "auto" : "163px"}
                  >
                    <StyledPageBreak />
                    <BlockPdfSection className="pdf-block">
                      <PromissoryNotes
                        id={creditRequestCode!}
                        isMobile={isMobile}
                      />
                    </BlockPdfSection>
                  </Stack>
                  <Stack
                    direction="column"
                    height={isMobile ? "auto" : "163px"}
                  >
                    <BlockPdfSection className="pdf-block">
                      <Postingvouchers
                        user={creditRequestCode!}
                        id={creditRequestCode!}
                        isMobile={isMobile}
                      />
                    </BlockPdfSection>
                  </Stack>
                  <StyledPageBreak />
                  <StyledPageBreak />
                </StyledScreenPrint>
              </Stack>
              {showAttachments && (
                <ListModal
                  title="Adjuntar"
                  handleClose={() => setShowAttachments(false)}
                  optionButtons={optionButtons}
                  buttonLabel="Guardar"
                  id={data.creditRequestId!}
                  isViewing={false}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
              )}
              {attachDocuments && (
                <ListModal
                  title="Ver Adjuntos"
                  handleClose={() => setAttachDocuments(false)}
                  buttonLabel="Cerrar"
                  id={data.creditRequestId!}
                  isViewing={true}
                  dataDocument={document}
                />
              )}
            </>
          </ContainerSections>
          {showRejectModal && (
            <TextAreaModal
              title="Rechazar"
              buttonText="Confirmar"
              inputLabel="Motivo del Rechazo."
              inputPlaceholder="Describe el motivo del Rechazo."
              onCloseModal={() => setShowRejectModal(false)}
              handleNext={() => {
                handleSubmit();
                setShowRejectModal(false);
                navigation("/");
              }}
              onChange={(event) => setRemovalJustification(event.target.value)}
            />
          )}
          {showGuarantee && (
            <OfferedGuaranteeModal
              handleClose={() => setShowGuarantee(false)}
              isMobile={isMobile}
              prospectData={dataProspect!}
              businessUnitPublicCode={businessUnitPublicCode}
              requestId={data.creditRequestId!}
              businessManagerCode={businessManagerCode}
            />
          )}
          {showCancelModal && (
            <TextAreaModal
              title="Anular"
              buttonText="Confirmar"
              inputLabel="Motivo de la anulación."
              inputPlaceholder="Describe el motivo de la anulación."
              onCloseModal={() => setShowCancelModal(false)}
              handleNext={() => {
                handleDeleteCreditRequest();
                setShowCancelModal(false);
              }}
              onChange={(e) => setRemovalJustification(e.target.value)}
            />
          )}
          {showMenu && isMobile && (
            <MobileMenu
              onClose={() => setShowMenu(false)}
              onReject={hanleOnReject}
              onCancel={handleOnCancel}
              onAttach={handleOnAttach}
              onViewAttachments={handleOnViewAttachments}
              onGuarantee={() => setShowGuarantee(true)}
            />
          )}
        </Stack>
      </StyledMarginPrint>
      {showErrorModal && (
        <ErrorModal message={messageError} handleClose={handleErrorModal} />
      )}
      {pdfState.isGenerating && (
        <Blanket>
          <StyledContainerSpinner>
            <Spinner size="large" />
            <Text size="large" weight="bold">
              {errorMessages.share.spinner}
            </Text>
          </StyledContainerSpinner>
        </Blanket>
      )}
      {pdfState.showShareModal && pdfState.blob && (
        <ShareModal
          isMobile={isMobile}
          handleClose={handleSharePdfModal}
          handleNext={handleSharePdf}
        />
      )}
    </div>
  );
};
