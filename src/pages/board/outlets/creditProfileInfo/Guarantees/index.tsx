import { useEffect, useState, useContext } from "react";
import { PiSealCheckBold } from "react-icons/pi";
import { Stack, Text } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { CardInfoContainer } from "@components/cards/CardInfoContainer";
import { StyledDivider } from "@components/cards/SummaryCard/styles";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { getGuaranteesSummary } from "@services/creditRequest/query/guaranteesSummary";
import { IGuaranteesSummary } from "@services/creditRequest/query/types";
import { useEnum } from "@hooks/useEnum";
import { ICrediboardData } from "@context/AppContext/types";
import { SystemStateContext } from "@context/systemStateContext";
import {
  manageShowError,
  IError,
} from "@context/systemStateContextProvider/utils";

import {
  dataGuaranteesEnum,
  guaranteesLabelsEnum,
  getGuaranteesTranslations,
} from "./config";

interface GuaranteesProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  creditRequestId: string;
  eventData: ICrediboardData;
  isMobile?: boolean;
}

export function Guarantees(props: GuaranteesProps) {
  const {
    businessUnitPublicCode,
    businessManagerCode,
    creditRequestId,
    eventData,
    isMobile,
  } = props;
  const { lang } = useEnum();
  const { setShowModalError, setMessageError } = useContext(SystemStateContext);

  const [guaranteesSummary, setGuaranteesSummary] =
    useState<IGuaranteesSummary | null>(null);
  const fetchLaborStabilityByCustomerId = async () => {
    if (!creditRequestId) return;

    try {
      const data = await getGuaranteesSummary(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequestId,
        eventData.token || "",
      );
      setGuaranteesSummary(data);
    } catch (error) {
      manageShowError(error as IError, setMessageError, setShowModalError);
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
    [businessUnitPublicCode, businessManagerCode, creditRequestId],
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
              {getGuaranteesTranslations(
                guaranteesSummary?.requiredGuarantees || [],
                lang,
              ).join(", ")}
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
              {getGuaranteesTranslations(
                guaranteesSummary?.offeredGuarantees || [],
                lang,
              ).join(", ")}
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
              {getGuaranteesTranslations(
                guaranteesSummary?.activeGuarantees || [],
                lang,
              ).join(", ")}
            </Text>
          </Stack>
        </Stack>
      )}
    </CardInfoContainer>
  );
}
