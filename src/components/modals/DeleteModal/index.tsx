import { Text, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { useEnum } from "@hooks/useEnum";

import { DeleteDataEnum } from "./config";

export interface IDeleteModalProps {
  TextDelete: string;
  handleClose: () => void;
  handleDelete?: (id?: number, borrowerIdentificationNumber?: string) => void;
  iconBefore?: React.JSX.Element;
  isSendingData?: boolean;
}

export function DeleteModal(props: IDeleteModalProps) {
  const { handleClose, handleDelete = () => {}, TextDelete, isSendingData } = props;

  const isMobile = useMediaQuery("(max-width:880px)");
  const { lang } = useEnum();

  return (
    <BaseModal
      title={DeleteDataEnum.title.i18n[lang]}
      nextButton={DeleteDataEnum.delate.i18n[lang]}
      backButton={DeleteDataEnum.cancel.i18n[lang]}
      handleNext={handleDelete}
      handleClose={handleClose}
      initialDivider={false}
      width={isMobile ? "287px" : "402px"}
      isSendingData={isSendingData}
    >
      <Text>{TextDelete}</Text>
    </BaseModal>
  );
}
