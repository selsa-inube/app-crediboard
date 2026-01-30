import { Icon, Stack, Text } from "@inubekit/inubekit";
import { MdClear } from "react-icons/md";

import { useEnum } from "@hooks/useEnum";

import { BaseModal } from "../baseModal";
import { errorModalConfigEnum } from "./config";

interface IErrorModalProps {
  isMobile?: boolean;
  message?: string;
  handleClose?: () => void;
}

export function ErrorModal(props: IErrorModalProps) {
  const { isMobile, message, handleClose } = props;

  const { lang } = useEnum();

  return (
    <BaseModal
      title={errorModalConfigEnum.title.i18n[lang]}
      nextButton={errorModalConfigEnum.understood.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "100%" : "450px"}
    >
      <Stack direction="column" gap="16px" alignItems="center">
        <Icon
          icon={<MdClear />}
          appearance="danger"
          variant="filled"
          shape="circle"
          spacing="compact"
          size="68px"
        />
        <Text type="body" size="large" weight="bold">
          {errorModalConfigEnum.excuses.i18n[lang]}
        </Text>
        <Text type="body" size="large" appearance="gray">
          {message}
        </Text>
      </Stack>
    </BaseModal>
  );
}
