import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Stack,
  useMediaQuery,
  Select,
  Textfield,
  Textarea,
} from "@inubekit/inubekit";

import { IPatchOfRequirements } from "@services/types";
import { BaseModal } from "@components/modals/baseModal";
import { dataAddRequirement } from "@pages/board/outlets/financialReporting/Requirements/config";

import { IOptionsSelect } from "../types";

export interface IRequirement {
  optionsRequirement: IOptionsSelect[];
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
    setTypeOfRequirementToEvaluated,
    setDescriptionUseValue,
    setRequirementName,
    handleNext,
    secondaryButtonText = "Cancelar",
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
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
    isSubmitting: boolean
  ): boolean => {
    return (
      !values.typeOfRequirementToEvaluated ||
      !values.requirementCatalogName ||
      !values.descriptionUse ||
      isSubmitting
    );
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
      setTypeOfRequirementToEvaluated(selectedOption.id);
    }
  };

  const options = {
    Requirement: optionsRequirement.map((official) => ({
      id: official.id,
      label: official.label,
      value: official.value,
    })),
  };

  return (
    <Formik
      initialValues={{
        typeOfRequirementToEvaluated: "",
        requirementCatalogName: "",
        descriptionUse: "",
      }}
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
              <Select
                name="typeOfRequirementToEvaluated"
                id="typeOfRequirementToEvaluated"
                label={dataAddRequirement.labelPaymentMethod}
                placeholder={
                  options.Requirement.length > 0
                    ? "Seleccione una opción"
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
              <Textfield
                name="requirementCatalogName"
                id="requirementCatalogName"
                label={dataAddRequirement.labelName}
                placeholder={dataAddRequirement.placeHolderDate}
                onChange={(e) => {
                  setRequirementName(e.target.value);
                  setFieldValue("requirementCatalogName", e.target.value);
                }}
                value={values.requirementCatalogName}
                size="wide"
                fullwidth
              />
              <Textarea
                id={"descriptionUse"}
                name={"descriptionUse"}
                label={dataAddRequirement.labelTextarea}
                placeholder={dataAddRequirement.placeHolderTextarea}
                value={values.descriptionUse}
                onChange={(e) => {
                  setDescriptionUseValue(e.target.value);
                  setFieldValue("descriptionUse", e.target.value);
                }}
                fullwidth
              />
            </Stack>
          </Form>
        </BaseModal>
      )}
    </Formik>
  );
}
