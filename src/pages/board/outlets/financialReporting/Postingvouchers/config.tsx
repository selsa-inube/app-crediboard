import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";

import { IEntries } from "@components/data/TableBoard/types";

const entrySelection = (data: IEntries) => {
  console.log(data);
};

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

export const actionMobile = actionsPostingvouchers.map((action) => ({
  id: action.id,
  content: (data: IEntries) => (
    <div onClick={() => entrySelection(data)}>{action.content(data)}</div>
  ),
}));
