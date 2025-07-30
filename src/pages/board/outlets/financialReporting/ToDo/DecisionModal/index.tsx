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

import { IMakeDecisionsCreditRequestWithXAction } from "./types";
import { StyledContainerTextField } from "./styles";
import { soporteInvalidOptions, txtFlags, txtOthersOptions } from "./../config";

interface FormValues {
  textarea: string;
  selectedOptions?: string[];
}

export interface DecisionModalProps {
  onCloseModal: () => void;
  data: IMakeDecisionsCreditRequestWithXAction;
  title: string;
  buttonText: string;
  inputLabel: string;
  inputPlaceholder: string;
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

  const validationSchema = Yup.object().shape({
    textarea: readOnly
      ? Yup.string()
      : Yup.string()
          .max(maxLength, validationMessages.maxCharacters(maxLength))
          .required(validationMessages.required),
  });

  const sendData = async (value: string) => {
    try {
      const response = await makeDecisions(
        data.businessUnit,
        data.user,
        {
          creditRequestId: data.makeDecision.creditRequestId,
          humanDecision: data.makeDecision.humanDecision,
          justification: value,
        },
        data.xAction
      );
      if (response.statusServices === 200) {
        navigate("/");
        addFlag({
          title: txtFlags.titleSuccess,
          description: `${txtFlags.descriptionSuccess} ${response.status}`,
          appearance: "success",
          duration: txtFlags.duration,
        });
      } else {
        addFlag({
          title: txtFlags.titleWarning,
          description: `${txtFlags.descriptionWarning} ${response.statusServices}`,
          appearance: "warning",
          duration: txtFlags.duration,
        });
      }
    } catch (error) {
      addFlag({
        title: txtFlags.titleDanger,
        description: txtFlags.descriptionDanger,
        appearance: "danger",
        duration: txtFlags.duration,
      });
    } finally {
      onCloseModal?.();
    }
  };
  const initialValues: FormValues = {
    textarea: "",
    selectedOptions: [],
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
      ) => {
        onSubmit?.(values);
        setSubmitting(false);
        sendData(values.textarea);
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
            data.makeDecision.humanDecision && values.textarea ? false : true
          }
          width={isMobile ? "290px" : "500px"}
        >
          <Form>
            <StyledContainerTextField $smallScreen={isMobile}>
              <Stack direction="column">
                <Text type="label" size="large" appearance="dark" weight="bold">
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
            {data.makeDecision.humanDecision === "SOPORTES_INVALIDOS" && (
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
                    touched.textarea && errors.textarea ? "invalid" : "pending"
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
  );
}
