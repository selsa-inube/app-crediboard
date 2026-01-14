import { MdOutlineShare, MdOutlineRemoveRedEye } from "react-icons/md";
import { Icon, Stack } from "@inubekit/inubekit";

import { IEntries } from "@components/data/TableBoard/types";
import check from "@assets/images/check.svg";
import close from "@assets/images/close.svg";
import remove from "@assets/images/remove.svg";

const entrySelection = (data: IEntries) => {
  console.log(data);
};

export const titlesFinancialReportingEnum = {
  obligationCode: {
    id: "obligationCode",
    code: "TitlesFinancialReporting_obligationCode",
    description: "Title for obligation number column",
    i18n: { en: "Obligation No.", es: "No. de Obligación" },
    priority: 1,
  },
  documentCode: {
    id: "documentCode",
    code: "TitlesFinancialReporting_documentCode",
    description: "Title for document number column",
    i18n: { en: "Document No.", es: "No. de Documento" },
    priority: 2,
  },
  type: {
    id: "type",
    code: "TitlesFinancialReporting_type",
    description: "Title for type column",
    i18n: { en: "Type", es: "Tipo" },
    priority: 3,
  },
  status: {
    id: "tag",
    code: "TitlesFinancialReporting_status",
    description: "Title for status column",
    i18n: { en: "Status", es: "Estado" },
    priority: 4,
  },
};

export const statusFinancialReportingEnum = {
  signed: {
    value: "Firmado",
    i18n: { en: "Signed", es: "Firmado" },
  },
  inProcess: {
    value: "En tramite",
    i18n: { en: "In Process", es: "En tramite" },
  },
  withError: {
    value: "Con error",
    i18n: { en: "With Error", es: "Con error" },
  },
};

export const actionsFinancialReportingEnum = {
  resend: {
    id: "resend",
    i18n: { en: "Resend", es: "Reenviar" },
  },
  viewImage: {
    id: "viewImage",
    i18n: { en: "View Image", es: "Ver Imagen" },
  },
};

export const getTitlesFinancialReporting = (language: "es" | "en") =>
  Object.values(titlesFinancialReportingEnum).map(item => ({
    id: item.id,
    titleName: item.i18n[language],
    priority: item.priority
  }));

export const appearanceTag = (tag: string): "success" | "warning" | "danger" => {
  if (tag === statusFinancialReportingEnum.signed.value) return "success";
  if (tag === statusFinancialReportingEnum.inProcess.value) return "warning";
  return "danger";
};

export const getTableBoardActions = (
  entrySelection: (data: IEntries) => void,
  language: "es" | "en"
) => [
    {
      id: actionsFinancialReportingEnum.resend.id,
      actionName: actionsFinancialReportingEnum.resend.i18n[language],
      content: (data: IEntries) => (
        <Icon
          appearance="primary"
          cursorHover
          size="22px"
          icon={<MdOutlineShare />}
          onClick={() => entrySelection(data)}
        />
      ),
    },
    {
      id: actionsFinancialReportingEnum.viewImage.id,
      actionName: actionsFinancialReportingEnum.viewImage.i18n[language],
      content: (data: IEntries) => (
        <Icon
          appearance="primary"
          size="22px"
          icon={<MdOutlineRemoveRedEye />}
          onClick={() => entrySelection(data)}
        />
      ),
    },
  ];

const getIconByTagStatus = (tagElement: React.ReactElement, language: "es" | "en") => {
  const label = tagElement.props.label;

  if (label === statusFinancialReportingEnum.signed.value) {
    return <img src={check} alt={statusFinancialReportingEnum.signed.i18n[language]} width={14} height={14} />;
  } else if (label === statusFinancialReportingEnum.inProcess.value) {
    return <img src={remove} alt={statusFinancialReportingEnum.inProcess.i18n[language]} width={14} height={14} />;
  } else if (label === statusFinancialReportingEnum.withError.value) {
    return <img src={close} alt={statusFinancialReportingEnum.withError.i18n[language]} width={14} height={14} />;
  }
  return null;
};

export const getActionsMobileIcon = (language: "es" | "en") => [
  {
    id: "status_icon",
    actionName: "",
    content: (entry: IEntries) => {
      const tagElement = entry.tag as React.ReactElement;
      return (
        <Stack>
          <Icon
            icon={getIconByTagStatus(tagElement, language)}
            appearance={tagElement.props.appearance}
            size="20px"
          />
        </Stack>
      );
    },
  },
];


export const actionsFinanacialReporting = [
  {
    id: "Reenviar",
    actionName: "Reenviar",
    content: (data: IEntries) => (
      <Icon
        appearance="primary"
        cursorHover
        size="22px"
        variant="empty"
        icon={<MdOutlineShare />}
        onClick={() => entrySelection(data)}
        spacing="narrow"
      />
    ),
  },
  {
    id: "ver imagen",
    actionName: "Ver Imagen",
    content: (data: IEntries) => (
      <Icon
        appearance="primary"
        size="22px"
        spacing="narrow"
        variant="empty"
        cursorHover
        icon={<MdOutlineRemoveRedEye />}
        onClick={() => entrySelection(data)}
      />
    ),
  },
];

export const infoItems = [
  { icon: <MdOutlineShare />, text: "Reenviar", appearance: "primary" },
  {
    icon: <MdOutlineRemoveRedEye />,
    text: "Ver Imagen",
    appearance: "primary",
  },
];

export const actionMobile = [
  {
    id: "Reenviar",
    actionName: "Reenviar",
    content: (data: IEntries) => (
      <Icon
        appearance="primary"
        size="22px"
        spacing="narrow"
        cursorHover
        icon={<MdOutlineShare />}
        onClick={() => entrySelection(data)}
      />
    ),
  },
  {
    id: "ver imagen",
    actionName: "Ver Imagen",
    content: (data: IEntries) => (
      <Icon
        appearance="primary"
        size="22px"
        spacing="narrow"
        cursorHover
        icon={<MdOutlineRemoveRedEye />}
        onClick={() => entrySelection(data)}
      />
    ),
  },
];

export const firstWord = (text: string) => text.split(" ")[0];

export const getTableBoardActionMobile = (
  entrySelection: (data: IEntries) => void
) =>
  actionMobile.map((action) => ({
    id: action.id,
    actionName: action.actionName,
    label: "Mobile Action Label",
    content: (data: IEntries) => (
      <Icon
        {...action.content(data).props}
        onClick={() => {
          if (action.id === "Reenviar") {
            entrySelection(data);
          }
        }}
      />
    ),
  }));
