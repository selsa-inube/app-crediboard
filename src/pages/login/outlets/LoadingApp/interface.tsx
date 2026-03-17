import { Stack, Text, Spinner, Header } from "@inubekit/inubekit";

import { EnumType } from "@hooks/useEnum";

import { loadingAppLabels } from "./config";
import {
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledHeader,
} from "./styles";

interface ILoadingAppUIProps {
  lang: EnumType;
}

function LoadingAppUI(prop: ILoadingAppUIProps) {
  const { lang } = prop;

  return (
    <Stack justifyContent="center">
      <StyledContainer>
        <StyledHeader>
          <Header menu={[]}></Header>
        </StyledHeader>

        <StyledContent>
          <Text type="title" textAlign="center">
            {loadingAppLabels.title.i18n[lang || "es"]}
          </Text>
          <Text type="title" size="small" textAlign="center">
            {loadingAppLabels.subtitle.i18n[lang || "es"]}
          </Text>

          <Stack alignItems="center" direction="column">
            <Spinner size="large" />
          </Stack>
        </StyledContent>
        <StyledFooter></StyledFooter>
      </StyledContainer>
    </Stack>
  );
}

export { LoadingAppUI };
