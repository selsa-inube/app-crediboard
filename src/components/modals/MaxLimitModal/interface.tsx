import { MdErrorOutline } from "react-icons/md";
import { Stack, Icon, Text, SkeletonLine } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";
import { Fieldset } from "@components/data/Fieldset";
import { IMaximumCreditLimit } from "@services/creditLimit/types";

import { incomeModalConfigEnum } from "./IcomeModalConfig";

interface IMaxLimitModalUIProps {
  loading: boolean;
  error: boolean;
  isMobile: boolean;
  dataMaximumCreditLimitService: IMaximumCreditLimit;
  language: "es" | "en";
  handleClose: () => void;
}

export const MaxLimitModalUI = (props: IMaxLimitModalUIProps) => {
  const {
    dataMaximumCreditLimitService,
    loading,
    error,
    isMobile,
    handleClose,
    language
  } = props;

  return (
    <BaseModal
      title={incomeModalConfigEnum.title.i18n[language]}
      nextButton={incomeModalConfigEnum.btnClose.i18n[language]}
      handleNext={handleClose}
      handleClose={handleClose}
      variantNext="outlined"
      width={isMobile ? "287px" : "450px"}
    >
      {error ? (
        <Stack direction="column" alignItems="center" height={isMobile ? "auto" : "216px"} justifyContent="center" alignContent="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {incomeModalConfigEnum.errorTitle.i18n[language]}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {incomeModalConfigEnum.errorMessage.i18n[language]}
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" gap="24px">
          <Stack direction="column" gap="12px">
            <Stack justifyContent="space-between">
              <Text size="large" weight="bold" type="label">
                {incomeModalConfigEnum.financialObligationsLabel.i18n[language]}
              </Text>
              <Stack alignItems="center">
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text type="body" size="medium">
                    {currencyFormat(
                      dataMaximumCreditLimitService.customerCreditLimitInLineOfCredit,
                      false,
                    )}
                  </Text>
                )}
              </Stack>
            </Stack>
            <Stack justifyContent="space-between">
              <Text appearance="gray" size="large" weight="bold" type="label">
                {incomeModalConfigEnum.subsistenceReserveLabel.i18n[language]}
              </Text>
              <Stack alignItems="center">
                <Text appearance="success">$</Text>
                {loading ? (
                  <SkeletonLine width="70px" animated={true} />
                ) : (
                  <Text type="body" size="medium">
                    {currencyFormat(
                      dataMaximumCreditLimitService.customerTotalObligationsInLineOfCredit,
                      false,
                    )}
                  </Text>
                )}
              </Stack>
            </Stack>
          </Stack>
          <Fieldset>
            <Stack
              justifyContent="center"
              alignItems="center"
              width="100%"
              direction="column"
              gap="8px"
            >
              <Text
                appearance="primary"
                weight="bold"
                type="headline"
                size="large"
              >
                $
                {loading
                  ? incomeModalConfigEnum.loading.i18n[language]
                  : currencyFormat(
                      dataMaximumCreditLimitService.lineOfCreditLoanAmountLimitRegulation,
                      false,
                    )}
              </Text>
              <Text appearance="gray" size="small">
                {incomeModalConfigEnum.maxAmountDescription.i18n[language]}
              </Text>
            </Stack>
          </Fieldset>
        </Stack>
      )}
    </BaseModal>
  );
};
