import { useState, useMemo } from "react";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Stack,
  Text,
  useFlag,
  useMediaQuery,
  Textarea,
  Checkpicker,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { makeDecisions } from "@services/creditRequest/command/makeDecisions";
import { validationMessages } from "@validations/validationMessages";
import { ErrorModal } from "@components/modals/ErrorModal";
import { useEnum } from "@hooks/useEnum";
import { ICrediboardData } from "@context/AppContext/types";
import { IMakeDecisionsCreditRequest } from "@services/creditRequest/command/types";

import {
  IMakeDecisionsCreditRequestWithXAction,
  IMakeDecisionsPayload,
} from "./types";
import { StyledContainerTextField } from "./styles";
import {
  soporteInvalidOptionsEnum,
  txtFlagsEnum,
  txtOthersOptionsEnum,
} from "./../config";
import { IAllEnumsResponse } from "@services/enumerators/types";

interface FormValues {
  textarea: string;
  selectedOptions?: string;
}

export interface DecisionModalProps {
  onCloseModal: () => void;
  data: IMakeDecisionsCreditRequestWithXAction;
  title: string;
  buttonText: string;
  inputLabel: string;
  inputPlaceholder: string;
  businessManagerCode: string;
  eventData: ICrediboardData;
  enums: IAllEnumsResponse | null;
  handleDecisionModal: () => void;
  onSubmit?: (values: { textarea: string }) => void;
  onSecondaryButtonClick?: () => void;
  maxLength?: number;
  readOnly?: boolean;
  disableTextarea?: boolean;
  secondaryButtonText?: string;
}

