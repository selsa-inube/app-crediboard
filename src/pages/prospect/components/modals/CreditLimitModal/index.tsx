import { useEffect, useState, useMemo } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Icon, Stack, Text } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { IPaymentChannel } from "@services/creditRequest/command/types";
import { getGlobalLimitByMoneyDestination } from "@services/creditLimit/getGlobalLimitByMoneyDestination";
import { IMaximumCreditLimitByMoneyDestination } from "@services/creditLimit/types";
import { CreditLimitCard } from "@pages/simulateCredit/CreditLimitCard";
import { IdataMaximumCreditLimitService } from "@pages/simulateCredit/CreditLimitCard/types";
import { get } from "@mocks/utils/dataMock.service";
import { ISourcesOfIncomeState } from "@components/modals/payCapacityModal/types";

import { IIncomeSources } from "../../CreditProspect/types";
import { dataCreditLimitModal } from "./config";

export interface ICreditLimitModalProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  isMobile: boolean;
  moneyDestination: string;
  handleClose: () => void;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
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
    handleClose,
    setRequestValue,
    incomeData
  } = props;
  console.log("******************** ", incomeData);
  useEffect(() => {
    get("mockRequest_value")
      .then((data) => {
        if (data && Array.isArray(data)) {
          setRequestValue(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching money destinations data:", error.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [error, setError] = useState(false);
  const [dataMaximumCreditLimit, setDataMaximumCreditLimit] = useState<
    IMaximumCreditLimitByMoneyDestination[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGlobalLimitByMoneyDestination(
          businessUnitPublicCode,
          businessManagerCode,
          moneyDestination,
          dataMaximumCreditLimitService.identificationDocumentNumber
        );

        if (data) {
          setDataMaximumCreditLimit(data);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchData();
  }, [
    businessUnitPublicCode,
    moneyDestination,
    businessManagerCode,
    dataMaximumCreditLimitService,
  ]);

  const incomeDataExtracted = useMemo(() => {
    if (!incomeData || typeof incomeData !== 'object') {
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
      title={dataCreditLimitModal.warningTitle}
      nextButton={dataCreditLimitModal.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "300px " : "450px"}
      height={isMobile ? "auto" : "377px"}
      finalDivider={true}
    >
      {error ? (
        <Stack direction="column" alignItems="center">
          <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
          <Text size="large" weight="bold" appearance="danger">
            {dataCreditLimitModal.error.title}
          </Text>
          <Text size="small" appearance="dark" textAlign="center">
            {dataCreditLimitModal.error.message}
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" gap="26px">
          <Text appearance="gray" type="body" size="medium" weight="normal">
            {dataCreditLimitModal.warningDescription}
          </Text>
          <Stack
            direction={isMobile ? "column" : "row"}
            gap="24px"
            margin="0 auto"
            padding=" 0px 5px"
          >
            {dataMaximumCreditLimit.map((item, index) => (
              <CreditLimitCard
                key={index}
                creditLineTxt={item.lineOfCredit}
                creditLine={item.creditLimitValue}
                isMobile={isMobile}
                businessUnitPublicCode={businessUnitPublicCode}
                businessManagerCode={businessManagerCode}
                dataMaximumCreditLimitService={dataMaximumCreditLimitService}
                error={error}
                setError={setError}
                incomeData={incomeDataExtracted as ISourcesOfIncomeState}
              />
            ))}
          </Stack>
          <Text appearance="gray" type="body" size="medium" weight="normal">
            <Text
              as="span"
              appearance="dark"
              type="body"
              size="medium"
              weight="bold"
            >
              {dataCreditLimitModal.import}
            </Text>
            {dataCreditLimitModal.textImport}
          </Text>
        </Stack>
      )}
    </BaseModal>
  );
}
