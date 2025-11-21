import { MdOutlinePaid } from "react-icons/md";
import { useEffect, useState } from "react";
import { Stack, Text } from "@inubekit/inubekit";

import { CardInfoContainer } from "@components/cards/CardInfoContainer";
import { StyledDivider } from "@components/cards/SummaryCard/styles";
import { currencyFormat } from "@utils/formatData/currency";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import userNotFound from "@assets/images/ItemNotFound.png";
import { getPaymentCapacityById } from "@services/creditProfiles/GetPaymentCapacityById";
import { IPaymentCapacityById } from "@services/creditProfiles/types";
import { ErrorModal } from "@components/modals/ErrorModal";
import { ICreditRequest } from "@services/creditRequest/query/types";

import { dataPaymentCapacity } from "./config";

interface PaymentCapacityProps {
  isMobile?: boolean;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  requests: ICreditRequest;
  maxRetries?: number;
  retryDelay?: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export function PaymentCapacity(props: PaymentCapacityProps) {
  const {
    isMobile,
    businessUnitPublicCode,
    businessManagerCode,
    requests,
    maxRetries = 2,
    retryDelay = 2000,
    setLoading,
  } = props;

  const [data, setData] = useState<IPaymentCapacityById | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentRequestId, setCurrentRequestId] = useState(0);

  const getMainGap = () => (isMobile ? "4px" : "16px");

  const fetchPaymentCapacity = async (
    currentRetryCount = 0,
    requestId = currentRequestId + 1
  ) => {
    if (!requests.clientIdentificationNumber) return;

    setCurrentRequestId(requestId);

    try {
      setLoading(true);

      const response = await getPaymentCapacityById(
        businessUnitPublicCode,
        businessManagerCode,
        requests.clientIdentificationNumber
      );

      if (requestId !== currentRequestId + 1) return;

      setData(response);
      setShowErrorModal(false);
      setIsInitialLoad(false);
    } catch (error) {
      if (requestId !== currentRequestId + 1) return;
      if (data) return;

      if (isInitialLoad && currentRetryCount < maxRetries) {
        const nextId = requestId + 1;
        setTimeout(() => {
          fetchPaymentCapacity(currentRetryCount + 1, nextId);
        }, retryDelay);
      } else {
        setShowErrorModal(true);
        setMessageError(dataPaymentCapacity.modalError);
        setIsInitialLoad(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setData(null);
    fetchPaymentCapacity(0);
  };

  useEffect(
    () => {
      fetchPaymentCapacity(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      businessUnitPublicCode,
      requests.clientIdentificationNumber,
      businessManagerCode,
    ]
  );

  const availablePercentageDecimal = data?.availablePaymentPercentageRate ?? 0;
  const availablePercentage = availablePercentageDecimal * 100;
  const calculatedPercentageUsed = 100 - availablePercentage;

  return (
    <CardInfoContainer
      title={dataPaymentCapacity.cardTitle}
      icon={<MdOutlinePaid />}
      isMobile={isMobile}
    >
      {!data ? (
        <ItemNotFound
          image={userNotFound}
          title={dataPaymentCapacity.itemNotFoundTitle}
          description={dataPaymentCapacity.itemNotFoundDescription}
          buttonDescription={dataPaymentCapacity.itemNotFoundButton}
          route="#"
          onRetry={handleRetry}
        />
      ) : (
        <Stack direction="column" gap={getMainGap()}>
          <Stack alignItems="center" gap="32px">
            <Stack width="110px">
              <Text size={isMobile ? "small" : "medium"}>
                {dataPaymentCapacity.availableValueLabel}
              </Text>
            </Stack>
            <Stack>
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {currencyFormat(Math.round(data.availableMonthlyPayment))}
              </Text>
            </Stack>
          </Stack>

          <StyledDivider />

          <Stack alignItems="center" gap="32px">
            <Stack width="110px">
              <Text size={isMobile ? "small" : "medium"}>
                {dataPaymentCapacity.availablePercentageLabel}
              </Text>
            </Stack>
            <Stack>
              <Stack alignItems="center" gap="8px">
                <Text
                  appearance="primary"
                  type="headline"
                  size={isMobile ? "small" : "medium"}
                >
                  {availablePercentage.toFixed(4)}%
                </Text>
                <Text size={isMobile ? "small" : "medium"}>
                  {dataPaymentCapacity.incomeLabel}{" "}
                  {currencyFormat(Math.round(data.totalMonthlyIncome))}
                </Text>
              </Stack>
            </Stack>
          </Stack>

          <StyledDivider />

          <Stack gap={"32px"}>
            <Stack width="110px">
              <Text size={isMobile ? "small" : "medium"}>
                {dataPaymentCapacity.usedPercentageLabel}
              </Text>
            </Stack>
            <Stack>
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {calculatedPercentageUsed.toFixed(4)} %
              </Text>
            </Stack>
          </Stack>
        </Stack>
      )}
      <>
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
