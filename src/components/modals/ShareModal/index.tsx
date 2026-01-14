import { Stack, Text } from "@inubekit/inubekit";

import { BaseModal } from "../baseModal";
import { shareModalConfigEnum } from "./config";

interface IShareModalProps {
  language: "es" | "en";
  isMobile?: boolean;
  message?: string;
  handleClose?: () => void;
  handleNext?: () => void;
}

export function ShareModal(props: IShareModalProps) {
  const { isMobile, message, handleClose, handleNext, language } = props;

  return (
    <BaseModal
      title={shareModalConfigEnum.title.i18n[language]}
      nextButton={shareModalConfigEnum.buttonText.i18n[language]}
      handleNext={handleNext}
      handleClose={handleClose}
      width={isMobile ? "300px" : "450px"}
    >
      <Stack direction="column" gap="16px" alignItems="center">
        <Text type="body" size="large" weight="bold">
          {shareModalConfigEnum.understood.i18n[language]}
        </Text>
        <Text type="body" size="large" appearance="gray">
          {message}
        </Text>
      </Stack>
    </BaseModal>
  );
}
