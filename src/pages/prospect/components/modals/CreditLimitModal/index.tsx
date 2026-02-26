import { useEffect, useState, useMemo, useContext } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Icon, Stack, Text, SkeletonLine } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { IPaymentChannel } from "@services/creditRequest/command/types";
import { getGlobalLimitByMoneyDestination } from "@services/creditLimit/getGlobalLimitByMoneyDestination";
import { IMaximumCreditLimitByMoneyDestination } from "@services/creditLimit/types";
import { CreditLimitCard } from "@pages/simulateCredit/CreditLimitCard";
import { IdataMaximumCreditLimitService } from "@pages/simulateCredit/CreditLimitCard/types";
import { ISourcesOfIncomeState } from "@components/modals/payCapacityModal/types";
import { StyledContainer } from "@pages/simulateCredit/CreditLimitCard/styles";
import { useEnum } from "@hooks/useEnum";
import { AppContext } from "@context/AppContext";

import { IIncomeSources } from "../../CreditProspect/types";
import { dataCreditLimitModalEnum } from "./config";
import { StyledCardsContainer } from "./styles";

export interface ICreditLimitModalProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  isMobile: boolean;
  moneyDestination: string;
  handleClose: () => void;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  loading: boolean;
  userAccount: string;
  requestValue?: IPaymentChannel[];
  incomeData: Record<string, IIncomeSources>;
}

export function CreditLimitModal(props: ICreditLimitModalProps) {
  const {
    businessUnitPublicCode,
    businessManagerCode,
    dataMaximumCreditLimitService,
    isMobile,
    moneyDestination,
    userAccount,
    handleClose,
    incomeData,
  } = props;
  const { lang } = useEnum();
  const { eventData } = useContext(AppContext);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataMaximumCreditLimit, setDataMaximumCreditLimit] = useState<
    IMaximumCreditLimitByMoneyDestination[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getGlobalLimitByMoneyDestination(
          businessUnitPublicCode,
          businessManagerCode,
          moneyDestination,
          dataMaximumCreditLimitService.identificationDocumentNumber,
          eventData.token,
          incomeDataExtracted as IIncomeSources,
        );

        if (data) {
          setDataMaximumCreditLimit(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    businessUnitPublicCode,
    moneyDestination,
    businessManagerCode,
    dataMaximumCreditLimitService,
    eventData.token,
  ]);

  const incomeDataExtracted = useMemo(() => {
    if (!incomeData || typeof incomeData !== "object") {
      return null;
    }

    const keys = Object.keys(incomeData);
    if (keys.length === 0) {
      return null;
    }

    const firstKey = keys[0];
    const extracted = incomeData[firstKey];

    return extracted;
  }, [incomeData]);

  return (
    <BaseModal
      title={dataCreditLimitModalEnum.warningTitle.i18n[lang]}
      nextButton={dataCreditLimitModalEnum.close.i18n[lang]}
      handleNext={handleClose}
      handleClose={handleClose}
      internalWidth={isMobile ? "300px " : "450px"}
      finalDivider={true}
    >
      {error ? (
        <Stack direction="column" alignItems="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {dataCreditLimitModalEnum.errorTitle.i18n[lang]}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {dataCreditLimitModalEnum.errorMessage.i18n[lang]}
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" gap="26px">
          <Text appearance="gray" type="body" size="medium" weight="normal">
            {dataCreditLimitModalEnum.warningDescription.i18n[lang]}
          </Text>
          <Stack
            direction={isMobile ? "column" : "row"}
            gap="24px"
            margin="0 auto"
            padding=" 0px 5px"
          >
            <StyledCardsContainer
              isMobile={isMobile}
              oneProduct={dataMaximumCreditLimit.length === 1}
              moreThanOneLine={dataMaximumCreditLimit.length > 2}
            >
              {isLoading
                ? Array.from({ length: 2 }).map((_, index) => (
                    <StyledContainer key={index}>
                      <Stack
                        direction="column"
                        alignItems="center"
                        height="50px"
                        gap="10px"
                      >
                        <SkeletonLine width="80%" height="30px" animated />
                        <SkeletonLine width="40%" height="20px" animated />
                      </Stack>
                    </StyledContainer>
                  ))
                : dataMaximumCreditLimit.map((item, index) => (
                    <CreditLimitCard
                      key={index}
                      creditLineTxt={item.lineOfCredit}
                      creditLine={item.creditLimitValue}
                      isMobile={isMobile}
                      businessUnitPublicCode={businessUnitPublicCode}
                      businessManagerCode={businessManagerCode}
                      dataMaximumCreditLimitService={
                        dataMaximumCreditLimitService
                      }
                      userAccount={userAccount}
                      setError={setError}
                      error={error}
                      incomeData={incomeDataExtracted as ISourcesOfIncomeState}
                    />
                  ))}
            </StyledCardsContainer>
          </Stack>
          <Text appearance="gray" type="body" size="medium" weight="normal">
            <Text
              as="span"
              appearance="dark"
              type="body"
              size="medium"
              weight="bold"
            >
              {dataCreditLimitModalEnum.import.i18n[lang]}
            </Text>
            {dataCreditLimitModalEnum.textImport.i18n[lang]}
          </Text>
        </Stack>
      )}
    </BaseModal>
  );
}
