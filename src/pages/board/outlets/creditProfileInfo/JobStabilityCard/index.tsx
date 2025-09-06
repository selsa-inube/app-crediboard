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

import { jobStabilityConfig } from "./config";

interface JobStabilityCardProps {
  companySeniority: number;
  stabilityIndex: number;
  estimatedCompensation: number;
  isMobile?: boolean;
  dataCreditProfile: boolean;
  setCreditProfile: (stade: boolean) => void;
  requests: ICreditRequest;
  businessUnitPublicCode: string;
}

export function JobStabilityCard(props: JobStabilityCardProps) {
  const {
    estimatedCompensation,
    isMobile,
    dataCreditProfile,
    setCreditProfile,
    requests,
    businessUnitPublicCode,
  } = props;

  const handleRetry = () => {
    setCreditProfile(false);
  };

  const [laborStabilityByCustomerId, setLaborStabilityByCustomerId] = useState<
    ILaborStabilityByCustomerId[]
  >([]);

  useEffect(() => {
    const fetchLaborStabilityByCustomerId = async () => {
      try {
        const data = await getLaborStabilityByCustomerId(
          businessUnitPublicCode,
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
        throw new Error(jobStabilityConfig.errorMessages.fetchError);
      }
    };

    fetchLaborStabilityByCustomerId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardInfoContainer
      title={jobStabilityConfig.title}
      icon={<MdOutlineBusinessCenter />}
      isMobile={isMobile}
    >
      {dataCreditProfile ? (
        <ItemNotFound
          image={userNotFound}
          title={jobStabilityConfig.errorMessages.dataNotFound}
          description={jobStabilityConfig.errorMessages.dataNotFoundDescription}
          buttonDescription={jobStabilityConfig.errorMessages.retryButton}
          route="#"
          onRetry={handleRetry}
        />
      ) : (
        <Stack direction="column" gap={isMobile ? "6px" : "16px"}>
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "110px" : "170px"}>
              <Text size={isMobile ? "small" : "medium"}>
                {jobStabilityConfig.labels.companySeniority}
              </Text>
            </Stack>
            <Stack>
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {laborStabilityByCustomerId[0]?.laborSeniorityYears}{" "}
                {jobStabilityConfig.labels.years}
              </Text>
            </Stack>
          </Stack>
          <StyledDivider />
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "110px" : "170px"}>
              <Text size={isMobile ? "small" : "medium"}>
                {jobStabilityConfig.labels.stabilityIndex}
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
                {jobStabilityConfig.labels.estimatedCompensation}
              </Text>
            </Stack>
            <Stack>
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {estimatedCompensation === 0
                  ? "$ 0"
                  : currencyFormat(
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
