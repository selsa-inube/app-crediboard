import { MdQueryStats } from "react-icons/md";
import { Stack, Text, SkeletonLine } from "@inubekit/inubekit";

import { CardInfoContainer } from "@components/cards/CardInfoContainer";
import { StyledDivider } from "@components/cards/SummaryCard/styles";
import { IRiskScoringRangeRequered } from "./types";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import userNotFound from "@assets/images/ItemNotFound.png";

interface RiskScoringProps {
  totalScore: number;
  minimumScore: number;
  seniority: number;
  seniorityScore: number;
  riskCenter: number;
  riskCenterScore: number;
  jobStabilityIndex: number;
  jobStabilityIndexScore: number;
  maritalStatusScore: number;
  economicActivityScore: number;
  maritalStatus: string;
  economicActivity: string;
  isLoading: boolean;
  isMobile?: boolean;
  dataWereObtained: boolean;
  dataRiskScoringMax: IRiskScoringRangeRequered;
  setWataWereObtained: (stade: boolean) => void;
}

export function RiskScoring(props: RiskScoringProps) {
  const {
    totalScore,
    minimumScore,
    seniority,
    seniorityScore,
    riskCenter,
    riskCenterScore,
    jobStabilityIndex,
    jobStabilityIndexScore,
    maritalStatusScore,
    economicActivityScore,
    maritalStatus,
    economicActivity,
    isLoading,
    isMobile,
    dataWereObtained,
    dataRiskScoringMax,
    setWataWereObtained,
  } = props;

  const getMainGap = () => {
    if (isMobile) {
      return isLoading ? "16px" : "4px";
    } else {
      return isLoading ? "28px" : "16px";
    }
  };

  const getInnerGap = () => {
    if (isMobile) {
      return isLoading ? "16px" : "4px";
    } else {
      return isLoading ? "20px" : "8px";
    }
  };

  const handleRetry = () => {
    setWataWereObtained(false);
  };

  return (
    <CardInfoContainer
      title="Scoring de riesgo"
      icon={<MdQueryStats />}
      isMobile={isMobile}
    >
      {dataWereObtained ? (
        <ItemNotFound
          image={userNotFound}
          title="Datos no encontrados"
          description="No pudimos obtener los datos solicitados."
          buttonDescription="Reintentar"
          route="#"
          onRetry={handleRetry}
        />
      ) : (
        <Stack direction="column" gap={getMainGap()}>
          <Stack alignItems="center" gap="32px">
            <Stack width="100px">
              {isLoading ? (
                <SkeletonLine animated width="100%" />
              ) : (
                <Text
                  size={isMobile ? "small" : "medium"}
                  disabled={dataWereObtained}
                >
                  Puntaje total
                </Text>
              )}
            </Stack>
            <Stack alignItems="center" gap="8px">
              {isLoading ? (
                <SkeletonLine animated width="80px" />
              ) : (
                <Text
                  appearance="primary"
                  type={dataWereObtained ? "body" : "headline"}
                  size={isMobile || dataWereObtained ? "small" : "medium"}
                  disabled={dataWereObtained}
                >
                  {dataWereObtained ? "-" : totalScore}
                </Text>
              )}
              {isLoading ? (
                <SkeletonLine animated width="80px" />
              ) : (
                <Text
                  size={isMobile || dataWereObtained ? "small" : "medium"}
                  disabled={dataWereObtained}
                >
                  {dataWereObtained ? "-" : `/ mínimo ${minimumScore}`}
                </Text>
              )}
            </Stack>
          </Stack>
          <StyledDivider />
          <Stack direction="column" gap={getInnerGap()}>
            <Stack alignItems="center">
              <Stack width={isMobile ? "600px" : "500px"}>
                {isLoading ? (
                  <SkeletonLine animated width="100%" />
                ) : (
                  <Text
                    size={isMobile ? "small" : "medium"}
                    disabled={dataWereObtained}
                  >
                    {dataWereObtained ? "-" : `Antigüedad de ${seniority} años`}
                  </Text>
                )}
              </Stack>
              <Stack justifyContent="end" width="100%">
                {isLoading ? (
                  <SkeletonLine animated width="60px" />
                ) : (
                  <>
                    <Text
                      appearance="primary"
                      type="title"
                      size={dataWereObtained ? "small" : "large"}
                      disabled={dataWereObtained}
                    >
                      {dataWereObtained ? "-" : seniorityScore}
                    </Text>
                    <Text>/ {dataRiskScoringMax?.seniority_score}</Text>
                  </>
                )}
              </Stack>
            </Stack>
            <Stack alignItems="center">
              <Stack width={isMobile ? "600px" : "500px"}>
                {isLoading ? (
                  <SkeletonLine animated width="100%" />
                ) : (
                  <Text
                    size={isMobile ? "small" : "medium"}
                    disabled={dataWereObtained}
                  >
                    {dataWereObtained
                      ? "-"
                      : `Central de riesgo de ${riskCenter} P`}
                  </Text>
                )}
              </Stack>
              <Stack justifyContent="end" width="100%">
                {isLoading ? (
                  <SkeletonLine animated width="60px" />
                ) : (
                  <>
                    <Text
                      appearance="primary"
                      type="title"
                      size={dataWereObtained ? "small" : "large"}
                      disabled={dataWereObtained}
                    >
                      {dataWereObtained ? "-" : riskCenterScore}
                    </Text>
                    <Text>/ {dataRiskScoringMax?.risk_center_score}</Text>
                  </>
                )}
              </Stack>
            </Stack>
            <Stack alignItems="center">
              <Stack width={isMobile ? "600px" : "500px"}>
                {isLoading ? (
                  <SkeletonLine animated width="100%" />
                ) : (
                  <Text
                    size={isMobile ? "small" : "medium"}
                    disabled={dataWereObtained}
                  >
                    {dataWereObtained
                      ? "-"
                      : `Indice de estabilidad laboral ${jobStabilityIndex} P`}
                  </Text>
                )}
              </Stack>
              <Stack justifyContent="end" width="100%">
                {isLoading ? (
                  <SkeletonLine animated width="60px" />
                ) : (
                  <>
                    <Text
                      appearance="primary"
                      type="title"
                      size={dataWereObtained ? "small" : "large"}
                      disabled={dataWereObtained}
                    >
                      {dataWereObtained ? "-" : jobStabilityIndexScore}
                    </Text>
                    <Text>
                      / {dataRiskScoringMax?.job_stability_index_score}
                    </Text>
                  </>
                )}
              </Stack>
            </Stack>
            <Stack alignItems="center">
              <Stack width={isMobile ? "600px" : "500px"}>
                {isLoading ? (
                  <SkeletonLine animated width="100%" />
                ) : (
                  <Text
                    size={isMobile ? "small" : "medium"}
                    disabled={dataWereObtained}
                  >
                    {dataWereObtained ? "-" : `Estado civil - ${maritalStatus}`}
                  </Text>
                )}
              </Stack>
              <Stack justifyContent="end" width="100%">
                {isLoading ? (
                  <SkeletonLine animated width="60px" />
                ) : (
                  <>
                    <Text
                      appearance="primary"
                      type="title"
                      size={dataWereObtained ? "small" : "large"}
                      disabled={dataWereObtained}
                    >
                      {dataWereObtained ? "-" : maritalStatusScore}
                    </Text>
                    <Text>/ {dataRiskScoringMax?.marital_status_score}</Text>
                  </>
                )}
              </Stack>
            </Stack>
            <Stack alignItems="center">
              <Stack width={isMobile ? "600px" : "500px"}>
                {isLoading ? (
                  <SkeletonLine animated width="100%" />
                ) : (
                  <Text
                    size={isMobile ? "small" : "medium"}
                    disabled={dataWereObtained}
                  >
                    {dataWereObtained
                      ? "-"
                      : `Actividad economica - ${economicActivity}`}
                  </Text>
                )}
              </Stack>
              <Stack justifyContent="end" width="100%" alignItems="center">
                {isLoading ? (
                  <SkeletonLine animated width="60px" />
                ) : (
                  <>
                    <Text
                      appearance="primary"
                      type="title"
                      size={dataWereObtained ? "small" : "large"}
                      disabled={dataWereObtained}
                    >
                      {dataWereObtained ? "-" : economicActivityScore}
                    </Text>
                    <Text>/ {dataRiskScoringMax?.economic_activity_score}</Text>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}
    </CardInfoContainer>
  );
}
