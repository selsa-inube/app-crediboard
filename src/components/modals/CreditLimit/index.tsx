import { useEffect, useMemo, useState } from "react";
import {
  MdOutlineVisibility,
  MdInfoOutline,
  MdErrorOutline,
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
import { getGlobalCreditLimitByLineOfCredit } from "@services/creditLimit/getGlobalCreditLimitByLineOfCredit";
import { IMaximumCreditLimitByLineOfCredit } from "@services/creditLimit/types";

import { creditLimitTextsEnum } from "./creditLimitConfig";
import { StyledList } from "./styles";
import { Skeletons } from "./skeletons";

export interface ICreditLimitProps {
  title: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  clientIdentificationNumber: string;
  lang: "en" | "es";
  loading?: boolean;
  handleClose: () => void;
  onOpenMaxLimitModal?: () => void;
  onOpenPaymentCapacityModal?: () => void;
  onOpenReciprocityModal?: () => void;
  onOpenFrcModal?: () => void;
}

export const CreditLimit = (props: ICreditLimitProps) => {
  const {
    title,
    businessUnitPublicCode,
    businessManagerCode,
    clientIdentificationNumber,
    loading,
    handleClose,
    onOpenMaxLimitModal,
    onOpenPaymentCapacityModal,
    onOpenReciprocityModal,
    onOpenFrcModal,
    lang,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const [error, setError] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true);
  const [dataMaximumCreditLimit, setDataMaximumCreditLimit] = useState<
    IMaximumCreditLimitByLineOfCredit[]
  >([]);

  const isLoading = loading || internalLoading;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInternalLoading(true);
        const data = await getGlobalCreditLimitByLineOfCredit(
          businessUnitPublicCode,
          businessManagerCode,
          clientIdentificationNumber,
        );

        if (data) {
          setDataMaximumCreditLimit(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setInternalLoading(false);
      }
    };

    fetchData();
  }, [businessUnitPublicCode, businessManagerCode, clientIdentificationNumber]);

  const limits = useMemo(() => {
    const map: Record<string, number> = {};

    dataMaximumCreditLimit.forEach((item) => {
      map[item.creditLimitCalculationMethodAbbreviatedName] =
        item.creditLimitCalculationMethodValue;
    });

    return {
      maxCreditLimit: map["MaxCreditLimit"],
      reciprocity: map["ReciprocityBasedCreditLimit"],
      paymentCapacity: map["PaymentCapacityBasedCreditLimit"],
      riskAnalysis: map["RiskAnalysisBasedCreditLimit"],
      personalized: map["Personalized"],
    };
  }, [dataMaximumCreditLimit]);

  const usableQuota = useMemo(() => {
    const validValues = [
      limits.maxCreditLimit,
      limits.reciprocity,
      limits.paymentCapacity,
      limits.riskAnalysis,
      limits.personalized,
    ].filter((value): value is number => value !== undefined);

    if (validValues.length === 0) return 0;
    return Math.min(...validValues);
  }, [limits]);

  return (
    <BaseModal
      title={title}
      nextButton={creditLimitTextsEnum.close.i18n[lang]}
      handleNext={handleClose}
      width={isMobile ? "280px" : "550px"}
      height={isMobile ? "600px" : "497px"}
      handleBack={handleClose}
      finalDivider={true}
    >
      {error ? (
        <Stack direction="column" alignItems="center" height={isMobile ? "auto" : "216px"} justifyContent="center" alignContent="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {creditLimitTextsEnum.errorTitle.i18n[lang]}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {creditLimitTextsEnum.errorMessage.i18n[lang]}
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" gap="24px" height={isMobile ? "400px" : "330px"}>
          {isLoading ? (
            <StyledList>
              <Stack direction="column" gap="12px" height="160px">
                {Array.from({ length: 5 }).map((__, index) => (
                  <Skeletons index={index}  />
                ))}
              </Stack>
            </StyledList>
          ) : (
            <StyledList>
              <Stack direction="column" gap="12px" height={isMobile ? "250px" : "170px"}>
                {limits.maxCreditLimit !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTextsEnum.maxPaymentCapacity.i18n[lang]}
                      </Text>

                      <Stack alignItems="center">
                        <Text appearance="success">$</Text>
                        {loading ? (
                          <SkeletonLine width="70px" animated={true} />
                        ) : (
                          <Text type="body" size="medium" appearance="dark">
                            {currencyFormat(limits.maxCreditLimit, false)}
                          </Text>
                        )}
                        <Stack margin="0px 0px 0px 5px">
                          <Icon
                            appearance="primary"
                            icon={<MdOutlineVisibility />}
                            size="16px"
                            spacing="narrow"
                            cursorHover={true}
                            variant="filled"
                            shape="circle"
                            onClick={onOpenMaxLimitModal}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </li>
                )}
                {limits.reciprocity !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTextsEnum.maxReciprocity.i18n[lang]}
                      </Text>
                      <Stack alignItems="center">
                        <Text appearance="success">$</Text>
                        {loading ? (
                          <SkeletonLine width="70px" animated={true} />
                        ) : (
                          <Text type="body" size="medium" appearance="dark">
                            {currencyFormat(limits.reciprocity, false)}
                          </Text>
                        )}
                        <Stack margin="0px 0px 0px 5px">
                          <Icon
                            appearance="primary"
                            icon={<MdOutlineVisibility />}
                            size="16px"
                            spacing="narrow"
                            cursorHover={true}
                            variant="filled"
                            shape="circle"
                            onClick={onOpenReciprocityModal}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </li>
                )}
                {limits.paymentCapacity !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTextsEnum.maxDebtFRC.i18n[lang]}
                      </Text>
                      <Stack alignItems="center">
                        <Text appearance="success">$</Text>
                        {loading ? (
                          <SkeletonLine width="70px" animated={true} />
                        ) : (
                          <Text type="body" size="medium" appearance="dark">
                            {currencyFormat(limits.paymentCapacity, false)}
                          </Text>
                        )}
                        <Stack margin="0px 0px 0px 5px">
                          <Icon
                            appearance="primary"
                            icon={<MdOutlineVisibility />}
                            size="16px"
                            spacing="narrow"
                            cursorHover
                            variant="filled"
                            shape="circle"
                            onClick={onOpenPaymentCapacityModal}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </li>
                )}

                {limits.riskAnalysis !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTextsEnum.maxIndebtedness.i18n[lang]}
                      </Text>
                      <Stack alignItems="center">
                        <Text appearance="success">$</Text>
                        {loading ? (
                          <SkeletonLine width="70px" animated={true} />
                        ) : (
                          <Text type="body" size="medium" appearance="dark">
                            {currencyFormat(limits.riskAnalysis, false)}
                          </Text>
                        )}
                        <Stack margin="0px 0px 0px 5px">
                          <Icon
                            appearance="primary"
                            icon={<MdOutlineVisibility />}
                            size="16px"
                            spacing="narrow"
                            cursorHover
                            variant="filled"
                            shape="circle"
                            onClick={onOpenFrcModal}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </li>
                )}
                {limits.personalized !== undefined && (
                  <li>
                    <Stack justifyContent="space-between">
                      <Text
                        appearance="dark"
                        size="large"
                        weight="bold"
                        type="label"
                      >
                        {creditLimitTextsEnum.assignedLimit.i18n[lang]}
                      </Text>
                      <Stack alignItems="center" gap="4px">
                        <Text appearance="success">$</Text>
                        {loading ? (
                          <SkeletonLine width="70px" animated={true} />
                        ) : (
                          <Text
                            weight="bold"
                            type="body"
                            size="medium"
                            appearance="dark"
                          >
                            {currencyFormat(limits.personalized, false)}
                          </Text>
                        )}
                      </Stack>
                    </Stack>
                  </li>
                )}
              </Stack>
            </StyledList>
          )}

          <Divider />

          {isLoading ? (
            <>
              <SkeletonLine width="70%" height="20px" animated />
              <Stack direction="column" alignItems="center" gap="10px">
                <SkeletonLine width="150px" height="20px" animated />
                <SkeletonLine width="100px" height="30px" animated />
              </Stack>
            </>
          ) : (
            <>
              <Stack alignItems="center">
                <Icon
                  appearance="help"
                  icon={<MdInfoOutline />}
                  size="16px"
                  spacing="narrow"
                />
                <Text margin="0px 5px" size="small">
                  {creditLimitTextsEnum.maxUsableQuote.i18n[lang]}
                </Text>
              </Stack>
              <Stack direction="column" alignItems="center">
                <Text
                  type="headline"
                  size="large"
                  weight="bold"
                  appearance="primary"
                >
                  {currencyFormat(usableQuota, true)}
                </Text>
                <Text type="body" size="small">
                  {creditLimitTextsEnum.maxMount.i18n[lang]}
                </Text>
              </Stack>
            </>
          )}
        </Stack>
      )}
    </BaseModal>
  );
};
