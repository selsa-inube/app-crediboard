import { MdOutlineRequestQuote } from "react-icons/md";
import { useEffect, useState } from "react";
import { Stack, Text } from "@inubekit/inubekit";

import { CardInfoContainer } from "@components/cards/CardInfoContainer";
import { StyledDivider } from "@components/cards/SummaryCard/styles";
import { currencyFormat } from "@utils/formatData/currency";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import userNotFound from "@assets/images/ItemNotFound.png";
import { getUnconveredPortfolio } from "@services/creditProfiles/GetUnconveredPortfolio";
import { ErrorModal } from "@components/modals/ErrorModal";
import { IUncoveredPortfolio } from "@services/creditProfiles/types";
import { ICreditRequest } from "@services/creditRequest/query/types";

import { dataOpenWallet } from "./config";

interface OpenWalletProps {
  overdraftFactor?: number;
  isMobile?: boolean;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  requests: ICreditRequest;
  maxRetries?: number;
  retryDelay?: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function OpenWallet(props: OpenWalletProps) {
  const {
    isMobile,
    businessUnitPublicCode,
    businessManagerCode,
    requests,
    maxRetries = 2,
    retryDelay = 2000,
    setLoading,
  } = props;

  const [data, setData] = useState<IUncoveredPortfolio | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentRequestId, setCurrentRequestId] = useState(0);

  const fetchPaymentCapacity = async (
    currentRetryCount = 0,
    requestId = currentRequestId + 1
  ) => {
    setCurrentRequestId(requestId);

    try {
      setLoading(true);

      const response = await getUnconveredPortfolio(
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
        setMessageError(dataOpenWallet.modalError);
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

  useEffect(() => {
    if (!requests.clientIdentificationNumber) return;
    fetchPaymentCapacity(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    businessUnitPublicCode,
    requests.clientIdentificationNumber,
    businessManagerCode,
  ]);

  return (
    <CardInfoContainer
      title={dataOpenWallet.title}
      icon={<MdOutlineRequestQuote />}
      isMobile={isMobile}
    >
      {!data ? (
        <ItemNotFound
          image={userNotFound}
          title={dataOpenWallet.itemNotFound.title}
          description={dataOpenWallet.itemNotFound.description}
          buttonDescription={dataOpenWallet.itemNotFound.buttonDescription}
          route="#"
          onRetry={handleRetry}
        />
      ) : (
        <Stack direction="column" gap={isMobile ? "6px" : "16px"}>
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "110px" : "150px"}>
              <Text size={isMobile ? "small" : "medium"}>
                {dataOpenWallet.labels.overdraftFactor}
              </Text>
            </Stack>
            <Stack alignItems="center" gap="8px">
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {Math.round(data.reciprocityRatio)}
              </Text>
              <Text size={isMobile ? "small" : "medium"}>
                {dataOpenWallet.labels.overdraftFactorSuffix}
              </Text>
            </Stack>
          </Stack>

          <StyledDivider />
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "110px" : "150px"}>
              <Text size={isMobile ? "small" : "medium"}>
                {dataOpenWallet.labels.valueDiscovered}
              </Text>
            </Stack>
            <Text
              appearance="primary"
              type="headline"
              size={isMobile ? "small" : "medium"}
            >
              {currencyFormat(Math.round(data.permanentDeposits))}
            </Text>
          </Stack>

          <StyledDivider />
          <Stack alignItems="center" gap="32px">
            <Stack width={isMobile ? "120px" : "150px"}>
              <Text size={isMobile ? "small" : "medium"}>
                {dataOpenWallet.labels.reciprocity}
              </Text>
            </Stack>
            <Stack alignItems="center" gap="8px">
              <Text
                appearance="primary"
                type="headline"
                size={isMobile ? "small" : "medium"}
              >
                {Math.round(data.reciprocityRatio)}
              </Text>
              <Text size={isMobile ? "small" : "medium"}>
                {dataOpenWallet.labels.reciprocitySuffix}
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
