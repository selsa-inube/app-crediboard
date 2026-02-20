import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  Stack,
  useMediaQuery,
  Select,
  Textfield,
  Textarea,
  Autosuggest,
} from "@inubekit/inubekit";

import {
  IPatchOfRequirements,
  IRequirementsByBusinessUnit,
} from "@services/requirementsPackages/types";
import { BaseModal } from "@components/modals/baseModal";
import { dataAddRequirementEnum } from "@pages/board/outlets/financialReporting/Requirements/config";
import { useEnum } from "@hooks/useEnum";
import { IAllEnumsResponse } from "@services/enumerators/types";

import { IOptionsSelect } from "../types";

export interface IRequirement {
  optionsRequirement: IOptionsSelect[];
  allRequirements: IRequirementsByBusinessUnit[];
  enums: IAllEnumsResponse;
  creditRequestCode: string;
  title: string;
  setTypeOfRequirementToEvaluated: React.Dispatch<React.SetStateAction<string>>;
  setDescriptionUseValue: React.Dispatch<React.SetStateAction<string>>;
  setRequirementName: React.Dispatch<React.SetStateAction<string>>;
  buttonText: string;
  readOnly?: boolean;
  handleNext?: () => void;
  onSecondaryButtonClick?: () => void;
  secondaryButtonText?: string;
  onChange?: (key: string) => void;
  onSubmit?: (values: { typeOfRequirementToEvaluated: string }) => void;
  onCloseModal?: () => void;
  disabledBack?: boolean;
  setSentData: React.Dispatch<
    React.SetStateAction<IPatchOfRequirements | null>
  >;
}

export function AddRequirement(props: IRequirement) {
  const {
    onSubmit,
    title,
    readOnly,
    buttonText,
    onCloseModal,
    onSecondaryButtonClick,
    optionsRequirement,
    allRequirements,
    enums,
    setTypeOfRequirementToEvaluated,
    setDescriptionUseValue,
    setRequirementName,
    handleNext,
    secondaryButtonText = "Cancelar",
  } = props;

  const { lang } = useEnum();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const [initialValues, setInitialValues] = useState({
    typeOfRequirementToEvaluated: "",
    requirementCatalogName: "",
    descriptionUse: "",
  });

  const getOptionLabel = (options: IOptionsSelect[], value: string) => {
    const option = options?.find(
      (opt) => opt.id === value || opt.value === value,
    );
    return option?.label || option?.value || value;
  };

  const validationSchema = Yup.object().shape({
    typeOfRequirementToEvaluated: Yup.string().required(""),
    requirementCatalogName: Yup.string().required(""),
    descriptionUse: Yup.string().required(""),
  });

  const isButtonDisabled = (
    values: {
      typeOfRequirementToEvaluated: string;
      requirementCatalogName: string;
      descriptionUse: string;
    },
    isSubmitting: boolean,
  ): boolean => {
    return (
      !values.typeOfRequirementToEvaluated ||
      !values.requirementCatalogName ||
      !values.descriptionUse ||
      isSubmitting
    );
  };

  const options = {
    Requirement: optionsRequirement.map((official) => ({
      id: official.id,
      label: official.label,
      value: official.value,
    })),
  };

  const handleRequirementChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);
    setFieldValue("requirementCatalogName", "");
    setFieldValue("descriptionUse", "");
    setDescriptionUseValue("");
    const selectedOption = options.Requirement.find(
      (option) => option.value === value,
    );
    if (selectedOption) {
      setTypeOfRequirementToEvaluated(selectedOption.id);
    }
  };

  useEffect(() => {
    if (options.Requirement.length === 1) {
      const singleOption = options.Requirement[0];
      setInitialValues((prev) => ({
        ...prev,
        typeOfRequirementToEvaluated: singleOption.value,
      }));
      setTypeOfRequirementToEvaluated(singleOption.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.Requirement.length, setTypeOfRequirementToEvaluated]);

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
      {({ isSubmitting, setFieldValue, values }) => {

        const autosuggestOptions = (() => {
          const currentType = options.Requirement.find(
            (opt) => opt.value === values.typeOfRequirementToEvaluated,
          )?.id;

          if (!currentType) return [];

          return allRequirements
            .filter((req) => req.requirementType === currentType)
            .map((req) => {
              const backCode = req.documentCode ?? req.humanValidationCode;
              const enumItem = enums.Requirement?.find(
                (e) => e.code === backCode,
              );
              return {
                id: req.requirementByBusinessUnitId,
                label: enumItem?.i18n?.[lang] ?? req.requirementName,
                value: enumItem?.i18n?.[lang] ?? req.requirementName,
              };
            });
        })();

        return (
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
                    name="typeOfRequirementToEvaluated"
                    id="typeOfRequirementToEvaluated"
                    label={dataAddRequirementEnum.labelPaymentMethod.i18n[lang]}
                    value={getOptionLabel(
                      options.Requirement,
                      values.typeOfRequirementToEvaluated,
                    )}
                    disabled
                    fullwidth
                  />
                ) : (
                  <Select
                    name="typeOfRequirementToEvaluated"
                    id="typeOfRequirementToEvaluated"
                    label={dataAddRequirementEnum.labelPaymentMethod.i18n[lang]}
                    placeholder={
                      options.Requirement.length > 0
                        ? "Selecciona una opción"
                        : "No hay disponibles"
                    }
                    options={options.Requirement}
                    onChange={(name, value) =>
                      handleRequirementChange(name, value, setFieldValue)
                    }
                    value={values.typeOfRequirementToEvaluated}
                    fullwidth
                    disabled={options.Requirement.length === 0}
                  />
                )}
                <Autosuggest
                  key={values.typeOfRequirementToEvaluated}
                  name="requirementCatalogName"
                  id="requirementCatalogName"
                  label={dataAddRequirementEnum.labelName.i18n[lang]}
                  placeholder={
                    dataAddRequirementEnum.placeHolderDate.i18n[lang]
                  }
                  options={autosuggestOptions}
                  value={values.requirementCatalogName}
                  onChange={(name, value) => {
                    setDescriptionUseValue(value);
                    setFieldValue(name, value);
                  }}
                  fullwidth
                  disabled={!values.typeOfRequirementToEvaluated}
                />
                <Textarea
                  id={"descriptionUse"}
                  name={"descriptionUse"}
                  label={dataAddRequirementEnum.labelTextarea.i18n[lang]}
                  placeholder={
                    dataAddRequirementEnum.placeHolderTextarea.i18n[lang]
                  }
                  value={values.descriptionUse}
                  onChange={(event) => {
                    setRequirementName(event.target.value);
                    setFieldValue("descriptionUse", event.target.value);
                  }}
                  fullwidth
                />
              </Stack>
            </Form>
          </BaseModal>
        );
      }}
    </Formik>
  );
}
