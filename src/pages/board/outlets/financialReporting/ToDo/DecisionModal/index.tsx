import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import {
  IMakeDecisionsCreditRequestWithXAction,
  IMakeDecisionsPayload,
} from "./types";
import { StyledContainerTextField } from "./styles";
import { soporteInvalidOptions, txtFlags, txtOthersOptions } from "./../config";

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
    onSecondaryButtonClick,
    maxLength = 200,
    readOnly = false,
    disableTextarea = false,
    secondaryButtonText = "Cancelar",
  } = props;

  const navigate = useNavigate();
  const { addFlag } = useFlag();

  const isMobile = useMediaQuery("(max-width: 700px)");

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object().shape({
    textarea: readOnly
      ? Yup.string()
      : Yup.string()
          .max(maxLength, validationMessages.maxCharacters(maxLength))
          .required(validationMessages.required),
  });

  const handleNonCompliantDocuments = (formValues: FormValues): string[] => {
    let selectedOptions: string[] | number[] = [];

    if (formValues.selectedOptions) {
      selectedOptions = formValues.selectedOptions.split(",");
      selectedOptions?.shift();
    }

    selectedOptions = selectedOptions.map(
      (option) => parseInt(`${option}`) - 1,
    );

    return realNamesEnumNonCompliantDocuments(selectedOptions) as string[];
  };

  const realNamesEnumNonCompliantDocuments = (selectedOptions: number[]) => {
    const valuesFromEnum: string[] = [];

    selectedOptions.map((option) => {
      valuesFromEnum.push(soporteInvalidOptions[option].value);
    });

    return valuesFromEnum;
  };
  const sendData = async (formValues: FormValues) => {
    try {
      const makeDecisionsPayload: IMakeDecisionsPayload = {
        concept: data.makeDecision.concept,
        creditRequestId: data.makeDecision.creditRequestId,
        justification: formValues.textarea || "",
      };

      if (
        formValues.selectedOptions &&
        data.xAction === "DisapproveLegalDocumentsAndWarranties"
      ) {
        makeDecisionsPayload["nonCompliantDocuments"] =
          handleNonCompliantDocuments(formValues);
      }

      if (data.xAction === "RegisterIndividualConceptOfApproval") {
        makeDecisionsPayload["registerIndividualConcept"] = true;
      }

      const response = await makeDecisions(
        data.businessUnit,
        businessManagerCode,
        data.user,
        makeDecisionsPayload,
        data.xAction,
      );

      if (response?.statusServices === 200) {
        navigate("/");
        addFlag({
          title: txtFlags.titleSuccess,
          description: `${txtFlags.descriptionSuccess} ${response.status}`,
          appearance: "success",
          duration: txtFlags.duration,
        });
      } else {
        setErrorMessage(txtFlags.descriptionWarning);
        setErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(txtFlags.descriptionDanger);
      setErrorModal(true);
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
            disabledNext={
              data.makeDecision.concept && values.textarea ? false : true
            }
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
                    {txtOthersOptions.txtDecision}
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
                      : txtOthersOptions.txtNoSelect}
                  </Text>
                </Stack>
              </StyledContainerTextField>
              {data.makeDecision.concept === "SOPORTES_INVALIDOS" && (
                <Stack margin="0 0 20px 0">
                  <Field name="selectedOptions">
                    {({ field, form }: FieldProps) => (
                      <Checkpicker
                        id="selectedOptions"
                        name="selectedOptions"
                        options={soporteInvalidOptions}
                        values={field.name}
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
    </>
  );
}
