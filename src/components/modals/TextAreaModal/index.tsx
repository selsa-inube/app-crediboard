import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Textarea, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";

interface FormValues {
  textarea: string;
}

export interface TextAreaModalProps {
  onSecondaryButtonClick?: () => void;
  onCloseModal: () => void;
  title: string;
  buttonText: string;
  inputLabel: string;
  inputPlaceholder: string;
  onSubmit?: (values: { textarea: string }) => void;
  handleNext: () => void;
  maxLength?: number;
  readOnly?: boolean;
  hideCharCount?: boolean;
  disableTextarea?: boolean;
  secondaryButtonText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TextAreaModal(props: TextAreaModalProps) {
  const {
    onSubmit,
    onCloseModal,
    handleNext,
    title,
    buttonText,
    inputLabel,
    inputPlaceholder,
    onSecondaryButtonClick,
    maxLength = 200,
    readOnly = false,
    disableTextarea = false,
    secondaryButtonText = "Cancelar",
    onChange,
  } = props;

  const validationSchema = Yup.object().shape({
    textarea: readOnly
      ? Yup.string()
      : Yup.string()
          .max(maxLength, "El número de caracteres es demasiado largo")
          .required("Este campo es obligatorio"),
  });

  const isMobile = useMediaQuery("(max-width: 700px)");

  return (
    <Formik
      initialValues={{ textarea: "" }}
      validationSchema={validationSchema}
      onSubmit={(
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
      ) => {
        onSubmit?.(values);
        setSubmitting(false);
        onCloseModal?.();
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <BaseModal
          title={title}
          nextButton={buttonText}
          backButton={secondaryButtonText}
          handleNext={handleNext}
          handleBack={onSecondaryButtonClick}
          handleClose={onCloseModal}
          width={isMobile ? "300px" : "500px"}
          disabledNext={isSubmitting && !readOnly}
        >
          <Form>
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
                  onChange={(e) => {
                    field.onChange(e);
                    onChange?.(e);
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
