import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Divider,
  Icon,
  Select,
  Stack,
  Text,
  Textarea,
} from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { BaseModal } from "@components/modals/baseModal";

import { IApprovalDocumentaries } from "../types";
import { approvalsConfig, optionsAnswer } from "./config";
import { Fieldset } from "@components/data/Fieldset";
import { MdOutlineFileUpload } from "react-icons/md";
import { StyledChange } from "./styles";

interface ApprovalModalDocumentariesProps {
  isMobile: boolean;
  initialValues: IApprovalDocumentaries;
  title: string;
  onConfirm?: (values: IApprovalDocumentaries) => void;
  onCloseModal?: () => void;
}

export function ApprovalModalDocumentaries(
  props: ApprovalModalDocumentariesProps
) {
  const { isMobile, initialValues, title, onConfirm, onCloseModal } = props;

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
      title={approvalsConfig.title + title}
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
        <Fieldset>
          <Text type="body" size="large">
            {approvalsConfig.selectDocument}
          </Text>
          <Divider dashed />
          <StyledChange>
            <Icon icon={<MdOutlineFileUpload />} appearance="primary" />
            <Text type="label" weight="bold" size="large" appearance="primary">
              {approvalsConfig.newDocument}
            </Text>
          </StyledChange>
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
          size="wide"
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
        />
      </Stack>
    </BaseModal>
  );
}
