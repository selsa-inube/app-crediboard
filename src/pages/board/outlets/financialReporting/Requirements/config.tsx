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
import { CreditRequest } from "@services/types";

export const dataButton = (onClick: () => void) => ({
  title: "Agregar Requisito",
  onClick,
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
  title: "Agregar Requisito",
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
  placeHolderSelect: "Seleccione una opción",
  placeHolderAmount: "Número de pagos",
  placeHolderValue: "Valor a pagar",
  placeHolderDate: "Seleccione un requisito",
  placeHolderTextarea: "Descripción del requisito",
  placeHolderJustification: "Justificación del requisito",
};

export const infoItems = [
  { icon: <MdOutlineRemoveRedEye />, text: "Ver Detalles", appearance: "help" },
  {
    icon: <MdOutlineHowToReg />,
    text: "Forzar Aprobación",
    appearance: "help",
  },
];

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

export const getAcctionMobile = (
  showModalAdd: (state: boolean) => void,
  showAprovalsModal: (state: boolean) => void
) => {
  const actionsMobile = [
    {
      id: "agregar",
      content: () => (
        <Stack justifyContent="center">
          <Icon
            icon={<MdOutlineRemoveRedEye />}
            appearance="primary"
            onClick={() => showModalAdd(true)}
            spacing="narrow"
            size="20px"
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
            icon={<MdOutlineHowToReg />}
            appearance="primary"
            spacing="narrow"
            cursorHover
            size="20px"
            onClick={() => showAprovalsModal(true)}
            disabled={
              isValidElement(data?.tag) &&
              data?.tag?.props?.label === "No Cumple"
            }
          />
        </Stack>
      ),
    },
  ];
  return actionsMobile;
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

const generateTag = (value: string): JSX.Element => {
  if (
    value === "PASSED_WITH_SYSTEM_VALIDATION" ||
    value === "DOCUMENT_STORED_WITHOUT_VALIDATION" ||
    value === "PASSED_WITH_HUMAN_VALIDATION" ||
    value === "DOCUMENT_VALIDATED_BY_THE_USER" ||
    value === "IGNORED_BY_THE_USER"
  ) {
    return <Tag label="Cumple" appearance="success" />;
  } else if (value === "FAILED_SYSTEM_VALIDATION") {
    return <Tag label="No Cumple" appearance="danger" />;
  } else {
    return <Tag label="Sin Evaluar" appearance="warning" />;
  }
};

export const maperEntries = (data: CreditRequest): IEntries[][] => {
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
      id: "tabla1",
      titlesRequirements: titlesRequirements[0],
      entriesRequirements: processedEntries[0],
      actionsMovile: actionsMobile,
    },
    {
      id: "tabla2",
      titlesRequirements: titlesRequirements[1],
      entriesRequirements: processedEntries[1],
      actionsMovile: actionsMobile,
    },
    {
      id: "tabla3",
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

export const dataFlags = {
  requirements: {
    title: "Error al cargar requisitos",
    description: "No se encontraron requisitos disponibles.",
  },
  documentApproved: {
    title: "Éxito",
    description: "Documentación aprobada correctamente.",
  },
  documentRejected: {
    title: "Error",
    description: "Ocurrió un error al aprobar el documento.",
  },
};
