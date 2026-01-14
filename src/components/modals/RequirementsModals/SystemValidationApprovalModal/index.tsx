import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Stack, Text, Textarea, Toggle } from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { BaseModal } from "@components/modals/baseModal";
import { approveRequirementById } from "@services/requirementsPackages/approveRequirementById";
import { IPackagesOfRequirementsById } from "@services/requirementsPackages/types";
import { requirementStatus } from "@services/enum/irequirements/requirementstatus/requirementstatus";
import { useEnum } from "@hooks/useEnum";

import { IApprovalSystem } from "../types";
import { approvalsConfigEnum } from "./config";
import { ErrorModal } from "@components/modals/ErrorModal";

interface ISystemValidationApprovalModalProps {
  isMobile: boolean;
  initialValues: IApprovalSystem;
  questionToBeAskedInModal: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  entryId: string;
  entryIdToRequirementMap: Record<string, string>;
  rawRequirements: IPackagesOfRequirementsById[];
  onConfirm?: (values: IApprovalSystem) => void;
  onCloseModal?: () => void;
}

export function SystemValidationApprovalModal(
  props: ISystemValidationApprovalModalProps
) {
  const {
    isMobile,
    initialValues,
    questionToBeAskedInModal,
    businessUnitPublicCode,
    businessManagerCode,
    entryId,
    entryIdToRequirementMap,
    rawRequirements,
    onConfirm,
    onCloseModal,
  } = props;
  const { lang: lang } = useEnum();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");

  const validationSchema = Yup.object({
    toggleChecked: Yup.boolean(),
    observations: Yup.string()
      .max(200, validationMessages.limitedTxt)
      .required(validationMessages.required),
    labelText: Yup.string(),
  });

  const getRequirementCode = (codeKey: string) => {
    return requirementStatus.find((item) => item.Code === codeKey)?.Code || "";
  };

  const formik = useFormik({
    initialValues: initialValues || {},
    validationSchema,
    validateOnMount: true,
    onSubmit: async () => {
      try {
        const requirementByPackageId = entryIdToRequirementMap[entryId];

        if (!requirementByPackageId) return;

        const payload = {
          modifyJustification: "Status change",
          nextStatusValue: formik.values.toggleChecked
            ? getRequirementCode("UNVALIDATED_SYSTEM_VALIDATION")
            : getRequirementCode("IGNORED_BY_THE_USER_SYSTEM_VALIDATION"),
          packageId: rawRequirements[0].packageId,
          requirementByPackageId: requirementByPackageId,
          statusChangeJustification: formik.values.observations,
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
          payload
        );

        if (onConfirm) {
          onConfirm(formik.values);
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
    const label = formik.values.toggleChecked
      ? approvalsConfigEnum.approveRequirementLabel.i18n[lang]
      : approvalsConfigEnum.rejectRequirementLabel.i18n[lang];

    formik.setFieldValue("labelText", label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.toggleChecked]);

  return (
    <BaseModal
      title={approvalsConfigEnum.title.i18n[lang]}
      handleNext={formik.handleSubmit}
      width={isMobile ? "300px" : "432px"}
      handleBack={onCloseModal}
      backButton={approvalsConfigEnum.cancel.i18n[lang]}
      nextButton={approvalsConfigEnum.confirm.i18n[lang]}
      disabledNext={!formik.values.observations || !formik.isValid}
    >
      <Stack direction="column" gap="24px">
        <Stack direction="column" gap="8px">
          <Text>{`${approvalsConfigEnum.approval.i18n[lang]} ${questionToBeAskedInModal}`}</Text>
          <Stack>
            <Toggle
              checked={formik.values.toggleChecked}
              onChange={(event) => {
                const checked = event.target.checked;
                formik.setFieldValue("toggleChecked", checked);
                formik.setFieldValue(
                  "labelText",
                  checked
                    ? approvalsConfigEnum.approveRequirementLabel.i18n[lang]
                    : approvalsConfigEnum.rejectRequirementLabel.i18n[lang]
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
          label={approvalsConfigEnum.observations.i18n[lang]}
          placeholder={approvalsConfigEnum.observationdetails.i18n[lang]}
          maxLength={200}
          value={formik.values.observations}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          fullwidth
        />
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
