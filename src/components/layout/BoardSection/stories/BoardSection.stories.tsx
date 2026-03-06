import { BrowserRouter } from "react-router-dom";
import { Meta, StoryObj } from "@storybook/react";

import { BoardSection } from "..";
import { props } from "./props";
import {
  ICreditRequest,
  ICreditRequestPinned,
} from "@services/creditRequest/query/types";

const mockRequests: ICreditRequest[] = [
  {
    creditRequestId: "req-001",
    creditRequestCode: "CR-2024-001",
    creditRequestDateOfCreation: "2024-03-01",
    clientName: "Juan Pérez García",
    clientId: "cli-001",
    clientIdentificationNumber: "1234567890",
    moneyDestinationAbreviatedName: "Vivienda",
    moneyDestinationId: "dest-001",
    loanAmount: 50000000,
    taskToBeDone: "TASK_001",
    unreadNovelties: "Y",
    userWhoPinnnedId: "user-001",
    stage: "GESTION_COMERCIAL",
  },
  {
    creditRequestId: "req-002",
    creditRequestCode: "CR-2024-002",
    creditRequestDateOfCreation: "2024-03-05",
    clientName: "María López Rodríguez",
    clientId: "cli-002",
    clientIdentificationNumber: "0987654321",
    moneyDestinationAbreviatedName: "Vehículo",
    moneyDestinationId: "dest-002",
    loanAmount: 25000000,
    taskToBeDone: "TASK_002",
    unreadNovelties: "N",
    userWhoPinnnedId: "",
    stage: "VERIFICACION_APROBACION",
  },
  {
    creditRequestId: "req-003",
    creditRequestCode: "CR-2024-003",
    creditRequestDateOfCreation: "2024-03-10",
    clientName: "Carlos Martínez Gómez",
    clientId: "cli-003",
    clientIdentificationNumber: "1122334455",
    moneyDestinationAbreviatedName: "Libre inversión",
    moneyDestinationId: "dest-003",
    loanAmount: 10000000,
    taskToBeDone: "TASK_003",
    unreadNovelties: "N",
    userWhoPinnnedId: "",
    stage: "TRAMITE_DESEMBOLSO",
  },
];

const mockPinnedRequests: ICreditRequestPinned[] = [
  {
    creditRequestId: "req-001",
    isPinned: "Y",
  },
];

type Story = StoryObj<typeof BoardSection>;

const boardSection: Meta<typeof BoardSection> = {
  component: BoardSection,
  title: "layouts/BoardSection",
  argTypes: props,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default boardSection;

export const Default: Story = {
  args: {
    sectionTitle: "En estudio",
    sectionBackground: "gray",
    orientation: "vertical",
    sectionInformation: mockRequests,
    pinnedRequests: mockPinnedRequests,
    errorLoadingPins: false,
    searchRequestValue: "",
    sectionCounter: 3,
    sectionId: "section-001",
    positionsAuthorized: ["MANAGER", "SUPERVISOR"],
    hasActiveFilters: false,
    showPinnedOnly: false,
    shouldCollapseAll: false,
    handlePinRequest: (
      requestId: string,
      userWhoPinnedId: string,
      isPinned: string,
    ) => {
      console.log(
        `Pin request: ${requestId}, user: ${userWhoPinnedId}, isPinned: ${isPinned}`,
      );
    },
    handleLoadMoreData: () => {
      console.log("Load more data");
    },
    onOrientationChange: (orientation) => {
      console.log(`Orientation changed to: ${orientation}`);
    },
  },
};

export const Horizontal: Story = {
  args: {
    ...Default.args,
    sectionTitle: "Aprobadas",
    sectionBackground: "light",
    orientation: "horizontal",
    sectionCounter: 3,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    sectionTitle: "Sin solicitudes",
    sectionInformation: [],
    sectionCounter: 0,
    pinnedRequests: [],
  },
};

export const EmptyWithFilters: Story = {
  args: {
    ...Default.args,
    sectionTitle: "Con filtros activos",
    sectionInformation: [],
    sectionCounter: 0,
    pinnedRequests: [],
    hasActiveFilters: true,
  },
};

export const EmptyWithSearch: Story = {
  args: {
    ...Default.args,
    sectionTitle: "Con búsqueda activa",
    sectionInformation: [],
    sectionCounter: 0,
    pinnedRequests: [],
    searchRequestValue: "Carlos",
  },
};

export const PinnedOnly: Story = {
  args: {
    ...Default.args,
    sectionTitle: "Solo fijadas",
    showPinnedOnly: true,
    pinnedRequests: mockPinnedRequests,
  },
};

export const WithErrorLoadingPins: Story = {
  args: {
    ...Default.args,
    sectionTitle: "Error cargando pins",
    errorLoadingPins: true,
  },
};

export const CollapsedAll: Story = {
  args: {
    ...Default.args,
    sectionTitle: "Colapsado",
    shouldCollapseAll: true,
  },
};
