import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Stack, Text, Textarea, Toggle, useFlag } from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { BaseModal } from "@components/modals/baseModal";
import { approveRequirementById } from "@services/requirementsPackages/approveRequirementById";
import { IRequirement } from "@services/types";

import { IApprovalSystem } from "../types";
import { approvalsConfig } from "./config";

interface ApprovalsModalSystemProps {
  isMobile: boolean;
  initialValues: IApprovalSystem;
  questionToBeAskedInModal: string;
  businessUnitPublicCode: string;
  entryId: string;
  entryIdToRequirementMap: Record<string, string>;
  rawRequirements: IRequirement[];
  onConfirm?: (values: IApprovalSystem) => void;
  onCloseModal?: () => void;
}

export function ApprovalsModalSystem(props: ApprovalsModalSystemProps) {
  const {
    isMobile,
    initialValues,
    questionToBeAskedInModal,
    businessUnitPublicCode,
    entryId,
    entryIdToRequirementMap,
    rawRequirements,
    onConfirm,
    onCloseModal,
  } = props;

  const { addFlag } = useFlag();

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
    onSubmit: async () => {
      try {
        const requirementPackageId = entryIdToRequirementMap[entryId];

        if (!requirementPackageId) return;

        const payload = {
          modifyJustification: "change state",
          nextStatusValue: formik.values.toggleChecked
            ? "UNVALIDATED_SYSTEM_VALIDATION"
            : "IGNORED_BY_THE_USER_SYSTEM_VALIDATION",
          packageId: rawRequirements[0].packageId,
          requirementPackageId: requirementPackageId,
          statusChangeJustification: formik.values.observations,
          transactionOperation: "PartialUpdate",
          documentsByRequirement: [
            {
              documentCode: "",
              requirementPackageId: "",
              transactionOperation: "PartialUpdate",
            },
          ],
        };

        await approveRequirementById(businessUnitPublicCode, payload);

        if (onConfirm) {
          onConfirm(formik.values);
        }

        if (onCloseModal) {
          onCloseModal();
        }
      } catch (error: unknown) {
        const err = error as {
          message?: string;
          status: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + err?.message + (err?.data?.description || "");
        addFlag({
          title: approvalsConfig.titleError,
          description,
          appearance: "danger",
          duration: 5000,
        });
      }
    },
  });

  useEffect(() => {
    const label = formik.values.toggleChecked
      ? approvalsConfig.yes
      : approvalsConfig.no;

    formik.setFieldValue("labelText", label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.toggleChecked]);

  return (
    <BaseModal
      title={approvalsConfig.title}
      handleNext={formik.handleSubmit}
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
