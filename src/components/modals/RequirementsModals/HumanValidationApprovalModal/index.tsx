import { useState, useMemo } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Select, Stack, Text, Textarea, Input } from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { BaseModal } from "@components/modals/baseModal";
import { IPackagesOfRequirementsById } from "@services/requirementsPackages/types";
import { approveRequirementById } from "@services/requirementsPackages/approveRequirementById";
import { requirementStatus } from "@services/enum/irequirements/requirementstatus/requirementstatus";
import { ErrorModal } from "@components/modals/ErrorModal";
import { useEnum } from "@hooks/useEnum";
import { ICrediboardData } from "@context/AppContext/types";

import { IApprovalHuman } from "../types";
import { approvalsConfigEnum, optionsAnswerEnum } from "./config";

interface IHumanValidationApprovalModalProps {
  isMobile: boolean;
  initialValues: IApprovalHuman;
  businessUnitPublicCode: string;
  eventData: ICrediboardData;
  businessManagerCode: string;
  entryId: string;
  entryIdToRequirementMap: Record<string, string>;
  rawRequirements: IPackagesOfRequirementsById[];
  onConfirm?: (values: IApprovalHuman) => void;
  onCloseModal?: () => void;
}

export function HumanValidationApprovalModal(
  props: IHumanValidationApprovalModalProps,
) {
  const {
    isMobile,
    initialValues,
    businessUnitPublicCode,
    businessManagerCode,
    entryId,
    entryIdToRequirementMap,
    rawRequirements,
    onConfirm,
    onCloseModal,
    eventData,
  } = props;
  const { lang } = useEnum();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");

  const optionsAnswer = useMemo(
    () =>
      Object.values(optionsAnswerEnum).map((option) => ({
        id: option.id,
        value: option.value,
        label: option.i18n[lang],
      })),
    [lang],
  );

  const validationSchema = Yup.object({
    answer: Yup.string().required(),
    observations: Yup.string()
      .max(200, validationMessages.limitedTxt)
      .required(validationMessages.required),
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

        let nextStatusValue = "";
        if (formik.values.answer === optionsAnswer[0].label) {
          nextStatusValue = getRequirementCode("PASSED_HUMAN_VALIDATION");
        } else if (formik.values.answer === optionsAnswer[1].label) {
          nextStatusValue = getRequirementCode("FAILED_HUMAN_VALIDATION");
        } else if (formik.values.answer === optionsAnswer[3].label) {
          nextStatusValue = getRequirementCode(
            "VALIDATION_FAILED_CANCELS_REQUEST",
          );
        } else if (formik.values.answer === optionsAnswer[2].label) {
          nextStatusValue = getRequirementCode(
            "IGNORED_BY_THE_USER_HUMAN_VALIDATION",
          );
        }

        const payload = {
          modifyJustification: "Status change",
          nextStatusValue,
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
          payload,
          eventData.token || "",
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

  const hasSingleOption = optionsAnswer.length === 1;

  if (hasSingleOption && !formik.values.answer) {
    formik.setFieldValue("answer", optionsAnswer[0].value);
  }

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
          <Text>{approvalsConfigEnum.approval.i18n[lang]}</Text>
          {hasSingleOption ? (
            <Input
              name="answer"
              id="answer"
              label={approvalsConfigEnum.answer.i18n[lang]}
              value={optionsAnswer[0].label}
              disabled
              size="compact"
              fullwidth
            />
          ) : (
            <Select
              name="answer"
              id="answer"
              options={optionsAnswer}
              label={approvalsConfigEnum.answer.i18n[lang]}
              placeholder={approvalsConfigEnum.answerPlaceHolder.i18n[lang]}
              value={formik.values.answer}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              onBlur={formik.handleBlur}
              size="compact"
              fullwidth
            />
          )}
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
