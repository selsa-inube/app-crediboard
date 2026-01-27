import { useEffect, useState } from "react";
import { PiSealCheckBold } from "react-icons/pi";
import { Stack, Text } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { CardInfoContainer } from "@components/cards/CardInfoContainer";
import { StyledDivider } from "@components/cards/SummaryCard/styles";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { getGuaranteesSummary } from "@services/creditRequest/query/guaranteesSummary";
import { IGuaranteesSummary } from "@services/creditRequest/query/types";
import { useEnum } from "@hooks/useEnum";

import { dataGuaranteesEnum, guaranteesLabelsEnum } from "./config";

interface GuaranteesProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  creditRequestId: string;
  prospectCode: string;
  isMobile?: boolean;
}

export function Guarantees(props: GuaranteesProps) {
  const {
    businessUnitPublicCode,
    businessManagerCode,
    creditRequestId,
    prospectCode,
    isMobile,
  } = props;
  const { lang } = useEnum();

  const [guaranteesSummary, setGuaranteesSummary] =
    useState<IGuaranteesSummary | null>(null);

  const fetchLaborStabilityByCustomerId = async () => {
    if (!creditRequestId) return;

    try {
      const data = await getGuaranteesSummary(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequestId,
        prospectCode
      );
      setGuaranteesSummary(data);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        throw {
          ...(error as object),
          message: (error as Error).message,
        };
      }
    }
  };

  const handleRetry = () => {
    fetchLaborStabilityByCustomerId();
  };

  useEffect(
    () => {
      fetchLaborStabilityByCustomerId();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [businessUnitPublicCode, businessManagerCode, creditRequestId]
  );

  return (
    <CardInfoContainer
      title={guaranteesLabelsEnum.title.i18n[lang]}
      icon={<PiSealCheckBold />}
      isMobile={isMobile}
    >
      {!guaranteesSummary ? (
        <ItemNotFound
          image={userNotFound}
          title={guaranteesLabelsEnum.notFound.title.i18n[lang]}
          description={guaranteesLabelsEnum.notFound.description.i18n[lang]}
          buttonDescription={guaranteesLabelsEnum.notFound.retry.i18n[lang]}
          route="#"
          onRetry={handleRetry}
        />
      ) : (
        <Stack direction="column" gap={isMobile ? "8px" : "12px"}>
          <Stack direction="column">
            <Text size={isMobile ? "small" : "medium"}>
              {dataGuaranteesEnum.required.i18n[lang]}
            </Text>
            <Text
              appearance="primary"
              type="title"
              size={isMobile ? "small" : "medium"}
              weight="bold"
            >
              {guaranteesSummary?.requiredGuarantees}
            </Text>
          </Stack>
          <StyledDivider />
          <Stack direction="column">
            <Text size={isMobile ? "small" : "medium"}>
              {dataGuaranteesEnum.offered.i18n[lang]}
            </Text>
            <Text
              appearance="primary"
              type="title"
              size={isMobile ? "small" : "medium"}
              weight="bold"
            >
              {guaranteesSummary?.offeredGuarantees}
            </Text>
          </Stack>
          <StyledDivider />
          <Stack direction="column">
            <Text size={isMobile ? "small" : "medium"}>
              {dataGuaranteesEnum.active.i18n[lang]}
            </Text>
            <Text
              appearance="primary"
              type="title"
              size={isMobile ? "small" : "medium"}
              weight="bold"
            >
              {guaranteesSummary?.activeGuarantees}
            </Text>
          </Stack>
        </Stack>
      )}
    </CardInfoContainer>
  );
}
