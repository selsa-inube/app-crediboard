import { useEffect, useState } from "react";
import {
  MdErrorOutline,
  MdExpandMore,
  MdInfoOutline,
  MdQueryStats,
} from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  SkeletonLine,
  useMediaQuery,
  Divider,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";
import { Fieldset } from "@components/data/Fieldset";
import { getCreditLimitByCreditRiskAnalysis } from "@services/creditLimit/getCreditLimitByCreditRiskAnalysis";
import { IMaximumCreditLimitAnalysis } from "@services/creditLimit/types";
import { ScrollableContainer } from "@pages/prospect/components/AddProductModal/styles";
import { useEnum } from "@hooks/useEnum";

import { frcConfigEnum } from "./FrcConfig";
import { StyledExpanded } from "./styles";

export interface ScoreModalProps {
  handleClose: () => void;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  clientIdentificationNumber: string;
  loading?: boolean;
}

type InfoModalType =
  | "intercept"
  | "seniority"
  | "centralRisk"
  | "employmentStability"
  | "maritalStatus"
  | "economicActivity";

export const ScoreModal = (props: ScoreModalProps) => {
  const {
    handleClose,
    businessUnitPublicCode,
    businessManagerCode,
    clientIdentificationNumber,
    loading,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentInfoType, setCurrentInfoType] =
    useState<InfoModalType>("intercept");
  const [isExpanded, setIsExpanded] = useState(false);

  const [error, setError] = useState(false);
  const [
    dataMaximumCreditLimitReciprocity,
    setDataMaximumCreditLimitReciprocity,
  ] = useState<IMaximumCreditLimitAnalysis>({
    assignedCreditLimit: 0,
    creditRiskMultiplier: 0,
    creditRiskScore: 0,
    maxAmountAvailableByCreditRiskAnalysis: 0,
    totalMonthlyIncome: 0,
    totalPortfolioObligation: 0,
  });

  const { lang } = useEnum();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCreditLimitByCreditRiskAnalysis(
          businessUnitPublicCode,
          businessManagerCode,
          clientIdentificationNumber
        );

        if (data) {
          setDataMaximumCreditLimitReciprocity(data);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchData();
  }, [businessUnitPublicCode, businessManagerCode, clientIdentificationNumber]);

  const handleInfoClick = (type: InfoModalType) => {
    setCurrentInfoType(type);
    setShowInfoModal(true);
  };

