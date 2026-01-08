import { isValidElement } from "react";
import {
  MdAddCircleOutline,
  MdCheck,
  MdClose,
  MdOutlineCheckCircle,
  MdOutlineHowToReg,
  MdOutlineRemoveRedEye,
  MdRemove,
} from "react-icons/md";
import { Stack, Icon, Tag } from "@inubekit/inubekit";

import check from "@assets/images/check.svg";
import close from "@assets/images/close.svg";
import remove from "@assets/images/remove.svg";
import { IEntries } from "@components/data/TableBoard/types";
import { requirementStatus } from "@services/enum/irequirements/requirementstatus/requirementstatus";

import { MappedRequirements } from "./types";

export const dataButton = (
  onClick: () => void,
  onClickSistemValidation: () => void
) => ({
  title: "Agregar validación humana",
  titleSistemValidation: "Agregar validación del sistema",
  onClick,
  onClickSistemValidation,
});

const receiveData = (data: IEntries) => {
  console.log(data, "function que recibe data");
};

export const titlesRequirements = [
  [
    {
      id: "Validaciones del sistema",
      titleName: "Validaciones del sistema",
      priority: 1,
    },
    {
      id: "tag",
      titleName: "",
      priority: 2,
    },
  ],
  [
    {
      id: "Requisitos documentales",
      titleName: "Requisitos documentales",
      priority: 1,
    },
    {
      id: "tag",
      titleName: "",
      priority: 2,
    },
  ],
  [
    {
      id: "Validaciones humanas",
      titleName: "Validaciones humanas",
      priority: 1,
    },
    {
      id: "tag",
      titleName: "",
      priority: 2,
    },
  ],
];
export const textFlagsRequirements = {
  titleSuccess: "Cambios guardados con éxito!",
  descriptionSuccess: `Hemos creado el campo exitosamente.`,
  titleError: "¡Uy, algo ha salido mal!",
  descriptionError: "No se han podido guardar los cambios.",
};

export const dataAddRequirement = {
  title: "Agregar requisito a esta solicitud",
  titleJustification: "Descripción del requisito",
  descriptionJustification:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit, primis turpis a donec dictum ad, urna eu sem malesuada mauris ac.",
  close: "Cerrar",
  cancel: "Cancelar",
  add: "Agregar",
  labelPaymentMethod: "Tipo de requisito",
  labelName: "Nombre del requisito",
  labelAmount: "Cantidad",
  labelValue: "Valor",
  labelTextarea: "Descripción",
  labelJustification: "Justificacion",
  labelFrequency: "Frecuencia de pago",
  labelDate: "Primer pago",
  placeHolderSelect: "Selecciona una opción",
  placeHolderAmount: "Número de pagos",
  placeHolderValue: "Valor a pagar",
  placeHolderDate: "Seleccione un requisito",
  placeHolderTextarea: "¿Qué hace necesario incluir este requisito?",
  placeHolderJustification: "Justificación del requisito",
};

export const justificationDescriptions: Record<string, string> = {
  edad: "Se valida la edad mínima para el requisito",
  antiguedad: "Se valida la antigüedad mínima para el requisito",
};

export const titlesRequirementsEnum = {
  validacionesDelSistema: {
    code: "TitlesRequirements_validacionesDelSistema",
    description: "Column titles for system validations",
    columns: [
      {
        code: "TitlesRequirements_validacionesDelSistema_main",
        description: "Main title for system validations",
        i18n: {
          en: "System Validations",
          es: "Validaciones del sistema",
        },
        priority: 1,
      },
      {
        code: "TitlesRequirements_validacionesDelSistema_tag",
        description: "Tag column for system validations",
        i18n: {
          en: "Status",
          es: "",
        },
        priority: 2,
      },
    ],
  },
  requisitosDocumentales: {
    code: "TitlesRequirements_requisitosDocumentales",
    description: "Column titles for documentary requirements",
    columns: [
      {
        code: "TitlesRequirements_requisitosDocumentales_main",
        description: "Main title for documentary requirements",
        i18n: {
          en: "Documentary Requirements",
          es: "Requisitos documentales",
        },
        priority: 1,
      },
      {
        code: "TitlesRequirements_requisitosDocumentales_tag",
        description: "Tag column for documentary requirements",
        i18n: {
          en: "Status",
          es: "",
        },
        priority: 2,
      },
    ],
  },
  validacionesHumanas: {
    code: "TitlesRequirements_validacionesHumanas",
    description: "Column titles for human validations",
    columns: [
      {
        code: "TitlesRequirements_validacionesHumanas_main",
        description: "Main title for human validations",
        i18n: {
          en: "Human Validations",
          es: "Validaciones humanas",
        },
        priority: 1,
      },
      {
        code: "TitlesRequirements_validacionesHumanas_tag",
        description: "Tag column for human validations",
        i18n: {
          en: "Status",
          es: "",
        },
        priority: 2,
      },
    ],
  },
};

