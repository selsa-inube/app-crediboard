import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Stack, Text, Textarea } from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { BaseModal } from "@components/modals/baseModal";

import { IApprovalHuman } from "../types";
import { approvalsConfig, optionsAnswer } from "./config";

interface ApprovalsModalHumanProps {
  isMobile: boolean;
  initialValues: IApprovalHuman;
  onConfirm?: (values: IApprovalHuman) => void;
  onCloseModal?: () => void;
}

export function ApprovalsModalHuman(props: ApprovalsModalHumanProps) {
  const { isMobile, initialValues, onConfirm, onCloseModal } = props;

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

  return (
    <BaseModal
      title={approvalsConfig.title}
      handleNext={() => {
        onConfirm?.(formik.values);
        onCloseModal?.();
      }}
      width={isMobile ? "280px" : "500px"}
      handleBack={onCloseModal}
      backButton={approvalsConfig.Cancel}
      nextButton={approvalsConfig.confirm}
      disabledNext={!formik.values.observations || !formik.isValid}
    >
      <Stack direction="column" gap="24px">
        <Stack direction="column" gap="8px">
          <Text>{approvalsConfig.approval}</Text>
          <Select
            name="answer"
            id="answer"
            options={optionsAnswer}
            label={approvalsConfig.answer}
            placeholder={approvalsConfig.answerPlaceHoleder}
            value={formik.values.answer}
            onChange={(name, value) => formik.setFieldValue(name, value)}
            onBlur={formik.handleBlur}
            size="wide"
          />
        </Stack>
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
        />
      </Stack>
    </BaseModal>
  );
}