const getInfoText = (type: string) => {
  const infoMapping: Record<string, keyof typeof frcConfigEnum> = {
    intercept: "infoTextsIntercept",
    seniority: "infoTextsSeniority",
    centralRisk: "infoTextsCentralRisk",
    employmentStability: "infoTextsEmploymentStability",
    maritalStatus: "infoTextsMaritalStatus",
    economicActivity: "infoTextsEconomicActivity",
  };

  const enumKey = infoMapping[type];
  
  return enumKey ? frcConfigEnum[enumKey].i18n[lang] : "";
};

  return (
    <BaseModal
      title={frcConfigEnum.title.i18n[lang]}
      nextButton={frcConfigEnum.closeBtn.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      variantNext="outlined"
      width={isMobile ? "290px" : "500px"}
    >
      {error ? (
        <Stack direction="column" alignItems="center" height={isMobile ? "auto" : "216px"} justifyContent="center" alignContent="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {frcConfigEnum.errorTitle.i18n[lang]}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {frcConfigEnum.errorMessage.i18n[lang]}
          </Text>
        </Stack>
      ) : (
        <ScrollableContainer $smallScreen={isMobile} $height={isMobile ? "440px" : "auto"}>
          <Stack direction="column" gap="16px" padding="0 10px 0 0">
            <Stack direction="column" gap="12px">
              <Stack alignItems="center" justifyContent="space-between">
                <Stack gap="8px">
                  <Icon
                    appearance="primary"
                    icon={<MdQueryStats />}
                    disabled={false}
                    size="34px"
                  />
                  <Text appearance="primary" size="large" type="title">
                    {frcConfigEnum.subTitle.i18n[lang]}
                  </Text>
                </Stack>
                <Stack alignItems="center">
                  {loading ? (
                    <SkeletonLine width="70px" animated={true} />
                  ) : (
                    <Text
                      type="body"
                      weight="bold"
                      size="medium"
                      appearance="primary"
                    >
                      {dataMaximumCreditLimitReciprocity.creditRiskScore || 0}
                    </Text>
                  )}
                  <Text type="body" size="medium">
                    {frcConfigEnum.totalScoreMax.i18n[lang]}
                  </Text>
                  <StyledExpanded $expanded={isExpanded}>
                    <Icon
                      icon={<MdExpandMore />}
                      appearance="primary"
                      cursorHover
                      onClick={() => setIsExpanded((prev) => !prev)}
                    />
                  </StyledExpanded>
                </Stack>
              </Stack>
              <Divider />
              {isExpanded && (
                <>
                  <Stack justifyContent="space-between" alignItems="center">
                    <Text weight="bold" size="large" type="label">
                      {frcConfigEnum.intercept.i18n[lang]}
                    </Text>
                    {loading ? (
                      <SkeletonLine width="70px" animated={true} />
                    ) : (
                      <Stack gap="6px">
                        <Text appearance="primary" weight="bold" size="large">
                          0
                        </Text>
                        <Stack margin="4px 0 0 0">
                          <Icon
                            icon={<MdInfoOutline />}
                            appearance="primary"
                            size="14px"
                            onClick={() => handleInfoClick("intercept")}
                            cursorHover
                          />
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                  <Stack justifyContent="space-between" alignItems="center">
                    <Text weight="bold" size="large" type="label">
                      {frcConfigEnum.seniorityLabel.i18n[lang]}
                    </Text>
                    {loading ? (
                      <SkeletonLine width="70px" animated={true} />
                    ) : (
                      <Stack gap="6px">
                        <Text appearance="primary" weight="bold" size="large">
                          0
                        </Text>
                        <Stack margin="4px 0 0 0">
                          <Icon
                            icon={<MdInfoOutline />}
                            appearance="primary"
                            size="14px"
                            onClick={() => handleInfoClick("seniority")}
                            cursorHover
                          />
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                  <Stack justifyContent="space-between" alignItems="center">
                    <Text weight="bold" size="large" type="label">
                      {frcConfigEnum.centralRiskLabel.i18n[lang]}
                    </Text>
                    {loading ? (
                      <SkeletonLine width="70px" animated={true} />
                    ) : (
                      <Stack gap="6px">
                        <Text appearance="primary" weight="bold" size="large">
                          0
                        </Text>
                        <Stack margin="4px 0 0 0">
                          <Icon
                            icon={<MdInfoOutline />}
                            appearance="primary"
                            size="14px"
                            onClick={() => handleInfoClick("centralRisk")}
                            cursorHover
                          />
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                  <Stack justifyContent="space-between" alignItems="center">
                    <Text weight="bold" size="large" type="label">
                      {frcConfigEnum.employmentStabilityLabel.i18n[lang]}
                    </Text>
                    {loading ? (
                      <SkeletonLine width="70px" animated={true} />
                    ) : (
                      <Stack gap="6px">
                        <Text appearance="primary" weight="bold" size="large">
                          0
                        </Text>
                        <Stack margin="4px 0 0 0">
                          <Icon
                            icon={<MdInfoOutline />}
                            appearance="primary"
                            size="14px"
                            onClick={() => handleInfoClick("employmentStability")}
                            cursorHover
                          />
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                  <Stack justifyContent="space-between" alignItems="center">
                    <Text weight="bold" size="large" type="label">
                      {frcConfigEnum.maritalStatusLabel.i18n[lang]}
                    </Text>
                    {loading ? (
                      <SkeletonLine width="70px" animated={true} />
                    ) : (
                      <Stack gap="6px">
                        <Text appearance="primary" weight="bold" size="large">
                          0
                        </Text>
                        <Stack margin="4px 0 0 0">
                          <Icon
                            icon={<MdInfoOutline />}
                            appearance="primary"
                            size="14px"
                            onClick={() => handleInfoClick("maritalStatus")}
                            cursorHover
                          />
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                  <Stack justifyContent="space-between" alignItems="center">
                    <Text weight="bold" size="large" type="label">
                      {frcConfigEnum.economicActivityLabel.i18n[lang]}
                    </Text>
                    {loading ? (
                      <SkeletonLine width="70px" animated={true} />
                    ) : (
                      <Stack gap="6px">
                        <Text appearance="primary" weight="bold" size="large">
                          0
                        </Text>
                        <Stack margin="4px 0 0 0">
                          <Icon
                            icon={<MdInfoOutline />}
                            appearance="primary"
                            size="14px"
                            onClick={() => handleInfoClick("economicActivity")}
                            cursorHover
                          />
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                </>
              )}
            </Stack>
            <Divider dashed />
            <Stack justifyContent="space-between">
              <Text weight="bold" size="large" type="label">
                {frcConfigEnum.incomesLabel.i18n[lang]}
              </Text>
              <Stack>
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text>
                    {currencyFormat(
                      dataMaximumCreditLimitReciprocity.totalMonthlyIncome,
                      false
                    )}
                  </Text>
                )}
              </Stack>
            </Stack>
            <Stack justifyContent="space-between" alignItems="center">
              <Text weight="bold" size="large" type="label">
                {frcConfigEnum.timesIncome.i18n[lang]}
              </Text>
              {loading ? (
                <SkeletonLine width="70px" animated={true} />
              ) : (
                <Text type="body" size="large">
                  x{dataMaximumCreditLimitReciprocity.creditRiskMultiplier}
                </Text>
              )}
            </Stack>
            <Divider dashed />
            <Stack justifyContent="space-between">
              <Text weight="bold" size="large" type="label">
                {frcConfigEnum.maxLimit.i18n[lang]}
              </Text>
              <Stack>
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text>
                    {currencyFormat(
                      dataMaximumCreditLimitReciprocity.maxAmountAvailableByCreditRiskAnalysis,
                      false
                    )}
                  </Text>
                )}
              </Stack>
            </Stack>
            <Stack justifyContent="space-between" alignItems="center">
              <Text weight="bold" size="large" type="label">
                {frcConfigEnum.totalPortafolio.i18n[lang]}
              </Text>
              <Stack>
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text>
                    {currencyFormat(
                      dataMaximumCreditLimitReciprocity.assignedCreditLimit,
                      false
                    )}
                  </Text>
                )}
              </Stack>
            </Stack>
            <Fieldset>
              <Stack alignItems="center" direction="column" gap="8px">
                {loading ? (
                  <SkeletonLine height="50px" width="250px" animated />
                ) : (
                  <Text
                    appearance="primary"
                    weight="bold"
                    type="headline"
                    size="large"
                  >
                    $
                    {currencyFormat(
                      dataMaximumCreditLimitReciprocity.totalPortfolioObligation | 0,
                      false
                    )}
                  </Text>
                )}
                <Stack>
                  <Text appearance="gray" size="small" textAlign="center">
                    {frcConfigEnum.maxIndebtedness.i18n[lang]}
                  </Text>
                </Stack>
              </Stack>
            </Fieldset>
            {showInfoModal && (
              <BaseModal
                title={frcConfigEnum.infoModalTitle.i18n[lang]}
                nextButton={frcConfigEnum.infoModalButton.i18n[lang]}
                handleClose={() => setShowInfoModal(false)}
                handleNext={() => setShowInfoModal(false)}
                width={isMobile ? "290px" : "500px"}
              >
                <Text>{getInfoText(currentInfoType)}</Text>
              </BaseModal>
            )}
          </Stack>
        </ScrollableContainer>
      )}
    </BaseModal>
  );
};
