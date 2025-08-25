import { useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import {
  MdClear,
  MdDeleteOutline,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";
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
import { truncateTextToMaxLength } from "@utils/formatData/text";
import { StyledItem } from "@pages/board/outlets/financialReporting/styles";
import { optionFlags } from "@pages/board/outlets/financialReporting/config";

import { DocumentViewer } from "../DocumentViewer";
import {
  StyledAttachContainer,
  StyledContainerClose,
  StyledContainerContent,
  StyledFileBox,
  StyledModal,
} from "./styles";
import { listModalData } from "./config";
import { IDocumentUpload } from "./types";

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
  handleClose: () => void;
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
    id,
  } = props;

  const node = document.getElementById(portalId ?? "portal");
  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }
  const { addFlag } = useFlag();
  const MAX_FILE_SIZE = 2.5 * 1024 * 1024;
  const isMobile = useMediaQuery("(max-width: 700px)");
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { businessUnitSigla } = useContext(AppContext);

  const { user } = useAuth0();
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const [pendingFiles, setPendingFiles] = useState<
    { id: string; name: string; file: File }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  interface IListdataProps {
    data: { id: string; name: string }[] | null | undefined;
    onDelete?: (id: string) => void;
    icon?: React.ReactNode;
    onPreview?: (id: string, name: string) => void;
  }

  const Listdata = (props: IListdataProps) => {
    const { data, icon, onDelete, onPreview } = props;

    const maxLength = isMobile ? 20 : 40;

    return (
      <ul
        style={{
          paddingInlineStart: "2px",
          marginBlock: "8px",
        }}
      >
        {data?.map((element) => (
          <StyledItem key={element.id}>
            <Text>{truncateTextToMaxLength(element.name, maxLength)}</Text>
            <Icon
              icon={icon}
              appearance="dark"
              spacing="narrow"
              size="24px"
              cursorHover
              onClick={() => {
                if (onDelete) {
                  onDelete(element.id);
                } else if (onPreview) {
                  onPreview(element.id, element.name);
                }
              }}
            />
          </StyledItem>
        ))}
      </ul>
    );
  };

  const handleDeleteFile = (id: string) => {
    if (!setUploadedFiles) return;
    setUploadedFiles(
      (prev: { id: string; name: string; file: File }[] | null) =>
        (prev || []).filter((file) => file.id !== id)
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
    appearance: FlagAppearance
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
    if (!setUploadedFiles) return;

    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        file: file,
      }));
      setUploadedFiles((prev: IDocumentUpload[]) => [
        ...(prev || []),
        ...newFiles,
      ]);
    } else {
      setUploadedFiles([]);
    }
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
      "image/JPG",
    ];
    const validFiles = files.filter(
      (file) => validMimeTypes.includes(file.type) && file.size <= MAX_FILE_SIZE
    );
    if (validFiles.length !== files.length) {
      alert(listModalData.onlypdf);
    }

    const newFiles = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      file,
    }));
    setUploadedFiles((prev: IDocumentUpload[]) => [
      ...(prev || []),
      ...newFiles,
    ]);

    e.dataTransfer.clearData();
  };

  const handleUpload = async () => {
    if (uploadMode === "local") {
      console.log("Archivos guardados en estado:", uploadedFiles);
      handleClose();
      return;
    }

    try {
      if (uploadedFiles!.length) {
        for (const fileData of uploadedFiles!) {
          const abbreviatedName = fileData.name
            .split(".")
            .slice(0, -1)
            .join(".")
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 10);

          await saveDocument(
            businessUnitPublicCode,
            id,
            abbreviatedName,
            fileData.file,
            user?.email ?? ""
          );
        }

        if (setUploadedFiles) {
          setUploadedFiles([]);
        }

        handleClose();
        handleFlag(
          optionFlags.title,
          optionFlags.description,
          optionFlags.appearance as FlagAppearance
        );
      }
    } catch (error) {
      handleFlag(
        optionFlags.title,
        optionFlags.description,
        optionFlags.appearanceError as FlagAppearance
      );
    }
  };

  const handlePreview = async (id: string, name: string) => {
    try {
      const documentData = await getSearchDocumentById(
        id,
        user?.email ?? "",
        businessUnitPublicCode
      );
      const fileUrl = URL.createObjectURL(documentData);
      setSelectedFile(fileUrl);
      setFileName(name);
      setOpen(true);
    } catch (error) {
      console.error("Error obteniendo el documento:", error);
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
          <StyledContainerClose onClick={handleClose}>
            <Stack alignItems="center" gap="8px">
              <Text>Cerrar</Text>
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
                  <Listdata
                    data={isViewing ? (dataDocument ?? []) : uploadedFiles}
                    icon={
                      isViewing ? (
                        <MdOutlineRemoveRedEye />
                      ) : (
                        <MdDeleteOutline />
                      )
                    }
                    onDelete={!isViewing ? handleDeleteFile : undefined}
                    onPreview={isViewing ? handlePreview : undefined}
                  />
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
                <Text>{listModalData.drag}</Text>
                <Text>{listModalData.or}</Text>
              </Stack>
              <Button spacing="compact" onClick={handleBrowseClick}>
                {listModalData.search}
              </Button>
              <input
                type="file"
                accept=".pdf,image/jpeg,image/jpg,image/png/JPG"
                style={{ display: "none" }}
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
              />
            </StyledAttachContainer>
            <Text size="medium" appearance="gray">
              {listModalData.maximum}
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
                    {listModalData.attachments}
                  </Text>
                  <StyledFileBox>
                    {pendingFiles.map((file) => (
                      <File
                        key={file.id}
                        name={file.name}
                        size={formatFileSize(file.file.size)}
                        onDelete={() => {
                          setPendingFiles((prevFiles) =>
                            prevFiles.filter((f) => f.id !== file.id)
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
                    {listModalData.attachments}
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
                            prev.filter((f) => f.id !== file.id)
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
            <Button onClick={handleClose}>{buttonLabel}</Button>
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
            <Button onClick={onSubmit ?? handleClose}>{buttonLabel}</Button>
          </Stack>
        )}
        {selectedFile && open && (
          <DocumentViewer
            selectedFile={selectedFile}
            handleClose={() => setOpen(false)}
            title={fileName || ""}
          />
        )}
      </StyledModal>
    </Blanket>,
    node
  );
};
