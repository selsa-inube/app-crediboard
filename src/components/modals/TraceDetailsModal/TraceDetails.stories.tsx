import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { TraceDetailsModal, ITraceDetailsModalProps } from ".";

const traceDetailsMock: ITraceDetailsModalProps["data"][] = [
  {
    answer: "Aprobado",
    observations:
      "El solicitante cumple con todos los requisitos establecidos para la aprobación del crédito. Se verificaron los documentos adjuntos y no se encontraron inconsistencias.",
    documents: [
      {
        documentId: "doc-001",
        abbreviatedName: "Cédula de ciudadanía",
        creditRequestId: "cr-001",
        documentManagmentReference: "ref-001",
        fileName: "cedula_ciudadania.pdf",
      },
      {
        documentId: "doc-002",
        abbreviatedName: "Comprobante de ingresos",
        creditRequestId: "cr-001",
        documentManagmentReference: "ref-002",
        fileName: "comprobante_ingresos.pdf",
      },
      {
        documentId: "doc-003",
        abbreviatedName: "Extractos bancarios",
        creditRequestId: "cr-001",
        documentManagmentReference: "ref-003",
        fileName: "extractos_bancarios.pdf",
      },
    ],
  },
  {
    answer: "Rechazado",
    observations:
      "El solicitante no cumple con el puntaje mínimo requerido en el análisis de riesgo crediticio.",
    documents: [],
  },
  {
    answer: "Pendiente",
    observations:
      "Se requiere documentación adicional para continuar el proceso.",
  },
];

const meta: Meta<typeof TraceDetailsModal> = {
  title: "components/modals/traceDetailsModal",
  component: TraceDetailsModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Modal que muestra el detalle de una traza, incluyendo documentos adjuntos, respuesta y observaciones.",
      },
    },
  },
  argTypes: {
    isMobile: {
      control: "boolean",
      description: "Adapta el modal para visualización en dispositivos móviles",
    },
    data: {
      control: "object",
      description: "Datos del detalle de la traza",
    },
    businessUnitPublicCode: {
      control: "text",
      description: "Código público de la unidad de negocio",
    },
    businessManagerCode: {
      control: "text",
      description: "Código del gestor de negocio",
    },
    user: {
      control: "text",
      description: "Usuario actual",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TraceDetailsModal>;

export const Default: Story = (args: ITraceDetailsModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Trace Details</Button>
      {showModal && (
        <TraceDetailsModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Default.args = {
  isMobile: false,
  data: traceDetailsMock[0],
  businessUnitPublicCode: "BU-001",
  businessManagerCode: "BM-001",
  user: "john.doe",
};

Default.storyName = "Con documentos";

export const Rejected: Story = (args: ITraceDetailsModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Trace Details</Button>
      {showModal && (
        <TraceDetailsModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Rejected.args = {
  isMobile: false,
  data: traceDetailsMock[1],
  businessUnitPublicCode: "BU-001",
  businessManagerCode: "BM-001",
  user: "john.doe",
};

Rejected.storyName = "Sin documentos";

export const Pending: Story = (args: ITraceDetailsModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Trace Details</Button>
      {showModal && (
        <TraceDetailsModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Pending.args = {
  isMobile: false,
  data: traceDetailsMock[2],
  businessUnitPublicCode: "BU-001",
  businessManagerCode: "BM-001",
  user: "john.doe",
};

Pending.storyName = "Sin sección de documentos";

export const Mobile: Story = (args: ITraceDetailsModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Trace Details</Button>
      {showModal && (
        <TraceDetailsModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Mobile.args = {
  isMobile: true,
  data: traceDetailsMock[0],
  businessUnitPublicCode: "BU-001",
  businessManagerCode: "BM-001",
  user: "john.doe",
};

Mobile.storyName = "Móvil";
