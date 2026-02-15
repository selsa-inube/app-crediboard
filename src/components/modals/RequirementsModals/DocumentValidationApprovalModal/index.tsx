import { useEffect, useState, useMemo } from "react";
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
  Textfield,
} from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { Fieldset } from "@components/data/Fieldset";
import { BaseModal } from "@components/modals/baseModal";
import { ListModal } from "@components/modals/ListModal";
import { DocumentViewer } from "@components/modals/DocumentViewer";
import { getSearchAllDocumentsById } from "@services/creditRequest/query/SearchAllDocuments";
import { getSearchDocumentById } from "@services/creditRequest/query/SearchDocumentById";
import { IPackagesOfRequirementsById } from "@services/requirementsPackages/types";
import { approveRequirementById } from "@services/requirementsPackages/approveRequirementById";
import { requirementStatus } from "@services/enum/irequirements/requirementstatus/requirementstatus";
import { ErrorModal } from "@components/modals/ErrorModal";
import { useEnum } from "@hooks/useEnum";
import { ICrediboardData } from "@context/AppContext/types";

import { DocumentItem, IApprovalDocumentaries } from "../types";
import {
  approvalsConfigEnum,
  optionButtons,
  optionsAnswerEnum,
} from "./config";
import { StyledScroll } from "./styles";

interface IDocumentValidationApprovalModalsProps {
  isMobile: boolean;
  initialValues: IApprovalDocumentaries;
  title: string;
  id: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  user: string;
  seenDocuments: string[];
  entryId: string;
  entryIdToRequirementMap: Record<string, string>;
  rawRequirements: IPackagesOfRequirementsById[];
  setSeenDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  onConfirm?: (values: IApprovalDocumentaries) => void;
  onCloseModal?: () => void;
  eventData: ICrediboardData;
}

