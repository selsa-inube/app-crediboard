import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";

export const titlesPostingvouchersEnum = {
  obligationCode: {
    id: "obligationCode",
    code: "TitlesPostingvouchers_obligationCode",
    description: "Title for obligation code column",
    i18n: {
      en: "Obligation No.",
      es: "No. de Obligación",
    },
    priority: 1,
  },
  documentCode: {
    id: "documentCode",
    code: "TitlesPostingvouchers_documentCode",
    description: "Title for document code column",
    i18n: {
      en: "Document No.",
      es: "No. de Documento",
    },
    priority: 2,
  },
};

export const documentCodeText = {
  id: "documentCodeText",
  code: "TitlesPostingvouchers_documentCodeText",
  description: "Title for document code text column",
  i18n: {
    en: "Document not delivered.",
    es: "El documento no fue entregado.",
  },
};

export const actionsPostingvouchers = [
  {
    id: "ver imagen",
    actionName: "Ver Imagen",
    content: () => (
      <Icon
        appearance="primary"
        size="22px"
        spacing="narrow"
        variant="empty"
        cursorHover
        icon={<MdOutlineRemoveRedEye />}
      />
    ),
  },
];

export const actionMobile = actionsPostingvouchers.map((action) => ({
  id: action.id,
  content: () => <div>{action.content()}</div>,
}));