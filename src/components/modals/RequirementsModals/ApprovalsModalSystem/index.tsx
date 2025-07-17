import { useEffect } from "react";
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
  questionToBeAskedInModal: string;
  onConfirm?: (values: IApprovalSystem) => void;
  onCloseModal?: () => void;
}

export function ApprovalsModalSystem(props: ApprovalsModalSystemProps) {
  const { isMobile, initialValues, questionToBeAskedInModal, onConfirm, onCloseModal } = props;

  const validationSchema = Yup.object({
    toggleChecked: Yup.boolean(),
    observations: Yup.string()
      .max(approvalsConfig.maxLength, validationMessages.limitedTxt)
      .required(validationMessages.required),
    labelText: Yup.string(),
  });

  const formik = useFormik({
    initialValues: initialValues || {},
    validationSchema,
    validateOnMount: true,
    onSubmit: () => {},
  });

  useEffect(() => {
    const label = formik.values.toggleChecked
      ? approvalsConfig.yes
      : approvalsConfig.no;

    formik.setFieldValue("labelText", label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseModal
      title={approvalsConfig.title}
      handleNext={() => {
        onConfirm?.(formik.values);
        onCloseModal?.();
      }}
      width={isMobile ? "300px" : "432px"}
      handleBack={onCloseModal}
      backButton={approvalsConfig.Cancel}
      nextButton={approvalsConfig.confirm}
      disabledNext={!formik.values.observations || !formik.isValid}
    >
      <Stack direction="column" gap="24px">
        <Stack direction="column" gap="8px">
          <Text>{`${approvalsConfig.approval} ${questionToBeAskedInModal}`}</Text>
          <Stack>
            <Toggle
              checked={formik.values.toggleChecked}
              onChange={(event) => {
                const checked = event.target.checked;
                formik.setFieldValue("toggleChecked", checked);
                formik.setFieldValue(
                  "labelText",
                  checked ? approvalsConfig.yes : approvalsConfig.no
                );
              }}
            />
            <Text type="label" size="large" weight="bold">
              {formik.values.labelText}
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
          fullwidth
        />
      </Stack>
    </BaseModal>
  );
}