export function DocumentValidationApprovalModal(
  props: IDocumentValidationApprovalModalsProps,
) {
  const {
    isMobile,
    initialValues,
    title,
    id,
    eventData,
    businessUnitPublicCode,
    businessManagerCode,
    user,
    seenDocuments,
    entryId,
    entryIdToRequirementMap,
    rawRequirements,
    setSeenDocuments,
    onConfirm,
    onCloseModal,
  } = props;
  const { lang } = useEnum();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; name: string; file: File }[]
  >([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const optionsAnswer = useMemo(
    () =>
      Object.values(optionsAnswerEnum).map((option) => ({
        id: option.id,
        value: option.i18n[lang],
        label: option.i18n[lang],
      })),
    [lang],
  );

  const getOptionLabel = (value: string) => {
    const option = optionsAnswer.find((opt) => opt.id === value);
    return option?.label || value;
  };

  const validationSchema = Yup.object({
    answer: Yup.string().required(),
    observations: Yup.string()
      .max(200, validationMessages.limitedTxt)
      .required(validationMessages.required),
    selectedDocumentIds: Yup.object().test(
      (value) => value && Object.values(value).some(Boolean),
    ),
  });

  const getRequirementCode = (codeKey: string) => {
    return requirementStatus.find((item) => item.Code === codeKey)?.Code || "";
  };

  const formik = useFormik({
    initialValues: initialValues || {},
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        const requirementByPackageId = entryIdToRequirementMap[entryId];

        if (!requirementByPackageId) return;

        const selectedIds = values.selectedDocumentIds || {};
        const selectedDocuments = documents.filter(
          (doc) => selectedIds[doc.documentId],
        );

        let nextStatusValue = "";
        if (formik.values.answer === optionsAnswer[0].label) {
          nextStatusValue = getRequirementCode("DOCUMENT_STORED_AND_VALIDATED");
        } else if (formik.values.answer === optionsAnswer[1].label) {
          nextStatusValue = getRequirementCode("FAILED_DOCUMENT_VALIDATION");
        } else if (formik.values.answer === optionsAnswer[3].label) {
          nextStatusValue = getRequirementCode(
            "INVALID_DOCUMENT_CANCELS_REQUEST",
          );
        } else if (formik.values.answer === optionsAnswer[2].label) {
          nextStatusValue = getRequirementCode("DOCUMENT_IGNORED_BY_THE_USER");
        }

        const payload = {
          modifyJustification: "Status change",
          nextStatusValue,
          packageId: rawRequirements[0]?.packageId,
          requirementByPackageId,
          statusChangeJustification: values.observations,
          transactionOperation: "PartialUpdate",
          documentsByRequirement: [
            {
              documentCode: "",
              requirementByPackageId: "",
              transactionOperation: "PartialUpdate",
            },
          ],
        };

        await approveRequirementById(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
          eventData.token || "",
          eventData.user.identificationDocumentNumber || "",
        );

        if (onConfirm) {
          onConfirm({
            ...values,
            selectedDocuments,
          });
        }

        if (onCloseModal) {
          onCloseModal();
        }
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(approvalsConfigEnum.titleError.i18n[lang]);
      }
    },
  });

  useEffect(() => {
    if (optionsAnswer && optionsAnswer.length === 1) {
      const singleOption = optionsAnswer[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.answer && optionValue) {
        formik.setFieldValue("answer", optionValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getSearchAllDocumentsById(
          id,
          user,
          businessUnitPublicCode,
          businessManagerCode,
          eventData.token || "",
        );
        setDocuments(response);
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(approvalsConfigEnum.titleErrorDocument.i18n[lang]);
      }
    };

    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, businessUnitPublicCode]);

  const handlePreview = async (id: string, name: string) => {
    try {
      const documentData = await getSearchDocumentById(
        id,
        user,
        businessUnitPublicCode,
        businessManagerCode,
        eventData.token || "",
      );
      const fileUrl = documentData.urlDocument;
      setSelectedFile(fileUrl);
      setFileName(name);
      setOpen(true);
      setSeenDocuments((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(approvalsConfigEnum.titleErrorDocument.i18n[lang]);
    }
  };

  return (
    <BaseModal
      title={`${approvalsConfigEnum.title.i18n[lang]} ${title}`}
      handleNext={formik.handleSubmit}
      width={isMobile ? "300px" : "432px"}
      handleBack={onCloseModal}
      backButton={approvalsConfigEnum.cancel.i18n[lang]}
      nextButton={approvalsConfigEnum.confirm.i18n[lang]}
      disabledNext={!formik.values.observations || !formik.isValid}
    >
      <Stack direction="column" gap="24px">
        <Text type="body" size="large">
          {approvalsConfigEnum.selectDocument.i18n[lang]}
        </Text>
        <Fieldset heightFieldset="210px" borderColor="gray" hasOverflow>
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
                            !currentValue,
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
                      {seenDocuments.includes(doc.documentId) &&
                        approvalsConfigEnum.seen.i18n[lang]}
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
            {approvalsConfigEnum.newDocument.i18n[lang]}
          </Button>
        </Fieldset>
        {optionsAnswer && optionsAnswer.length === 1 ? (
          <Textfield
            name="answer"
            id="answer"
            label={approvalsConfigEnum.answer.i18n[lang]}
            value={getOptionLabel(formik.values.answer)}
            disabled
            size="compact"
            fullwidth
          />
        ) : (
          <Select
            name="answer"
            id="answer"
            options={optionsAnswer}
            label={approvalsConfigEnum.answer.i18n[lang]}
            placeholder={approvalsConfigEnum.answerPlaceHolder.i18n[lang]}
            value={formik.values.answer}
            onChange={(name, value) => formik.setFieldValue(name, value)}
            onBlur={formik.handleBlur}
            size="compact"
            fullwidth
          />
        )}
        <Textarea
          id="observations"
          name="observations"
          label={approvalsConfigEnum.observations.i18n[lang]}
          placeholder={approvalsConfigEnum.observationdetails.i18n[lang]}
          maxLength={200}
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

        {showErrorModal && (
          <ErrorModal
            handleClose={() => {
              setShowErrorModal(false);
            }}
            isMobile={isMobile}
            message={messageError}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
