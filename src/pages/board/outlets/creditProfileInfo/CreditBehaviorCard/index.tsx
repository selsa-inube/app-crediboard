import { MdTrendingUp } from "react-icons/md";
import { Stack, Text } from "@inubekit/inubekit";

import { CardInfoContainer } from "@components/cards/CardInfoContainer";
import { StyledDivider } from "@components/cards/SummaryCard/styles";
import { formatPrimaryDate } from "@utils/formatData/date";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import userNotFound from "@assets/images/ItemNotFound.png";

interface CreditBehaviorProps {
  setBehaviorError: (stade: boolean) => void;
  centralScoreRisky: number;
  centralScoreDate: string;
  numberInternalBlackberries: number;
  maximumNumberInstallmentsArrears: number;
  dataBehaviorError: boolean;
  isMobile?: boolean;
}

export function CreditBehavior(props: CreditBehaviorProps) {
  const {
    centralScoreRisky,
    centralScoreDate,
    numberInternalBlackberries,
    maximumNumberInstallmentsArrears,
    isMobile,
    dataBehaviorError,
    setBehaviorError
    
  } = props;

  const handleRetry = () => {
    setBehaviorError(false);
  };


  const dateObject = new Date(centralScoreDate);

  return (
    <CardInfoContainer
      title="Comportamiento crediticio"
      icon={<MdTrendingUp />}
      isMobile={isMobile}
    >
      {dataBehaviorError ? (
        <ItemNotFound
          image={userNotFound}
          title="Datos no encontrados"
          description="No pudimos obtener los datos solicitados."
          buttonDescription="Reintentar"
          route="#"
          onRetry={handleRetry}
        />
      ) : (
        <Stack direction="column" gap={isMobile ? "6px" : "16px"}>
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "120px" : "170px"}>
              <Text size={isMobile ? "small" : "medium"}>
                Score central de riesgo
              </Text>
            </Stack>
            <Stack alignItems="center" gap="8px">
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {centralScoreRisky}
              </Text>
              <Text size={isMobile ? "small" : "medium"}>
                / {formatPrimaryDate(dateObject)}
              </Text>
            </Stack>
          </Stack>
          <StyledDivider />
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "120px" : "170px"}>
              <Text size={isMobile ? "small" : "medium"}>
                Número de moras internas
              </Text>
            </Stack>
            <Stack>
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {numberInternalBlackberries}
              </Text>
            </Stack>
          </Stack>
          <StyledDivider />
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "120px" : "170px"}>
              <Text size={isMobile ? "small" : "medium"}>
                Máximo de número de cuotas en mora
              </Text>
            </Stack>
            <Stack>
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {maximumNumberInstallmentsArrears}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      )}
    </CardInfoContainer>
  );
}
