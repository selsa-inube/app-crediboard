import { useFormik } from "formik";
import * as Yup from "yup";
import { Stack, Text, Textarea, Toggle } from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { BaseModal } from "@components/modals/baseModal";

import { IApprovalSystem } from "../types";
import { approvalsConfig } from "./config";

interface ApprovalsModalSystemProps {
  isMobile: boolean;
  initialValues: IApprovalSystem;
  onConfirm?: (values: IApprovalSystem) => void;
  onCloseModal?: () => void;
}

export function ApprovalsModalSystem(props: ApprovalsModalSystemProps) {
  const { isMobile, initialValues, onConfirm, onCloseModal } = props;

  const validationSchema = Yup.object({
    toggleChecked: Yup.boolean(),
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
          <Stack>
            <Toggle
              checked={formik.values.toggleChecked}
              onChange={(e) => {
                const checked = e.target.checked;
                formik.setFieldValue("toggleChecked", checked);
              }}
            />
            <Text type="label" size="large" weight="bold">
              {formik.values.toggleChecked
                ? approvalsConfig.yes
                : approvalsConfig.no}
            </Text>
          </Stack>
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
