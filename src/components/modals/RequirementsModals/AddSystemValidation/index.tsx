import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Stack, useMediaQuery, Select, Textfield } from "@inubekit/inubekit";

import { IPatchOfRequirements } from "@services/requirementsPackages/types";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";
import { IPackagesOfRequirementsById } from "@services/requirementsPackages/types";
import { dataAddRequirement } from "@pages/board/outlets/financialReporting/Requirements/config";

import { IOptionsSelect } from "../types";
import { requirementJustificationMap, validationMessages } from "./config";

export interface IRequirements {
  optionsRequirement: IOptionsSelect[];
  creditRequestCode: string;
  title: string;
  setTypeOfRequirementToEvaluated: React.Dispatch<React.SetStateAction<string>>;
  setdescriptionUseValues: React.Dispatch<React.SetStateAction<string>>;
  setRequirementName: React.Dispatch<React.SetStateAction<string>>;
  buttonText: string;
  justificationRequirement: string;
  setJustificationRequirement: React.Dispatch<React.SetStateAction<string>>;
  rawRequirements?: IPackagesOfRequirementsById[];
  requirementName?: string;
  descriptionUseValues?: string;
  typeOfRequirementToEvaluated?: string;
  readOnly?: boolean;
  handleNext?: () => void;
  onSecondaryButtonClick?: () => void;
  secondaryButtonText?: string;
  onChange?: (key: string) => void;
  onSubmit?: (values: { descriptionUseValues: string }) => void;
  onCloseModal?: () => void;
  disabledBack?: boolean;
  setSentData: React.Dispatch<
    React.SetStateAction<IPatchOfRequirements | null>
  >;
}

export function AddSystemValidation(props: IRequirements) {
  const {
    onSubmit,
    title,
    readOnly,
    buttonText,
    onCloseModal,
    onSecondaryButtonClick,
    optionsRequirement,
    setdescriptionUseValues,
    handleNext,
    secondaryButtonText = "Cancelar",
    setJustificationRequirement,
    justificationRequirement,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const [initialValues, setInitialValues] = useState({
    descriptionUseValues: "",
    requirementCatalogName: "",
    descriptionUse: "",
  });

  const getOptionLabel = (options: IOptionsSelect[], value: string) => {
    const option = options?.find(
      (opt) => opt.id === value || opt.value === value
    );
    return option?.label || option?.value || value;
  };

  const validationSchema = Yup.object().shape({
    descriptionUseValues: Yup.string().required(
      validationMessages.requiredField
    ),
  });

  const isButtonDisabled = (
    values: { descriptionUseValues: string },
    isSubmitting: boolean
  ): boolean => {
    return !values.descriptionUseValues || isSubmitting;
  };

  const getPlaceholderText = (selectedValue: string) => {
    return requirementJustificationMap[selectedValue] || "";
  };

  const handleRequirementChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue(name, value);
    const selectedOption = options.Requirement.find(
      (option) => option.value === value
    );
    if (selectedOption) {
      setdescriptionUseValues(selectedOption.value);
      const newPlaceholder = getPlaceholderText(selectedOption.value);
      setJustificationRequirement(newPlaceholder);
    }
  };

  const options = {
    Requirement: optionsRequirement.map((official) => ({
      id: official.id,
      label: official.label,
      value: official.value,
    })),
  };

  // Auto-select single requirement option
  useEffect(
    () => {
      if (options.Requirement.length === 1) {
        const singleOption = options.Requirement[0];
        const optionValue = singleOption.value;

        setInitialValues((prev) => ({
          ...prev,
          descriptionUseValues: optionValue,
        }));
        setdescriptionUseValues(optionValue);
        const newPlaceholder = getPlaceholderText(optionValue);
        setJustificationRequirement(newPlaceholder);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      options.Requirement.length,
      setdescriptionUseValues,
      setJustificationRequirement,
    ]
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit?.(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <BaseModal
          title={title}
          nextButton={buttonText}
          backButton={secondaryButtonText}
          handleNext={handleNext ?? (() => {})}
          handleBack={onSecondaryButtonClick}
          handleClose={onCloseModal}
          width={isMobile ? "300px" : "500px"}
          disabledNext={isButtonDisabled(values, isSubmitting) && !readOnly}
        >
          <Form>
            <Stack direction="column" gap="24px">
              {options.Requirement && options.Requirement.length === 1 ? (
                <Textfield
                  name="descriptionUseValues"
                  id="descriptionUseValues"
                  label={dataAddRequirement.labelPaymentMethod}
                  value={getOptionLabel(
                    options.Requirement,
                    values.descriptionUseValues
                  )}
                  disabled
                  fullwidth
                />
              ) : (
                <Select
                  name="descriptionUseValues"
                  id="descriptionUseValues"
                  label={dataAddRequirement.labelPaymentMethod}
                  placeholder={
                    options.Requirement.length > 0
                      ? "Selecciona una opción"
                      : "No hay disponibles"
                  }
                  options={options.Requirement}
                  onChange={(name, value) =>
                    handleRequirementChange(name, value, setFieldValue)
                  }
                  value={values.descriptionUseValues}
                  fullwidth
                  disabled={options.Requirement.length === 0}
                />
              )}
              {values.descriptionUseValues && (
                <CardGray
                  label={dataAddRequirement.titleJustification}
                  placeHolder={justificationRequirement}
                  apparencePlaceHolder="gray"
                  size="large"
                  height="108px"
                />
              )}
            </Stack>
          </Form>
        </BaseModal>
      )}
    </Formik>
  );
}
