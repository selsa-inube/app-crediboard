import { Stack, Text } from "@inubekit/inubekit";

import { BaseModal } from "../baseModal";
import { shareModalConfigEnum } from "./config";

interface IShareModalProps {
  lang: "es" | "en";
  isMobile?: boolean;
  message?: string;
  handleClose?: () => void;
  handleNext?: () => void;
}

export function ShareModal(props: IShareModalProps) {
  const { isMobile, message, handleClose, handleNext, lang } = props;

  return (
    <BaseModal
      title={shareModalConfigEnum.title.i18n[lang]}
      nextButton={shareModalConfigEnum.buttonText.i18n[lang]}
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "300px" : "450px"}
    >
      <Stack direction="column" gap="16px" alignItems="center">
        <Text type="body" size="large" weight="bold">
          {shareModalConfigEnum.understood.i18n[lang]}
        </Text>
        <Text type="body" size="large" appearance="gray">
          {message}
        </Text>
      </Stack>
    </BaseModal>
  );
}
