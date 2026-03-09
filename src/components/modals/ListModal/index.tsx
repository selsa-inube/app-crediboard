import { useRef, useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MdClear,
  MdDeleteOutline,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  useFlag,
  useMediaQuery,
  Divider,
  Button,
  Blanket,
} from "@inubekit/inubekit";

import { File } from "@components/inputs/File";
import { saveDocument } from "@services/creditRequest/command/saveDocument";
import { validationMessages } from "@validations/validationMessages";
import { AppContext } from "@context/AppContext";
import { getSearchDocumentById } from "@services/creditRequest/query/SearchDocumentById";
import { formatFileSize } from "@utils/size";
import { StyledItem } from "@pages/board/outlets/financialReporting/styles";
import { optionFlagsEnum } from "@pages/board/outlets/financialReporting/config";
import { useEnum } from "@hooks/useEnum";
import { getMaximumNotificationDocumentSize } from "@services/lineOfCredit/getMaximumNotificationDocumentSize";

import { IUploadedFileReturn } from "../RequirementsModals/DocumentValidationApprovalModal/config";
import { ErrorModal } from "../ErrorModal";
import { DocumentViewer } from "../DocumentViewer";
import {
  StyledAttachContainer,
  StyledContainerClose,
  StyledContainerContent,
  StyledFileBox,
  StyledModal,
} from "./styles";
import { listModalDataEnum } from "./config";
import { IDocumentUpload } from "./types";
import { TruncatedText } from "../TruncatedTextModal";

export interface IOptionButtons {
  label: string;
  variant: "filled" | "outlined" | "none";
  icon?: React.JSX.Element;
  fullwidth?: boolean;
  onClick?: () => void;
}

export interface IListModalProps {
  title: string;
  buttonLabel: string;
  isLoading?: boolean;
  showNoDocumentsModal?: boolean;
  cancelButton?: string;
  appearanceCancel?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "help"
    | "dark"
    | "gray"
    | "light";
  portalId?: string;
  content?: JSX.Element | JSX.Element[] | string;
  optionButtons?: IOptionButtons;
  uploadMode?: string;
  id?: string;
  dataDocument?: { id: string; name: string }[];
  isViewing?: boolean;
  uploadedFiles?: IDocumentUpload[];
  onlyDocumentReceived?: boolean;
  onDeleteDocument?: (id: string, name: string) => Promise<void>;
  handleClose: (
    uploadedDocs?: IUploadedFileReturn[] | undefined,
  ) => void | Promise<void>;
  handleSubmit?: () => void;
  onSubmit?: () => void;
  setUploadedFiles?: React.Dispatch<React.SetStateAction<IDocumentUpload[]>>;
}

