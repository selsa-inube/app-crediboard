import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Stack, useFlag, useMediaQuery } from "@inubekit/inubekit";

import { OfferedGuaranteeModal } from "@components/modals/OfferedGuaranteeModal";
import { ErrorAlert } from "@components/ErrorAlert";
import { ContainerSections } from "@components/layout/ContainerSections";
import { StockTray } from "@components/layout/ContainerSections/StockTray";
import { ListModal } from "@components/modals/ListModal";
import { MobileMenu } from "@components/modals/MobileMenu";
import { TextAreaModal } from "@components/modals/TextAreaModal";
import {
  IErrorService,
  ICreditRequest,
  IDeleteCreditRequest,
  IPaymentChannel,
} from "@services/types";
import { getCreditRequestByCode } from "@services/credit-request/query/getCreditRequestByCode";
import { getUnreadErrorsById } from "@services/credit-request/command/unreadErrors";
import { getSearchAllDocumentsById } from "@services/credit-request/query/SearchAllDocuments";
import { generatePDF } from "@utils/pdf/generetePDF";
import { AppContext } from "@context/AppContext";
import { patchAssignAccountManager } from "@services/credit-request/command/patchAssignAccountManager";
import { lateRejectionOfACreditRequest } from "@services/credit-request/command/lateRejectionCreditRequest";
import {
  textFlagsCancel,
  textFlagsReject,
  textFlagsUsers,
} from "@config/pages/staffModal/addFlag";
import { getSearchProspectByCode } from "@services/prospects/ProspectByCode";
import { IProspect } from "@services/prospects/types";
import { IExtraordinaryInstallments } from "@services/prospect/types/extraordInaryInstallments";

import { infoIcon } from "./ToDo/config";
import { ToDo } from "./ToDo";
import { configHandleactions, optionButtons } from "./config";
import {
  StyledMarginPrint,
  StyledPageBreak,
  StyledScreenPrint,
  StyledToast,
} from "./styles";
import { Approvals } from "./Approvals";
import { Requirements } from "./Requirements";
import { Management } from "./management";
import { PromissoryNotes } from "./PromissoryNotes";
import { Postingvouchers } from "./Postingvouchers";
import { IErrorsUnread } from "./types";
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
  const { addFlag } = useFlag();

  const [showGuarantee, setShowGuarantee] = useState(false);

  const [document, setDocument] = useState<IListdataProps["data"]>([]);

  const [dataProspect, setDataProspect] = useState<IProspect>();

  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; name: string; file: File }[]
  >([]);

  const { id } = useParams();
  const { user } = useAuth0();

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

  useEffect(() => {
    getCreditRequestByCode(businessUnitPublicCode, id!, userAccount)
      .then((data) => {
        setData(data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, businessUnitPublicCode, userAccount]);

  const fetchAndShowDocuments = async () => {
    if (!data?.creditRequestId || !user?.email || !businessUnitPublicCode)
      return;

    try {
      const documents = await getSearchAllDocumentsById(
        data.creditRequestId,
        user.email,
        businessUnitPublicCode
      );

      const dataToMap = Array.isArray(documents) ? documents : documents.value;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const documentsUser = dataToMap.map((dataListDocument: any) => ({
        id: dataListDocument.documentId,
        name: dataListDocument.fileName,
      }));

      setDocument(documentsUser);
      setAttachDocuments(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchProspectByCode(
          businessUnitPublicCode,
          id!
        );
        setDataProspect(Array.isArray(result) ? result[0] : result);
      } catch (error) {
        console.error("Error al obtener los prospectos:", error);
      }
    };

    fetchData();
  }, [businessUnitPublicCode, id, sentData]);

  const handleGeneratePDF = () => {
    setTimeout(() => {
      generatePDF(
        dataCommercialManagementRef,
        "Gestión Comercial",
        "Gestión Comercial",
        { top: 10, bottom: 10, left: 10, right: 10 }
      );
    }, 1000);
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
        user?.email || "",
        businessUnitPublicCode,
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
      if (!data?.creditRequestId || !businessUnitPublicCode || !user?.email)
        return;
      try {
        await patchAssignAccountManager(
          data?.creditRequestId ?? "",
          businessUnitPublicCode,
          user?.email ?? ""
        );
      } catch (error) {
        addFlag({
          title: textFlagsUsers.titleError,
          description: textFlagsUsers.descriptionError,
          appearance: "danger",
          duration: 5000,
        });
      } finally {
        handleToggleModal();
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.creditRequestId, businessUnitPublicCode, user?.email]);

  const fetchErrors = async () => {
    if (!data?.creditRequestId || !businessUnitPublicCode) return;

    try {
      const unreadErrors = await getUnreadErrorsById(businessUnitPublicCode, {
        creditRequestId: data.creditRequestId,
      });

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
    await deleteCreditRequest(businessUnitPublicCode, creditRequests)
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

  return (
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
                  <ComercialManagement
                    print={handleGeneratePDF}
                    data={data}
                    collapse={collapse}
                    setCollapse={setCollapse}
                    id={id!}
                    hideContactIcons={true}
                    prospectData={dataProspect!}
                    hasPermitRejection={
                      eventData.user.staff.useCases.canSendDecision
                    }
                    sentData={null}
                    setSentData={setSentData}
                    setRequestValue={setRequestValue}
                    requestValue={requestValue}
                  />
                </Stack>
              </Stack>
              <StyledScreenPrint $isMobile={isMobile}>
                <Stack direction="column">
                  <ToDo
                    icon={infoIcon}
                    isMobile={isMobile}
                    id={id!}
                    user={user!.nickname!}
                  />
                </Stack>
                <Stack direction="column" height={isMobile ? "auto" : "277px"}>
                  <Approvals user={id!} isMobile={isMobile} id={id!} />
                </Stack>
                <Stack direction="column" height={isMobile ? "auto" : "340px"}>
                  <StyledPageBreak />
                  <Requirements
                    isMobile={isMobile}
                    id={data.creditRequestId!}
                    user={user!.email!}
                    businessUnitPublicCode={businessUnitPublicCode}
                    creditRequestCode={data.creditRequestCode!}
                    hasPermitRejection={
                      eventData.user.staff.useCases.canAddRequirements
                    }
                  />
                </Stack>
                <Stack direction="column">
                  <Management id={id!} isMobile={isMobile} />
                </Stack>
                <Stack direction="column" height={isMobile ? "auto" : "163px"}>
                  <StyledPageBreak />
                  <PromissoryNotes id={id!} isMobile={isMobile} />
                </Stack>
                <Stack direction="column" height={isMobile ? "auto" : "163px"}>
                  <Postingvouchers user={id!} id={id!} isMobile={isMobile} />
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
            inputPlaceholder="Describa el motivo del Rechazo."
            onCloseModal={() => setShowRejectModal(false)}
            handleNext={() => {
              handleSubmit();
              setShowRejectModal(false);
            }}
            onChange={(e) => setRemovalJustification(e.target.value)}
          />
        )}
        {showGuarantee && (
          <OfferedGuaranteeModal
            handleClose={() => setShowGuarantee(false)}
            isMobile={isMobile}
            prospectData={dataProspect!}
            businessUnitPublicCode={businessUnitPublicCode}
            requestId={data.creditRequestId!}
          />
        )}
        {showCancelModal && (
          <TextAreaModal
            title="Anular"
            buttonText="Confirmar"
            inputLabel="Motivo de la anulación."
            inputPlaceholder="Describa el motivo de la anulación."
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
  );
};
