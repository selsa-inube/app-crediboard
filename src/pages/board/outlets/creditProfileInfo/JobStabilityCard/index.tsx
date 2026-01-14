import { MdOutlineBusinessCenter } from "react-icons/md";
import { useEffect, useState } from "react";
import { Stack, Text } from "@inubekit/inubekit";

import { CardInfoContainer } from "@components/cards/CardInfoContainer";
import { StyledDivider } from "@components/cards/SummaryCard/styles";
import { currencyFormat } from "@utils/formatData/currency";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import userNotFound from "@assets/images/ItemNotFound.png";
import { getLaborStabilityByCustomerId } from "@services/creditRequest/query/getLaborStabilityByCustomerId";
import { ILaborStabilityByCustomerId } from "@services/creditRequest/query/getLaborStabilityByCustomerId/types";
import { ICreditRequest } from "@services/creditRequest/query/types";
import { useEnum } from "@hooks/useEnum";

import { jobStabilityConfigEnum } from "./config";

interface JobStabilityCardProps {
  isMobile?: boolean;
  requests: ICreditRequest;
  businessUnitPublicCode: string;
  businessManagerCode: string;
}

export function JobStabilityCard(props: JobStabilityCardProps) {
  const { isMobile, requests, businessUnitPublicCode, businessManagerCode } =
    props;
  const language = useEnum().lang;

  const [laborStabilityByCustomerId, setLaborStabilityByCustomerId] = useState<
    ILaborStabilityByCustomerId[]
  >([]);

  const fetchLaborStabilityByCustomerId = async () => {
    if (!requests.clientIdentificationNumber) return;

    try {
      const data = await getLaborStabilityByCustomerId(
        businessUnitPublicCode,
        businessManagerCode,
        requests.clientIdentificationNumber
      );
      setLaborStabilityByCustomerId(data);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        throw {
          ...(error as object),
          message: (error as Error).message,
        };
      }
      throw new Error(jobStabilityConfigEnum.errorMessages.fetchError.i18n[language]);
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
    [
      businessUnitPublicCode,
      businessManagerCode,
      requests.clientIdentificationNumber,
    ]
  );
  return (
    <CardInfoContainer
      title={jobStabilityConfigEnum.title.i18n[language]}
      icon={<MdOutlineBusinessCenter />}
      isMobile={isMobile}
    >
      {laborStabilityByCustomerId.length === 0 ? (
        <ItemNotFound
          image={userNotFound}
          title={jobStabilityConfigEnum.errorMessages.dataNotFound.i18n[language]}
          description={jobStabilityConfigEnum.errorMessages.dataNotFoundDescription.i18n[language]}
          buttonDescription={jobStabilityConfigEnum.errorMessages.retryButton.i18n[language]}
          route="#"
          onRetry={handleRetry}
        />
      ) : (
        <Stack direction="column" gap={isMobile ? "6px" : "16px"}>
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "110px" : "170px"}>
              <Text size={isMobile ? "small" : "medium"}>
                {jobStabilityConfigEnum.labels.companySeniority.i18n[language]}
              </Text>
            </Stack>
            <Stack>
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {laborStabilityByCustomerId[0]?.laborSeniorityYears}{" "}
                {jobStabilityConfigEnum.labels.years.i18n[language]}
              </Text>
            </Stack>
          </Stack>
          <StyledDivider />
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "110px" : "170px"}>
              <Text size={isMobile ? "small" : "medium"}>
                {jobStabilityConfigEnum.labels.stabilityIndex.i18n[language]}
              </Text>
            </Stack>
            <Stack>
              <Stack alignItems="center" gap="8px">
                <Text
                  appearance="primary"
                  type="headline"
                  size={isMobile ? "small" : "medium"}
                >
                  {laborStabilityByCustomerId[0]?.jobStabilityIndex}
                </Text>
                <Text size={isMobile ? "small" : "medium"}>
                  /{laborStabilityByCustomerId[0]?.jobStabilityIndexTotal}
                </Text>
              </Stack>
            </Stack>
          </Stack>
          <StyledDivider />
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "110px" : "170px"}>
              <Text size={isMobile ? "small" : "medium"}>
                {jobStabilityConfigEnum.labels.estimatedCompensation.i18n[language]}
              </Text>
            </Stack>
            <Stack>
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {currencyFormat(
                  Number(
                    laborStabilityByCustomerId[0]
                      ?.estimatedContractTerminationPayment
                  ) || 0
                )}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      )}
    </CardInfoContainer>
  );
}
