import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { MdOutlineFileUpload } from "react-icons/md";
import * as Yup from "yup";
import {
  Button,
  Checkbox,
  Divider,
  Select,
  Stack,
  Text,
  Textarea,
} from "@inubekit/inubekit";
import { useAuth0 } from "@auth0/auth0-react";

import { validationMessages } from "@validations/validationMessages";
import { Fieldset } from "@components/data/Fieldset";
import { BaseModal } from "@components/modals/baseModal";
import { ListModal } from "@components/modals/ListModal";
import { DocumentViewer } from "@components/modals/DocumentViewer";
import { getSearchAllDocumentsById } from "@services/credit-request/query/SearchAllDocuments";
import { getSearchDocumentById } from "@services/credit-request/query/SearchDocumentById";

import { IApprovalDocumentaries } from "../types";
import { approvalsConfig, optionButtons, optionsAnswer } from "./config";
import { StyledScroll } from "./styles";

interface ApprovalModalDocumentariesProps {
  isMobile: boolean;
  initialValues: IApprovalDocumentaries;
  title: string;
  id: string;
  businessUnitPublicCode: string;
  onConfirm?: (values: IApprovalDocumentaries) => void;
  onCloseModal?: () => void;
}

export function ApprovalModalDocumentaries(
  props: ApprovalModalDocumentariesProps
) {
  const {
    isMobile,
    initialValues,
    title,
    id,
    businessUnitPublicCode,
    onConfirm,
    onCloseModal,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [documents, setDocuments] = useState<any[]>([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; name: string; file: File }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { user } = useAuth0();

  const validationSchema = Yup.object({
    answer: Yup.string().required(),
    observations: Yup.string()
      .max(approvalsConfig.maxLength, validationMessages.limitedTxt)
      .required(validationMessages.required),
  });

  const formik = useFormik({
    initialValues: initialValues || {},
    validationSchema,
    validateOnMount: true,
    onSubmit: () => {},
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getSearchAllDocumentsById(
          id,
          user?.email ?? "",
          businessUnitPublicCode
        );
        setDocuments(response);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [id, user?.email, businessUnitPublicCode]);

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

  return (
    <BaseModal
      title={`${approvalsConfig.title} ${title}`}
      handleNext={() => {
        const selectedIds = formik.values.selectedDocumentIds || {};
        const selectedDocuments = documents.filter(
          (doc) => selectedIds[doc.documentId]
        );
        onConfirm?.({
          ...formik.values,
          selectedDocuments,
        });
        onCloseModal?.();
      }}
      width={isMobile ? "280px" : "500px"}
      handleBack={onCloseModal}
      backButton={approvalsConfig.Cancel}
      nextButton={approvalsConfig.confirm}
      disabledNext={!formik.values.observations || !formik.isValid}
    >
      <Stack direction="column" gap="24px">
        <Text type="body" size="large">
          {approvalsConfig.selectDocument}
        </Text>
        <Fieldset heightFieldset="210px" hasOverflow>
          <StyledScroll>
            <Stack direction="column" gap="8px" height="145px">
              {documents.map((doc, index) => (
                <Stack key={doc.documentId} direction="column" gap="8px">
                  <Stack justifyContent="space-between">
                    <Stack gap="4px">
                      <Checkbox
                        id={`check-${doc.documentId}`}
                        name={`selectedDocumentIds.${doc.documentId}`}
                        checked={
                          formik.values.selectedDocumentIds?.[doc.documentId] ||
                          false
                        }
                        onChange={() => {
                          const currentValue =
                            formik.values.selectedDocumentIds?.[
                              doc.documentId
                            ] || false;
                          formik.setFieldValue(
                            `selectedDocumentIds.${doc.documentId}`,
                            !currentValue
                          );
                        }}
                        value={doc.documentId}
                      />
                      <Text type="label" size="large">
                        {doc.abbreviatedName}
                      </Text>
                    </Stack>
                    <Text
                      type="label"
                      weight="bold"
                      size="large"
                      appearance="primary"
                      cursorHover
                      onClick={() =>
                        handlePreview(doc.documentId, doc.abbreviatedName)
                      }
                    >
                      {approvalsConfig.see}
                    </Text>
                  </Stack>
                  {index < documents.length - 1 && <Divider />}
                </Stack>
              ))}
            </Stack>
          </StyledScroll>
          <Divider dashed />
          <Button
            iconBefore={<MdOutlineFileUpload />}
            variant="none"
            spacing="compact"
            onClick={() => setIsShowModal(true)}
          >
            {approvalsConfig.newDocument}
          </Button>
        </Fieldset>
        <Select
          name="answer"
          id="answer"
          options={optionsAnswer}
          label={approvalsConfig.answer}
          placeholder={approvalsConfig.answerPlaceHoleder}
          value={formik.values.answer}
          onChange={(name, value) => formik.setFieldValue(name, value)}
          onBlur={formik.handleBlur}
          size="compact"
          fullwidth
        />
        <Textarea
          id="observations"
          name="observations"
          label={approvalsConfig.observations}
          placeholder={approvalsConfig.observationdetails}
          maxLength={approvalsConfig.maxLength}
          value={formik.values.observations}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          fullwidth
        />
        {isShowModal && (
          <ListModal
            title="Cargar documento nuevo"
            buttonLabel="Cargar"
            handleClose={() => setIsShowModal(false)}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            isViewing={false}
            id={id}
            optionButtons={optionButtons}
          />
        )}
        {selectedFile && open && (
          <DocumentViewer
            selectedFile={selectedFile}
            handleClose={() => setOpen(false)}
            title={fileName || ""}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
