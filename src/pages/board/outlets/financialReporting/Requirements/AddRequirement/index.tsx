import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Stack, useMediaQuery, Select } from "@inubekit/inubekit";

import { IPatchOfRequirements, IRequirement } from "@services/types";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";

import { IOptionsSelect } from "../types";
import { dataAddRequirement } from "../config";

export interface IRequirements {
  optionsRequirement: IOptionsSelect[];
  creditRequestCode: string;
  title: string;
  setTypeOfRequirementToEvaluated: React.Dispatch<React.SetStateAction<string>>;
  setDescriptionUseValue: React.Dispatch<React.SetStateAction<string>>;
  setRequirementName: React.Dispatch<React.SetStateAction<string>>;
  buttonText: string;
  rawRequirements?: IRequirement[];
  requirementName?: string;
  descriptionUseValue?: string;
  typeOfRequirementToEvaluated?: string;
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

export function AddRequirement(props: IRequirements) {
  const {
    onSubmit,
    title,
    readOnly,
    buttonText,
    onCloseModal,
    onSecondaryButtonClick,
    optionsRequirement,
    setTypeOfRequirementToEvaluated,
    handleNext,
    secondaryButtonText = "Cancelar",
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const validationSchema = Yup.object().shape({
    typeOfRequirementToEvaluated: Yup.string().required(
      "Este campo es obligatorio"
    ),
  });
  const isButtonDisabled = (
    values: {
      typeOfRequirementToEvaluated: string;
    },
    isSubmitting: boolean
  ): boolean => {
    return !values.typeOfRequirementToEvaluated || isSubmitting;
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
              {values.typeOfRequirementToEvaluated && (
                <CardGray
                  label={dataAddRequirement.titleJustification}
                  placeHolder={dataAddRequirement.descriptionJustification}
                  apparencePlaceHolder="gray"
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