export const textFlagsRequirementsEnum = {
  titleSuccess: {
    code: "TextFlagsRequirements_titleSuccess",
    description: "Title for success message",
    i18n: {
      en: "Changes saved successfully!",
      es: "Cambios guardados con éxito!",
    },
  },
  descriptionSuccess: {
    code: "TextFlagsRequirements_descriptionSuccess",
    description: "Description for success message",
    i18n: {
      en: "The field has been created successfully.",
      es: "Hemos creado el campo exitosamente.",
    },
  },
  titleError: {
    code: "TextFlagsRequirements_titleError",
    description: "Title for error message",
    i18n: {
      en: "Oops, something went wrong!",
      es: "¡Uy, algo ha salido mal!",
    },
  },
  descriptionError: {
    code: "TextFlagsRequirements_descriptionError",
    description: "Description for error message",
    i18n: {
      en: "Changes could not be saved.",
      es: "No se han podido guardar los cambios.",
    },
  },
};

export const dataAddRequirementEnum = {
  title: {
    code: "DataAddRequirement_title",
    description: "Modal title for adding a requirement",
    i18n: {
      en: "Add requirement to this request",
      es: "Agregar requisito a esta solicitud",
    },
  },
  titleJustification: {
    code: "DataAddRequirement_titleJustification",
    description: "Title for requirement justification",
    i18n: {
      en: "Requirement Description",
      es: "Descripción del requisito",
    },
  },
  descriptionJustification: {
    code: "DataAddRequirement_descriptionJustification",
    description: "Description text for requirement justification",
    i18n: {
      en: "Lorem ipsum dolor sit amet consectetur adipiscing elit, primis turpis a donec dictum ad, urna eu sem malesuada mauris ac.",
      es: "Lorem ipsum dolor sit amet consectetur adipiscing elit, primis turpis a donec dictum ad, urna eu sem malesuada mauris ac.",
    },
  },
  close: {
    code: "DataAddRequirement_close",
    description: "Label for close button",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  cancel: {
    code: "DataAddRequirement_cancel",
    description: "Label for cancel button",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  add: {
    code: "DataAddRequirement_add",
    description: "Label for add button",
    i18n: {
      en: "Add",
      es: "Agregar",
    },
  },
  labelPaymentMethod: {
    code: "DataAddRequirement_labelPaymentMethod",
    description: "Label for requirement type",
    i18n: {
      en: "Requirement Type",
      es: "Tipo de requisito",
    },
  },
  labelName: {
    code: "DataAddRequirement_labelName",
    description: "Label for requirement name",
    i18n: {
      en: "Requirement Name",
      es: "Nombre del requisito",
    },
  },
  labelAmount: {
    code: "DataAddRequirement_labelAmount",
    description: "Label for amount",
    i18n: {
      en: "Amount",
      es: "Cantidad",
    },
  },
  labelValue: {
    code: "DataAddRequirement_labelValue",
    description: "Label for value",
    i18n: {
      en: "Value",
      es: "Valor",
    },
  },
  labelTextarea: {
    code: "DataAddRequirement_labelTextarea",
    description: "Label for textarea description",
    i18n: {
      en: "Description",
      es: "Descripción",
    },
  },
  labelJustification: {
    code: "DataAddRequirement_labelJustification",
    description: "Label for justification",
    i18n: {
      en: "Justification",
      es: "Justificacion",
    },
  },
  labelFrequency: {
    code: "DataAddRequirement_labelFrequency",
    description: "Label for payment frequency",
    i18n: {
      en: "Payment Frequency",
      es: "Frecuencia de pago",
    },
  },
  labelDate: {
    code: "DataAddRequirement_labelDate",
    description: "Label for first payment date",
    i18n: {
      en: "First Payment",
      es: "Primer pago",
    },
  },
  placeHolderSelect: {
    code: "DataAddRequirement_placeHolderSelect",
    description: "Placeholder for select inputs",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },
  placeHolderAmount: {
    code: "DataAddRequirement_placeHolderAmount",
    description: "Placeholder for number of payments",
    i18n: {
      en: "Number of payments",
      es: "Número de pagos",
    },
  },
  placeHolderValue: {
    code: "DataAddRequirement_placeHolderValue",
    description: "Placeholder for value to pay",
    i18n: {
      en: "Value to pay",
      es: "Valor a pagar",
    },
  },
  placeHolderDate: {
    code: "DataAddRequirement_placeHolderDate",
    description: "Placeholder for selecting a requirement date",
    i18n: {
      en: "Select a requirement",
      es: "Seleccione un requisito",
    },
  },
  placeHolderTextarea: {
    code: "DataAddRequirement_placeHolderTextarea",
    description: "Placeholder for describing necessity of requirement",
    i18n: {
      en: "Why is it necessary to include this requirement?",
      es: "¿Qué hace necesario incluir este requisito?",
    },
  },
  placeHolderJustification: {
    code: "DataAddRequirement_placeHolderJustification",
    description: "Placeholder for requirement justification",
    i18n: {
      en: "Requirement justification",
      es: "Justificación del requisito",
    },
  },
};

export const justificationDescriptionsEnum = {
  edad: {
    code: "JustificationDescriptions_edad",
    description: "Justification for age requirement",
    i18n: {
      en: "Minimum age for the requirement is validated",
      es: "Se valida la edad mínima para el requisito",
    },
  },
  antiguedad: {
    code: "JustificationDescriptions_antiguedad",
    description: "Justification for seniority requirement",
    i18n: {
      en: "Minimum seniority for the requirement is validated",
      es: "Se valida la antigüedad mínima para el requisito",
    },
  },
};

export const infoItems = [
  { icon: <MdOutlineRemoveRedEye />, text: "Ver Detalles", appearance: "help" },
  {
    icon: <MdOutlineHowToReg />,
    text: "Forzar Aprobación",
    appearance: "help",
  },
];
export const questionToBeAskedInModalText = {
  notEvaluated: "Sin Evaluar",
  notCompliant: "No Cumple",
  questionForUnvalidated: "Pudo evaluar?",
  questionForNotCompliant: "Cumple?",
};
export const actionsRequirements = [
  [
    {
      id: "agregar",
      content: (data: IEntries) => (
        <Stack justifyContent="center">
          <Icon
            icon={<MdAddCircleOutline />}
            appearance="primary"
            onClick={() => receiveData(data)}
            spacing="narrow"
            size="22px"
            cursorHover
          />
        </Stack>
      ),
    },
    {
      id: "aprobar",
      content: (data: IEntries) => (
        <Stack justifyContent="center">
          <Icon
            icon={<MdOutlineCheckCircle />}
            appearance="primary"
            spacing="narrow"
            cursorHover
            size="22px"
            onClick={() => receiveData(data)}
            disabled={
              isValidElement(data?.tag) &&
              data?.tag?.props?.label === "No Cumple"
            }
          />
        </Stack>
      ),
    },
  ],
];

const iconActionsMobile = (tag: string) => {
  if (tag === "Cumple") {
    return <MdCheck />;
  } else if (tag === "Sin Evaluar") {
    return <MdRemove />;
  } else {
    return <MdClose />;
  }
};

interface TagProps {
  appearance?: string;
  label?: string;
}

interface TagElement {
  props: TagProps;
}

const isValidTagElement = (element: unknown): element is TagElement => {
  return isValidElement(element) && element.props !== undefined;
};

const actionsMobile = [
  {
    id: "tags",
    actionName: "",
    content: (data: IEntries) => (
      <Icon
        icon={
          isValidElement(data?.tag) &&
          iconActionsMobile(data?.tag?.props?.label)
        }
        appearance={
          isValidTagElement(data?.tag)
            ? data?.tag?.props?.appearance
            : undefined
        }
        cursorHover
        variant="filled"
        shape="circle"
        size="16px"
      />
    ),
  },
  {
    id: "agregar",
    content: (data: IEntries) => (
      <Stack justifyContent="center">
        <Icon
          icon={<MdAddCircleOutline />}
          appearance="primary"
          onClick={() => receiveData(data)}
          spacing="narrow"
          variant="empty"
          size="22px"
          cursorHover
        />
      </Stack>
    ),
  },
  {
    id: "aprobar",
    content: (data: IEntries) => (
      <Stack justifyContent="center">
        <Icon
          icon={<MdOutlineCheckCircle />}
          appearance="primary"
          spacing="narrow"
          variant="empty"
          cursorHover
          size="22px"
          onClick={() => receiveData(data)}
          disabled={
            isValidElement(data?.tag) && data?.tag?.props?.label === "No Cumple"
          }
        />
      </Stack>
    ),
  },
];

const getRequirementCode = (codeKey: string) => {
  return requirementStatus.find((item) => item.Code === codeKey)?.Code || "";
};

const generateTag = (value: string): JSX.Element => {
  if (
    value === getRequirementCode("PASSED_WITH_SYSTEM_VALIDATION") ||
    value === getRequirementCode("DOCUMENT_STORED_WITHOUT_VALIDATION") ||
    value === getRequirementCode("PASSED_WITH_HUMAN_VALIDATION") ||
    value === getRequirementCode("DOCUMENT_VALIDATED_BY_THE_USER") ||
    value === getRequirementCode("IGNORED_BY_THE_USER") ||
    value === getRequirementCode("PASSED_HUMAN_VALIDATION") ||
    value === getRequirementCode("DOCUMENT_STORED_AND_VALIDATED") ||
    value === getRequirementCode("IGNORED_BY_THE_USER_HUMAN_VALIDATION") ||
    value === getRequirementCode("DOCUMENT_IGNORED_BY_THE_USER")
  ) {
    return <Tag label="Cumple" appearance="success" />;
  } else if (
    value === getRequirementCode("FAILED_SYSTEM_VALIDATION") ||
    value === getRequirementCode("IGNORED_BY_THE_USER_SYSTEM_VALIDATION") ||
    value === getRequirementCode("FAILED_DOCUMENT_VALIDATION") ||
    value === getRequirementCode("FAILED_HUMAN_VALIDATION")
  ) {
    return <Tag label="No Cumple" appearance="danger" />;
  } else {
    return <Tag label="Sin Evaluar" appearance="warning" />;
  }
};

export const maperEntries = (data: MappedRequirements): IEntries[][] => {
  const result: IEntries[][] = [];

  const systemValidations: IEntries[] = Object.entries(
    data.SYSTEM_VALIDATION
  ).map(([key, value], index) => ({
    id: `sistema-${index + 1}`,
    "Validaciones del sistema": key,
    tag: generateTag(value),
  }));

  const documentaryRequirements: IEntries[] = Object.entries(data.DOCUMENT).map(
    ([key, value], index) => ({
      id: `documento-${index + 1}`,
      "Requisitos documentales": key,
      tag: generateTag(value),
    })
  );

  const humanValidations: IEntries[] = Object.entries(
    data.HUMAN_VALIDATION
  ).map(([key, value], index) => ({
    id: `humano-${index + 1}`,
    "Validaciones humanas": key,
    tag: generateTag(value),
  }));

  result.push(systemValidations, documentaryRequirements, humanValidations);

  return result;
};

export const maperDataRequirements = (processedEntries: IEntries[][]) => {
  return [
    {
      id: "tableApprovalSystem",
      titlesRequirements: titlesRequirements[0],
      entriesRequirements: processedEntries[0],
      actionsMovile: actionsMobile,
    },
    {
      id: "tableDocumentValues",
      titlesRequirements: titlesRequirements[1],
      entriesRequirements: processedEntries[1],
      actionsMovile: actionsMobile,
    },
    {
      id: "tableApprovalHuman",
      titlesRequirements: titlesRequirements[2],
      entriesRequirements: processedEntries[2],
      actionsMovile: actionsMobile,
    },
  ];
};

const getIconByTagStatus = (tagElement: React.ReactElement) => {
  const label = tagElement.props.label;

  if (label === "Cumple") {
    return <img src={check} alt="Cumple" width={14} height={14} />;
  } else if (label === "Sin Evaluar") {
    return <img src={remove} alt="Sin Evaluar" width={14} height={14} />;
  } else if (label === "No Cumple") {
    return <img src={close} alt="No Cumple" width={14} height={14} />;
  } else {
    return null;
  }
};

export const getActionsMobileIcon = () => {
  return [
    {
      id: "estado",
      actionName: "",
      content: (entry: IEntries) => {
        const tagElement = entry.tag as React.ReactElement;
        return (
          <Stack>
            <Icon
              icon={getIconByTagStatus(tagElement)}
              appearance={tagElement.props.appearance}
              cursorHover
              size="20px"
            />
          </Stack>
        );
      },
    },
  ];
};
