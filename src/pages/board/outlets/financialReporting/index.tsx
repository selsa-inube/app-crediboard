import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  useFlag,
  useMediaQuery,
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
  textFlagsCancelEnum,
  textFlagsRejectEnum,
  textFlagsUsersEnum,
} from "@config/pages/staffModal/addFlag";
import { getSearchProspectByCode } from "@services/creditRequest/query/ProspectByCode";
import {
  IProspect,
  IExtraordinaryInstallmentsAddSeries,
} from "@services/prospect/types";
import { ErrorModal } from "@components/modals/ErrorModal";
import { ShareModal } from "@components/modals/ShareModal";
import { BaseModal } from "@components/modals/baseModal";
import { shareModalConfigEnum } from "@components/modals/ShareModal/config";
import { useEnum } from "@hooks/useEnum";

import { StyledPrint } from "./CommercialManagement/styles";
import { infoIcon } from "./ToDo/config";
import { ToDo } from "./ToDo";
import {
  configHandleactions,
  optionButtons,
  labelsAndValuesShareEnum,
  errorMessagesEnum,
  financialReportingLabelsEnum,
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
import { IEntries } from "@components/data/TableBoard/types";

interface IListdataProps {
  data: { id: string; name: string }[];
  icon?: React.ReactNode;
  onPreview: (id: string, name: string) => void;
}

const removeErrorByIdServices = (
  errorsList: IErrorService[],
  errorId: string,
) => {
  return errorsList.filter((error) => error.id !== errorId);
};

export const FinancialReporting = () => {
  const [data, setData] = useState({} as ICreditRequest);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachDocuments, setAttachDocuments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [sentData, setSentData] =
    useState<IExtraordinaryInstallmentsAddSeries | null>(null);
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showGuarantee, setShowGuarantee] = useState(false);
  const [document, setDocument] = useState<IListdataProps["data"]>([]);
  const [errorGetProspects, setErrorGetProspects] = useState(false);

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

  const [updateManagement, setUpdateManagement] = useState(0);
  const [approvalsEntries, setApprovalsEntries] = useState<IEntries[]>([]);
  const { creditRequestCode } = useParams();
  const { user } = useIAuth();

  const navigation = useNavigate();
  const { lang } = useEnum();

  const isMobile: boolean = useMediaQuery("(max-width: 880px)");

  const dataCommercialManagementRef = useRef<HTMLDivElement>(null);

  const [errorsService, setErrorsService] = useState<IErrorService[]>([]);
  const [removalJustification, setRemovalJustification] = useState("");
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const businessManagerCode = eventData.businessManager.publicCode;

  const { addFlag } = useFlag();

  useEffect(() => {
    getCreditRequestByCode(
      businessUnitPublicCode,
      businessManagerCode,
      creditRequestCode!,
      eventData.user.identificationDocumentNumber || "",
      eventData.token || "",
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
    eventData.token,
    eventData.user.identificationDocumentNumber,
  ]);

  const fetchAndShowDocuments = async () => {
    if (!data?.creditRequestId || !user?.id || !businessUnitPublicCode) return;

    try {
      const documents = await getSearchAllDocumentsById(
        data.creditRequestId,
        user.id,
        businessUnitPublicCode,
        businessManagerCode,
        eventData.token || "",
      );

      const dataToMap = Array.isArray(documents) ? documents : documents.value;
      const documentsUser = dataToMap.map(
        (dataListDocument: IDocumentData) => ({
          id: dataListDocument.documentId,
          name: dataListDocument.fileName,
        }),
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
          creditRequestCode,
          eventData.token || "",
        );
        setDataProspect(Array.isArray(result) ? result[0] : result);
      } catch (error) {
        setErrorMessage(
          errorMessagesEnum.searchProspect.description.i18n[lang],
        );
        setErrorModal(true);
        setErrorGetProspects(true);
        console.error("Error al obtener los prospectos:", error);
      }
    };

    idProspect && businessUnitPublicCode && fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        labelsAndValuesShareEnum.titleOnPdf.i18n[lang],
        setErrorModal,
        true,
      );

      if (pdfBlob) {
        setPdfState({
          isGenerating: false,
          blob: pdfBlob,
          showShareModal: true,
        });
      }
      setErrorModal(false);
    } catch (error) {
      setPdfState({ isGenerating: false, blob: null, showShareModal: false });
      setErrorMessage(errorMessagesEnum.share.description.i18n[lang]);
      setErrorModal(true);
    }
  };

  const handleSharePdf = async () => {
    if (!pdfState.blob) return;

    try {
      const pdfFile = new File(
        [pdfState.blob],
        labelsAndValuesShareEnum.fileName.i18n[lang],
        {
          type: "application/pdf",
        },
      );

      await navigator.share({
        files: [pdfFile],
        title: labelsAndValuesShareEnum.titleOnPdf.i18n[lang],
        text: labelsAndValuesShareEnum.text.i18n[lang],
      });

      setPdfState({ isGenerating: false, blob: null, showShareModal: false });
      setErrorModal(false);
    } catch (error) {
      setPdfState({ isGenerating: false, blob: null, showShareModal: false });
      setErrorMessage(errorMessagesEnum.share.description.i18n[lang]);
      setErrorModal(true);
    }
  };

  const handleAttachmentsClose = async (filesSaved: boolean = false) => {
    setShowAttachments(false);
    if (filesSaved) {
      setUpdateManagement((prev) => prev + 1);
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
        eventData.user.identificationDocumentNumber || "",
        businessUnitPublicCode,
        businessManagerCode,
        "RECHAZAR_SOLICITUD",
        removalJustification,
        eventData.token,
      );

      addFlag({
        title: textFlagsRejectEnum.titleSuccess.i18n[lang],
        description: textFlagsRejectEnum.descriptionSuccess.i18n[lang],
        appearance: "success",
        duration: 5000,
      });
    } catch (error) {
      setErrorMessage(errorMessagesEnum.lateRejection.description.i18n[lang]);
      setErrorModal(true);
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
          eventData.user.identificationDocumentNumber || "",
          eventData.token || "",
        );
      } finally {
        handleToggleModal();
      }
    };

    fetchData();
    //eslint-disable-next-line
  }, [data?.creditRequestId, businessUnitPublicCode, user?.id]);

  const fetchErrors = async () => {
    if (!data?.creditRequestId || !businessUnitPublicCode) return;

    try {
      const unreadErrors = await getUnreadErrorsById(
        businessUnitPublicCode,
        businessManagerCode,
        {
          creditRequestId: data.creditRequestId,
        },
        eventData.token || "",
      );

      if (Array.isArray(unreadErrors)) {
        const mappedErrors = unreadErrors.map((error: IErrorsUnread) => ({
          id: error.errorIssuedId,
          message: error.errorDescription,
        }));

        setErrorsService(mappedErrors);
      }
    } catch (error) {
      setErrorModal(true);
      setErrorMessage(errorMessagesEnum.unreadErrors.description.i18n[lang]);
    }
  };

  useEffect(() => {
    if (data?.creditRequestId) {
      fetchErrors();
    }
    //eslint-disable-next-line
  }, [data]);

  const handleDeleteCreditRequest = async () => {
    const creditRequests: IDeleteCreditRequest = {
      creditRequestId: data?.creditRequestId ?? "",
      removalJustification,
    };
    await deleteCreditRequest(
      businessUnitPublicCode,
      businessManagerCode,
      creditRequests,
      eventData.token,
    )
      .then(() => {
        addFlag({
          title: textFlagsUsersEnum.titleSuccess.i18n[lang],
          description: textFlagsUsersEnum.descriptionSuccess.i18n[lang],
          appearance: "success",
          duration: 5000,
        });
      })
      .catch(() => {
        addFlag({
          title: textFlagsCancelEnum.titleError.i18n[lang],
          description: textFlagsCancelEnum.descriptionError.i18n[lang],
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
                  lang={lang}
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
                lang={lang}
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
                        sentData={sentData}
                        setSentData={setSentData}
                        setRequestValue={setRequestValue}
                        requestValue={requestValue}
                        errorGetProspects={errorGetProspects}
                        setErrorModal={setErrorModal}
                        setErrorMessage={setErrorMessage}
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
                        approvalsEntries={approvalsEntries}
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
                        approvalsEntries={approvalsEntries}
                        setApprovalsEntries={setApprovalsEntries}
                      />
                    </BlockPdfSection>
                  </Stack>
                  <Stack
                    direction="column"
                    height={isMobile ? "auto" : "290px"}
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
                        eventData={eventData}
                      />
                    </BlockPdfSection>
                  </Stack>
                  <Stack direction="column">
                    <BlockPdfSection className="pdf-block">
                      <Management
                        id={creditRequestCode!}
                        isMobile={isMobile}
                        updateData={updateManagement}
                      />
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
                  title={
                    financialReportingLabelsEnum.attachments.titleList.i18n[
                      lang
                    ]
                  }
                  handleClose={(uploadedDocs) => {
                    const wasSaved = Boolean(
                      uploadedDocs && uploadedDocs.length > 0,
                    );
                    return handleAttachmentsClose(wasSaved);
                  }}
                  optionButtons={optionButtons}
                  buttonLabel={
                    financialReportingLabelsEnum.attachments.saveButton.i18n[
                      lang
                    ]
                  }
                  id={data.creditRequestId!}
                  isViewing={false}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
              )}
              {attachDocuments && (
                <ListModal
                  title={
                    financialReportingLabelsEnum.attachments.titleList.i18n[
                      lang
                    ]
                  }
                  handleClose={() => setAttachDocuments(false)}
                  buttonLabel={
                    financialReportingLabelsEnum.attachments.closeButton.i18n[
                      lang
                    ]
                  }
                  id={data.creditRequestId!}
                  isViewing={true}
                  dataDocument={document}
                />
              )}
            </>
          </ContainerSections>
          {showRejectModal && (
            <TextAreaModal
              title={financialReportingLabelsEnum.rejectModal.title.i18n[lang]}
              buttonText={
                financialReportingLabelsEnum.rejectModal.button.i18n[lang]
              }
              inputLabel={
                financialReportingLabelsEnum.rejectModal.label.i18n[lang]
              }
              inputPlaceholder={
                financialReportingLabelsEnum.rejectModal.placeholder.i18n[lang]
              }
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
              title={financialReportingLabelsEnum.cancelModal.title.i18n[lang]}
              buttonText={
                financialReportingLabelsEnum.cancelModal.button.i18n[lang]
              }
              inputLabel={
                financialReportingLabelsEnum.cancelModal.label.i18n[lang]
              }
              inputPlaceholder={
                financialReportingLabelsEnum.cancelModal.placeholder.i18n[lang]
              }
              onCloseModal={() => setShowCancelModal(false)}
              handleNext={() => {
                handleDeleteCreditRequest();
                setShowCancelModal(false);
              }}
              onChange={(e) => setRemovalJustification(e.target.value)}
            />
          )}
          {showMenu && isMobile && (
            <StyledPrint>
              <MobileMenu
                onClose={() => setShowMenu(false)}
                onReject={hanleOnReject}
                onCancel={handleOnCancel}
                onAttach={handleOnAttach}
                onViewAttachments={handleOnViewAttachments}
                onGuarantee={() => setShowGuarantee(true)}
              />
            </StyledPrint>
          )}
        </Stack>
      </StyledMarginPrint>
      {errorModal && (
        <ErrorModal
          message={errorMessage}
          handleClose={() => {
            setErrorModal(false);
          }}
        />
      )}
      {pdfState.isGenerating && (
        <BaseModal
          title={shareModalConfigEnum.title.i18n[lang]}
          nextButton={shareModalConfigEnum.buttonText.i18n[lang]}
          width={isMobile ? "300px" : "450px"}
        >
          <StyledContainerSpinner>
            <Spinner size="large" appearance="primary" />
            <Text size="large" weight="bold" appearance="dark">
              {errorMessagesEnum.share.spinner.i18n[lang]}
            </Text>
          </StyledContainerSpinner>
        </BaseModal>
      )}
      {pdfState.showShareModal && pdfState.blob && (
        <ShareModal
          isMobile={isMobile}
          handleClose={handleSharePdfModal}
          handleNext={handleSharePdf}
          lang={lang}
        />
      )}
    </div>
  );
};
