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

interface CreditBehaviorProps {
  setBehaviorError: (stade: boolean) => void;
  dataBehaviorError: boolean;
  businessUnitPublicCode: string,
  customerIdentificationNumber: string,
  isMobile?: boolean;
}

export function CreditBehavior(props: CreditBehaviorProps) {
  const {
    isMobile,
    dataBehaviorError,
    setBehaviorError,
    businessUnitPublicCode,
    customerIdentificationNumber
  } = props;

  const [dataBehavior, setDataBehavior] = useState<ICreditRepayamentBehavior>();

  const handleRetry = () => {
    setBehaviorError(false);
  };

  useEffect(() => {
    (async () => {
      const response = await getCreditRepayamentBehavior(
        businessUnitPublicCode,
        customerIdentificationNumber
      );

      if (response === null) {
        setBehaviorError(true);
        return;
      }

      setDataBehavior(response);
    })();
  }, [businessUnitPublicCode, customerIdentificationNumber, setBehaviorError]);

  const dateObject = new Date(dataBehavior?.bureauCreditRiskScoreDate || "");

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
