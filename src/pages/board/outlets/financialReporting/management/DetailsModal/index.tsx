import { Stack, useMediaQuery } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { validationMessages } from "@validations/validationMessages";
import { ITraceType } from "@services/creditRequest/command/types";
import { BaseModal } from "@components/modals/baseModal";
import { useEnum } from "@hooks/useEnum";

import { txtLabelsEnum } from "./config";

export interface DetailsModalProps {
  data: ITraceType;
  portalId?: string;
  handleClose: () => void;
}

export function DetailsModal(props: DetailsModalProps) {
  const { data, portalId = "portal", handleClose } = props;

  const language = useEnum().lang;
  const isMobile = useMediaQuery("(max-width: 700px)");

  const node = document.getElementById(portalId);

  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }

  if (node) {
    node.style.position = "relative";
    node.style.zIndex = "3";
  }

  return (
    <BaseModal
      title={txtLabelsEnum.title.i18n[language]}
      nextButton={txtLabelsEnum.buttonText.i18n[language]}
      width={isMobile ? "287px" : "402px"}
      height={isMobile ? "auto" : "auto"}
      handleNext={handleClose}
      handleClose={handleClose}
    >
      <Stack direction="column" gap="16px">
        <CardGray
          label={txtLabelsEnum.userLabel.i18n[language]}
          placeHolder={data.userName}
          apparencePlaceHolder="gray"
        />
        <CardGray
          label={txtLabelsEnum.justificationLabel.i18n[language]}
          placeHolder={
            data.traceType === "Executed_task"
              ? data.justification
              : data.traceValue
          }
          apparencePlaceHolder="gray"
        />
      </Stack>
    </BaseModal>
  );
}
