import { Divider, Text, Stack } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { ModalConfigEnum } from "@pages/prospect/components/modals/ConsolidatedCreditModal/config";

import { StyledContainer, StyledInput } from "./styles";

interface InvestmentCreditCardProps {
  title: string;
  codeValue: string;
  expired: string;
  expiredValue: number;
  lang: "en" | "es";
  isMobile?: boolean;
}

export function InvestmentCreditCard({
  title,
  codeValue,
  expired,
  expiredValue,
  isMobile,
  lang
}: InvestmentCreditCardProps) {
  return (
    <StyledContainer $isMobile={isMobile}>
      <Stack
        direction="column"
        padding={isMobile ? "16px 10px" : "16px 20px"}
        gap="16px"
        width="256px"
      >
        <Text type="label" size="large" weight="bold" appearance="dark">
          {title}
        </Text>
        <Divider dashed />
        <Stack direction="column" gap="8px">
          <StyledInput>
            <Stack alignItems="center" justifyContent="space-between">
              <Text type="label" size="medium" weight="bold">
                {ModalConfigEnum.code.i18n[lang]}
              </Text>
              <Text type="body" size="small" appearance="gray">
                {codeValue}
              </Text>
            </Stack>
          </StyledInput>
          <StyledInput>
            <Stack alignItems="center" justifyContent="space-between">
              <Text type="label" size="medium" weight="bold">
                {expired}
              </Text>
              <Text type="body" size="small" appearance="gray">
                {currencyFormat(expiredValue)}
              </Text>
            </Stack>
          </StyledInput>
        </Stack>
      </Stack>
    </StyledContainer>
  );
}