export function DecisionModal(props: DecisionModalProps) {
  const {
    onCloseModal,
    data,
    title,
    buttonText,
    inputLabel,
    inputPlaceholder,
    businessManagerCode,
    onSubmit,
    handleDecisionModal,
    enums,
    eventData,
    onSecondaryButtonClick,
    maxLength = 200,
    readOnly = false,
    disableTextarea = false,
    secondaryButtonText = "Cancelar",
  } = props;

  const { addFlag } = useFlag();
  const { lang } = useEnum();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object().shape({
    textarea: readOnly
      ? Yup.string()
      : Yup.string()
          .max(maxLength, validationMessages.maxCharacters(maxLength))
          .required(validationMessages.required),
  });

  const mappedSoporteOptions = useMemo(
    () =>
      soporteInvalidOptionsEnum.map((option) => ({
        id: option.id,
        label: option.i18n[lang],
        value: option.value,
      })),
    [lang],
  );
  const handleNonCompliantDocuments = (formValues: FormValues): string[] => {
    let selectedIds: string[] = [];

    if (formValues.selectedOptions) {
      selectedIds = formValues.selectedOptions.split(",");
      selectedIds.shift();
    }

    const selectedIndices = selectedIds.map((id) => parseInt(id) - 1);

    return realNamesEnumNonCompliantDocuments(selectedIndices) as string[];
  };
  const soportesInvalidosCode = enums?.DmDecisions?.find(
    (d) => d.code === "SOPORTES_INVALIDOS",
  )?.code;
  const realNamesEnumNonCompliantDocuments = (selectedOptions: number[]) => {
    return selectedOptions
      .map((index) => soporteInvalidOptionsEnum[index]?.value)
      .filter(Boolean);
  };
  const sendData = async (formValues: FormValues) => {
    try {
      const makeDecisionsPayload: IMakeDecisionsPayload = {
        creditRequestId: data.makeDecision.creditRequestId,
      };

      if (data.xAction === "RegisterIndividualConceptOfApproval") {
        makeDecisionsPayload["concept"] = data.makeDecision.concept;
        makeDecisionsPayload["justificacion"] = formValues.textarea || "";
        makeDecisionsPayload["registerIndividualConcept"] = true;
      } else {
        makeDecisionsPayload["humanDecision"] = data.makeDecision.humanDecision;
        makeDecisionsPayload["justification"] = formValues.textarea || "";
      }

      if (
        formValues.selectedOptions &&
        data.xAction === "DisapproveLegalDocumentsAndWarranties"
      ) {
        makeDecisionsPayload["nonCompliantDocuments"] =
          handleNonCompliantDocuments(formValues);
      }

      const response = await makeDecisions(
        data.businessUnit,
        businessManagerCode,
        data.user,
        makeDecisionsPayload as IMakeDecisionsCreditRequest,
        data.xAction,
        eventData.token,
      );

      if (response?.statusServices === 200) {
        handleDecisionModal();
        addFlag({
          title: txtFlagsEnum.titleSuccess.i18n[lang],
          description: `${txtFlagsEnum.descriptionSuccess.i18n[lang]} ${response.status}`,
          appearance: "success",
          duration: txtFlagsEnum.duration.i18n[lang],
        });
      } else {
        setErrorMessage(txtFlagsEnum.descriptionWarning.i18n[lang]);
        setErrorModal(true);
      }
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
    } finally {
      onCloseModal?.();
    }
  };

  const initialValues: FormValues = {
    textarea: "",
    selectedOptions: "",
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(
          values: FormValues,
          { setSubmitting }: FormikHelpers<FormValues>,
        ) => {
          onSubmit?.(values);
          setSubmitting(false);
          sendData(values);
        }}
      >
        {({ errors, touched, handleSubmit, values }) => (
          <BaseModal
            title={title}
            nextButton={buttonText}
            backButton={secondaryButtonText}
            handleNext={handleSubmit}
            handleBack={onSecondaryButtonClick}
            handleClose={onCloseModal}
            disabledNext={!data.makeDecision.concept || !values.textarea}
            width={isMobile ? "290px" : "500px"}
          >
            <Form>
              <StyledContainerTextField $smallScreen={isMobile}>
                <Stack direction="column">
                  <Text
                    type="label"
                    size="large"
                    appearance="dark"
                    weight="bold"
                  >
                    {txtOthersOptionsEnum.txtDecision.i18n[lang]}
                  </Text>
                  <Text
                    type="body"
                    size="medium"
                    appearance="gray"
                    weight="normal"
                    textAlign="justify"
                  >
                    {data.humanDecisionDescription
                      ? data.humanDecisionDescription
                      : txtOthersOptionsEnum.txtNoSelect.i18n[lang]}
                  </Text>
                </Stack>
              </StyledContainerTextField>
              {data.makeDecision.concept === soportesInvalidosCode && (
                <Stack margin="0 0 20px 0">
                  <Field name="selectedOptions">
                    {({ form }: FieldProps) => (
                      <Checkpicker
                        id="selectedOptions"
                        name="selectedOptions"
                        options={mappedSoporteOptions}
                        values={values.selectedOptions || ""}
                        onChange={(name, values) =>
                          form.setFieldValue(name, values)
                        }
                        fullwidth
                      />
                    )}
                  </Field>
                </Stack>
              )}
              <Field name="textarea">
                {({ field, form: { setFieldTouched } }: FieldProps) => (
                  <Textarea
                    {...field}
                    id="textarea"
                    label={inputLabel}
                    placeholder={inputPlaceholder}
                    maxLength={maxLength}
                    status={
                      touched.textarea && errors.textarea
                        ? "invalid"
                        : "pending"
                    }
                    message={
                      touched.textarea && errors.textarea ? errors.textarea : ""
                    }
                    fullwidth
                    disabled={disableTextarea}
                    onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldTouched("textarea");
                      field.onBlur(e);
                    }}
                  />
                )}
              </Field>
            </Form>
          </BaseModal>
        )}
      </Formik>
      {errorModal && (
        <ErrorModal
          isMobile={isMobile}
          message={errorMessage}
          handleClose={() => {
            setErrorModal(false);
          }}
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
    </>
  );
}
