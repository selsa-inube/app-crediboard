import { MdTrendingUp } from "react-icons/md";
import { useEffect, useState } from "react";

import { Stack, Text } from "@inubekit/inubekit";

import { CardInfoContainer } from "@components/cards/CardInfoContainer";
import { StyledDivider } from "@components/cards/SummaryCard/styles";
import { formatPrimaryDate } from "@utils/formatData/date";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import userNotFound from "@assets/images/ItemNotFound.png";
import { getCreditRepayamentBehavior } from "@services/creditProfiles/getCreditRepayamentBehavior";
import { ICreditRepayamentBehavior } from "@services/creditProfiles/types";
import { ICreditRequest } from "@services/creditRequest/query/types";

interface CreditBehaviorProps {
  businessUnitPublicCode: string;
  requests: ICreditRequest;
  isMobile?: boolean;
}

export function CreditBehavior(props: CreditBehaviorProps) {
  const { isMobile, businessUnitPublicCode, requests } = props;

  const [dataBehavior, setDataBehavior] = useState<ICreditRepayamentBehavior>();

  const fetchCreditRepayamentBehavior = async () => {
    if (!requests.clientIdentificationNumber) return;

    const response = await getCreditRepayamentBehavior(
      businessUnitPublicCode,
      requests.clientIdentificationNumber
    );

    if (response === null) {
      setDataBehavior(undefined);
      return;
    }

    setDataBehavior(response);
  };

  const handleRetry = () => {
    fetchCreditRepayamentBehavior();
  };

  useEffect(() => {
    fetchCreditRepayamentBehavior();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, requests.clientIdentificationNumber]);

  const dateObject = new Date(dataBehavior?.bureauCreditRiskScoreDate || "");

  return (
    <CardInfoContainer
      title="Comportamiento crediticio"
      icon={<MdTrendingUp />}
      isMobile={isMobile}
    >
      {dataBehavior === undefined ? (
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
                {dataBehavior?.bureauCreditRiskScoreValue}
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
                {dataBehavior?.internalDelinquenciesAmount}
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
                {dataBehavior?.maxOverdueInstallments}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      )}
    </CardInfoContainer>
  );
}