export const ListModal = (props: IListModalProps) => {
  const {
    title,
    portalId,
    content,
    optionButtons,
    cancelButton,
    appearanceCancel = "primary",
    buttonLabel,
    uploadMode,
    dataDocument,
    isViewing,
    uploadedFiles,
    handleClose,
    handleSubmit,
    onSubmit,
    setUploadedFiles,
    onDeleteDocument,
    id,
  } = props;

  const node = document.getElementById(portalId ?? "portal");
  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }
  if (node) {
    node.style.position = "relative";
    node.style.zIndex = "3";
  }
  const { addFlag } = useFlag();
  const { lang } = useEnum();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessManagerCode = eventData.businessManager.publicCode;
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [isLoading, setIsLoading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<
    { id: string; name: string; file: File }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [maxFileSize, setMaxFileSize] = useState<number>(2.5 * 1024 * 1024);

  useEffect(() => {
    const fetchMaxFileSize = async () => {
      try {
        const response = await getMaximumNotificationDocumentSize(
          businessUnitPublicCode,
          eventData.token,
        );

        if (response && response.maximumNotificationDocumentSize) {
          setMaxFileSize(
            response.maximumNotificationDocumentSize * 1024 * 1024,
          );
        }
      } catch (error) {
        const err = error as {
          message?: string;
          status: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + err?.message + (err?.data?.description || "");

        setShowErrorModal(true);
        setMessageError(description);
      }
    };

    fetchMaxFileSize();
  }, [businessUnitPublicCode, eventData.token]);

  interface IListdataProps {
    data: { id: string; name: string }[] | null | undefined;
    onDelete?: (id: string, name: string) => void;
    icon?: React.ReactNode;
    onPreview?: (id: string, name: string) => void;
  }

  const Listdata = (props: IListdataProps) => {
    const { data, onDelete, onPreview } = props;
    const maxLength = isMobile ? 20 : 40;
    return (
      <ul style={{ paddingInlineStart: "2px", marginBlock: "8px" }}>
        {data?.map((element) => (
          <StyledItem key={element.id}>
            <TruncatedText text={element.name} maxLength={maxLength} />
            <Stack gap="8px">
              <Icon
                icon={<MdOutlineRemoveRedEye />}
                appearance="dark"
                spacing="narrow"
                size="24px"
                cursorHover
                onClick={() => onPreview?.(element.id, element.name)}
              />
              <Icon
                icon={<MdDeleteOutline />}
                appearance="dark"
                spacing="narrow"
                size="24px"
                cursorHover
                onClick={() => onDelete?.(element.id, element.name)}
              />
            </Stack>
          </StyledItem>
        ))}
      </ul>
    );
  };
  const handleDeleteFile = (id: string) => {
    if (!setUploadedFiles) return;
    setUploadedFiles(
      (prev: { id: string; name: string; file: File }[] | null) =>
        (prev || []).filter((file) => file.id !== id),
    );
  };

  type FlagAppearance =
    | "primary"
    | "danger"
    | "warning"
    | "success"
    | "help"
    | "gray"
    | "dark";

  const handleFlag = (
    title: string,
    description: string,
    appearance: FlagAppearance,
  ) => {
    addFlag({
      title: title,
      description: description,
      appearance: appearance,
      duration: 5000,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!setUploadedFiles || !files) return;

    const validFiles: IDocumentUpload[] = [];
    let hasError = false;

    Array.from(files).forEach((file) => {
      if (file.size <= maxFileSize) {
        validFiles.push({
          id: crypto.randomUUID(),
          name: file.name,
          file: file,
        });
      } else {
        hasError = true;
      }
    });

    if (hasError) {
      setMessageError(
        `${listModalDataEnum.exceedSize.i18n[lang]} ${maxFileSize / 1024 / 1024}MB`,
      );
      setShowErrorModal(true);
    }

    setUploadedFiles((prev: IDocumentUpload[]) => [
      ...(prev || []),
      ...validFiles,
    ]);

    event.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);

    if (!setUploadedFiles) return;

    const files = Array.from(e.dataTransfer.files);
    const validMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    const validFiles: IDocumentUpload[] = [];
    let hasSizeError = false;

    files.forEach((file) => {
      if (validMimeTypes.includes(file.type)) {
        if (file.size <= maxFileSize) {
          validFiles.push({
            id: crypto.randomUUID(),
            name: file.name,
            file,
          });
        } else {
          hasSizeError = true;
        }
      }
    });

    if (hasSizeError) {
      setMessageError(
        `${listModalDataEnum.exceedSize.i18n[lang]} ${maxFileSize / 1024 / 1024}MB`,
      );
      setShowErrorModal(true);
    }

    setUploadedFiles((prev: IDocumentUpload[]) => [
      ...(prev || []),
      ...validFiles,
    ]);
    e.dataTransfer.clearData();
  };

  const handleUpload = async () => {
    if (uploadMode === "local") {
      handleClose();
      return;
    }

    const savedDocs: IUploadedFileReturn[] = [];
    let filesSaved = false;

    try {
      setIsLoading(true);
      if (uploadedFiles!.length) {
        for (const fileData of uploadedFiles!) {
          const abbreviatedName = fileData.name
            .split(".")
            .slice(0, -1)
            .join(".")
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 10);

          const response = await saveDocument(
            businessUnitPublicCode,
            businessManagerCode,
            id,
            abbreviatedName,
            fileData.file,
            eventData.user.identificationDocumentNumber || "",
            eventData.token || "",
          );

          const docData = response && response[0] ? response[0] : response;

          if (docData && (docData.documentId || docData.documentCode)) {
            savedDocs.push({
              documentId: docData.documentId,
              documentCode: docData.documentCode,
              abbreviatedName: abbreviatedName,
            });
          }
        }

        if (setUploadedFiles) {
          setUploadedFiles([]);
        }

        filesSaved = true;

        handleFlag(
          optionFlagsEnum.title.i18n[lang],
          optionFlagsEnum.descriptionSuccess.i18n[lang],
          optionFlagsEnum.appearance.i18n[lang] as FlagAppearance,
        );
      }
    } catch (error) {
      handleFlag(
        optionFlagsEnum.title.i18n[lang],
        optionFlagsEnum.description.i18n[lang],
        optionFlagsEnum.appearanceError.i18n[lang] as FlagAppearance,
      );
    } finally {
      if (filesSaved) {
        handleClose(savedDocs);
      } else {
        handleClose();
      }
      setIsLoading(false);
    }
  };

  const handlePreview = async (id: string, name: string) => {
    try {
      const documentData = await getSearchDocumentById(
        id,
        eventData.user.identificationDocumentNumber || "",
        businessUnitPublicCode,
        businessManagerCode,
        eventData.token || "",
      );
      const fileUrl = documentData.urlDocument;
      setSelectedFile(fileUrl);
      setFileName(name);
      setOpen(true);
    } catch (error) {
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      setShowErrorModal(true);
      setMessageError(description);
    }
  };

  const isDisabled = () => {
    return !uploadedFiles?.length;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile}>
        <Stack alignItems="center" justifyContent="space-between">
          <Text type="headline" size="small">
            {title}
          </Text>
          <StyledContainerClose onClick={() => handleClose()}>
            <Stack alignItems="center" gap="8px">
              <Text>{listModalDataEnum.close.i18n[lang]}</Text>
              <Icon
                icon={<MdClear />}
                size="24px"
                cursorHover
                appearance="dark"
              />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Divider />
        <StyledContainerContent $smallScreen={isMobile}>
          {typeof content === "string" ? (
            <Stack>
              <Text>{content}</Text>
            </Stack>
          ) : (
            <>
              {isViewing && (
                <StyledContainerContent $smallScreen={isMobile}>
                  {isViewing ? (
                    <Listdata
                      data={dataDocument ?? []}
                      icon={<MdOutlineRemoveRedEye />}
                      onPreview={handlePreview}
                      onDelete={(id, name) => onDeleteDocument?.(id, name)}
                    />
                  ) : (
                    uploadedFiles &&
                    uploadedFiles.length > 0 && (
                      <Listdata
                        data={uploadedFiles}
                        icon={<MdDeleteOutline />}
                        onDelete={handleDeleteFile}
                        onPreview={(id, name) => {
                          const file = uploadedFiles.find((f) => f.id === id);
                          if (file) {
                            const url = URL.createObjectURL(file.file);
                            setSelectedFile(url);
                            setFileName(name);
                            setOpen(true);
                          }
                        }}
                      />
                    )
                  )}
                </StyledContainerContent>
              )}
            </>
          )}
        </StyledContainerContent>
        {optionButtons ? (
          <>
            <StyledAttachContainer
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              $isDragging={isDragging}
            >
              <Stack direction="column" alignItems="center">
                <Text>{listModalDataEnum.drag.i18n[lang]}</Text>
                <Text>{listModalDataEnum.or.i18n[lang]}</Text>
              </Stack>
              <Button spacing="compact" onClick={handleBrowseClick}>
                {listModalDataEnum.search.i18n[lang]}
              </Button>
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/jpg,image/png"
                style={{ display: "none" }}
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
              />
            </StyledAttachContainer>
            <Text size="medium" appearance="gray">
              {listModalDataEnum.maximum.i18n[lang]}
              {maxFileSize / 1024 / 1024}MB
            </Text>
            {Array.isArray(pendingFiles) && pendingFiles.length > 0 ? (
              <>
                <Divider dashed />
                <Stack direction="column" gap="24px">
                  <Text
                    type="title"
                    size="medium"
                    weight="bold"
                    appearance="gray"
                  >
                    {listModalDataEnum.attachments.i18n[lang]}
                  </Text>
                  <StyledFileBox>
                    {pendingFiles.map((file) => (
                      <File
                        key={file.id}
                        name={file.name}
                        size={formatFileSize(file.file.size)}
                        onDelete={() => {
                          setPendingFiles((prevFiles) =>
                            prevFiles.filter((f) => f.id !== file.id),
                          );
                          if (
                            fileInputRef.current &&
                            pendingFiles.length === 1
                          ) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      />
                    ))}
                  </StyledFileBox>
                </Stack>
              </>
            ) : (
              Array.isArray(uploadedFiles) &&
              uploadedFiles.length > 0 && (
                <>
                  <Divider dashed />
                  <Text
                    type="title"
                    size="medium"
                    weight="bold"
                    appearance="gray"
                  >
                    {listModalDataEnum.attachments.i18n[lang]}
                  </Text>
                  <StyledFileBox>
                    {uploadedFiles.map((file: IDocumentUpload) => (
                      <File
                        key={file.id}
                        name={file.name}
                        size={
                          file.file?.size ? formatFileSize(file.file.size) : "-"
                        }
                        onDelete={() => {
                          setUploadedFiles?.((prev: IDocumentUpload[] = []) =>
                            prev.filter((f) => f.id !== file.id),
                          );
                        }}
                      />
                    ))}
                  </StyledFileBox>
                </>
              )
            )}
            <Stack justifyContent="flex-end" margin="16px 0 0 0" gap="16px">
              <Button onClick={handleUpload} disabled={isDisabled()}>
                {buttonLabel}
              </Button>
            </Stack>
          </>
        ) : (
          <Stack justifyContent="flex-end" margin="16px 0 0 0" gap="16px">
            <Button onClick={() => handleClose()}>{buttonLabel}</Button>
          </Stack>
        )}
        {cancelButton && optionButtons && (
          <Stack justifyContent="flex-end" margin="16px 0 0 0" gap="16px">
            <Button
              variant="outlined"
              onClick={handleSubmit}
              spacing="wide"
              appearance={appearanceCancel}
            >
              {cancelButton}
            </Button>
            <Button
              onClick={onSubmit ?? (() => handleClose())}
              loading={isLoading}
            >
              {buttonLabel}
            </Button>
          </Stack>
        )}
        {selectedFile && open && (
          <DocumentViewer
            selectedFile={selectedFile}
            handleClose={() => setOpen(false)}
            title={fileName || ""}
          />
        )}
        {showErrorModal && (
          <ErrorModal
            handleClose={() => {
              setShowErrorModal(false);
            }}
            isMobile={isMobile}
            message={messageError}
          />
        )}
      </StyledModal>
    </Blanket>,
    node,
  );
};
