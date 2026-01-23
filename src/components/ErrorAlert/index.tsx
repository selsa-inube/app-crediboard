import { MdWarningAmber, MdClear } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { EnumType } from "@hooks/useEnum";

import { AlertContainer, StyledPrint } from "./styles";
import { messagesEnum } from "./config";

export interface ErrorAlertProps {
  lang: EnumType;
  message?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

const ErrorAlert = (props: ErrorAlertProps) => {
  const { message, onClose, isMobile, lang } = props;

  return (
    <StyledPrint>
      <AlertContainer $isMobile={isMobile}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          gap="20px"
          width="100%"
        >
          <Icon appearance="warning" icon={<MdWarningAmber />} size="24px" />
          <Stack justifyContent="center">
            <Text>{message || messagesEnum.defaultError.i18n[lang]}</Text>
          </Stack>

          <Icon
            appearance="dark"
            icon={<MdClear />}
            size="16px"
            cursorHover
            onClick={onClose}
          />
        </Stack>
      </AlertContainer>
    </StyledPrint>
  );
};

export { ErrorAlert };
