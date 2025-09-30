import { useEffect, useState } from "react";
import { MdQueryStats } from "react-icons/md";
import { Stack, Text, SkeletonLine } from "@inubekit/inubekit";

import { CardInfoContainer } from "@components/cards/CardInfoContainer";
import { StyledDivider } from "@components/cards/SummaryCard/styles";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import userNotFound from "@assets/images/ItemNotFound.png";
import { ICreditRiskScoreResponse } from "@services/creditProfiles/types";
import { getCreditRiskScoreById } from "@services/creditProfiles/GetCreditRiskScoreById";
import { ErrorModal } from "@components/modals/ErrorModal";

import { dataRiskScoring } from "./config";

interface RiskScoringProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  customerIdentificationNumber: string;
  isMobile: boolean;
}

export function RiskScoring(props: RiskScoringProps) {
  const {
    businessUnitPublicCode,
    businessManagerCode,
    customerIdentificationNumber,
    isMobile,
  } = props;

  const [data, setData] = useState<ICreditRiskScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");

  const getMainGap = () => {
    if (isMobile) {
      return loading ? "16px" : "4px";
    } else {
      return loading ? "28px" : "16px";
    }
  };

  const getInnerGap = () => {
    if (isMobile) {
      return loading ? "16px" : "4px";
    } else {
      return loading ? "20px" : "8px";
    }
  };

  const handleRetry = () => {
    setData(null);
    (async () => {
      try {
        setLoading(true);
        const response = await getCreditRiskScoreById(
          businessUnitPublicCode,
          businessManagerCode,
          customerIdentificationNumber
        );
        setData(response);
      } catch {
        setShowErrorModal(true);
        setMessageError(dataRiskScoring.modalError);
      }
    })();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCreditRiskScoreById(
          businessUnitPublicCode,
          businessManagerCode,
          customerIdentificationNumber
        );
        setData(response);
      } catch {
        setShowErrorModal(true);
        setMessageError(dataRiskScoring.modalError);
      }
    };

    fetchData();
  }, [
    businessUnitPublicCode,
    customerIdentificationNumber,
    businessManagerCode,
  ]);

  return (
    <CardInfoContainer
      title="Scoring de riesgo"
      icon={<MdQueryStats />}
      isMobile={isMobile}
    >
      <>
        {!data ? (
          <ItemNotFound
            image={userNotFound}
            title={dataRiskScoring.noData}
            description={dataRiskScoring.noDataDescription}
            buttonDescription={dataRiskScoring.retryButton}
            onRetry={handleRetry}
          />
        ) : (
          <Stack direction="column" gap={getMainGap()}>
            <Stack alignItems="center" gap="32px">
              <Stack width="100px">
                {loading ? (
                  <SkeletonLine animated width="100%" />
                ) : (
                  <Text size={isMobile ? "small" : "medium"}>
                    {dataRiskScoring.totalScore}
                  </Text>
                )}
              </Stack>
              <Stack alignItems="center" gap="8px">
                {loading ? (
                  <SkeletonLine animated width="80px" />
                ) : (
                  <Text
                    appearance="primary"
                    type={isMobile ? "body" : "headline"}
                    size={isMobile ? "small" : "medium"}
                  >
                    {data.totalCreditRiskScore}
                  </Text>
                )}
                {loading ? (
                  <SkeletonLine animated width="80px" />
                ) : (
                  <Text size={isMobile ? "small" : "medium"}>
                    {`${dataRiskScoring.min} ${data.minCreditRiskScore}`}
                  </Text>
                )}
              </Stack>
            </Stack>
            <StyledDivider />
            <Stack direction="column" gap={getInnerGap()}>
              {data.variables.map((variable, index) => (
                <Stack key={index} alignItems="center">
                  <Stack width={isMobile ? "600px" : "500px"}>
                    {loading ? (
                      <SkeletonLine animated width="100%" />
                    ) : (
                      <Text size={isMobile ? "small" : "medium"}>
                        {`${variable.variableDescription} ${variable.variableValue}`}
                      </Text>
                    )}
                  </Stack>
                  <Stack justifyContent="end" width="100%">
                    {loading ? (
                      <SkeletonLine animated width="60px" />
                    ) : (
                      <Text
                        appearance="primary"
                        type="title"
                        size={isMobile ? "small" : "large"}
                      >
                        {variable.variableScore}
                      </Text>
                    )}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
        {showErrorModal && (
          <ErrorModal
            message={messageError}
            handleClose={() => setShowErrorModal(false)}
          />
        )}
      </>
    </CardInfoContainer>
  );
}
