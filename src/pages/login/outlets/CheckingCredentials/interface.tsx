import { Stack, Text, Spinner } from "@inubekit/inubekit";

import { EnumType } from "@hooks/useEnum";

import { checkingCredentialsLabels } from "./config";

interface ICheckingCredentialsUI {
  lang: EnumType
}

function CheckingCredentialsUI({ lang }: ICheckingCredentialsUI) {
  return (
    <Stack gap="16px" direction="column">
      <Stack direction="column">
        <Text type="title" size="large" textAlign="center">
          {checkingCredentialsLabels.title.i18n[lang]}
        </Text>
        <Text type="title" size="small" textAlign="center">
          {checkingCredentialsLabels.subtitle.i18n[lang]}
        </Text>
      </Stack>
      <Stack alignItems="center" direction="column">
        <Spinner size="large" appearance="primary" transparent={false} />
      </Stack>
    </Stack>
  );
}

export { CheckingCredentialsUI };
