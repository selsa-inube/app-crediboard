import { Stack, Text, Spinner } from "@inubekit/inubekit";

import { EnumType } from "@hooks/useEnum";

import { loadingAppLabels } from "./config";

interface ILoadingAppUIProps {
  lang: EnumType;
}

function LoadingAppUI(prop: ILoadingAppUIProps) {
  const { lang } = prop;
  
  return (
    <Stack gap="16px" direction="column">
      <Stack direction="column">
        <Text type="title" textAlign="center">
          {loadingAppLabels.title.i18n[lang || "es"]}
        </Text>
        <Text type="title" size="small" textAlign="center">
          {loadingAppLabels.subtitle.i18n[lang || "es"]}
        </Text>
      </Stack>
      <Stack alignItems="center" direction="column">
        <Spinner size="large" />
      </Stack>
    </Stack>
  );
}

export { LoadingAppUI };
