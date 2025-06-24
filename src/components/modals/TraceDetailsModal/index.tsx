import { Stack } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { BaseModal } from "@components/modals/baseModal";

import { dataTrace } from "./config";

export interface ITraceDetailsModalProps {
  handleClose: () => void;
  data: { answer: string; observations: string };
  isMobile?: boolean;
}

export function TraceDetailsModal(props: ITraceDetailsModalProps) {
  const { handleClose, data, isMobile } = props;

  return (
    <BaseModal
      title={dataTrace.title}
      nextButton={dataTrace.understood}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "287px" : "402px"}
    >
      <Stack direction="column" gap="16px">
        <CardGray
          label={dataTrace.answer}
          placeHolder={data.answer}
          apparencePlaceHolder="gray"
        />
        <CardGray
          label={dataTrace.observations}
          placeHolder={data.observations}
          apparencePlaceHolder="gray"
          height="108px"
        />
      </Stack>
    </BaseModal>
  );
}
