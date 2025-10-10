import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineChevronLeft } from "react-icons/md";
import { Stack, Text, Button, useMediaQuery } from "@inubekit/inubekit";

import { get, getById } from "@mocks/utils/dataMock.service";
import { ICreditRequest } from "@services/creditRequest/query/types";
import { capitalizeFirstLetterEachWord } from "@utils/formatData/text";
import { currencyFormat } from "@utils/formatData/currency";
import { getCreditRequestByCode } from "@services/creditRequest/query/getCreditRequestByCode";
import { AppContext } from "@context/AppContext";

import { CreditBehavior } from "./CreditBehaviorCard";
import { Guarantees } from "./Guarantees";
import { JobStabilityCard } from "./JobStabilityCard";
import { PaymentCapacity } from "./PaymentCapacity";
import { OpenWallet } from "./OpenWallet";
import { RiskScoring } from "./RiskScoring";
import {
  StyledContainerToCenter,
  StyledUl,
  StyledLi,
  StyledPrint,
  StyledNoPrint,
  StyledGridPrint,
  StylePrintListMobile,
  StyledPrintListMobileShow,
} from "./styles";
import { fieldLabels } from "./config";
import { IRiskScoring } from "./RiskScoring/types";

export const CreditProfileInfo = () => {
  const [requests, setRequests] = useState({} as ICreditRequest);
  const [credit_profileInfo, setCredit_profileInfo] = useState({
    company_seniority: 0,
    labor_stability_index: 0,
    max_labor_stability_index: 0,
    estimated_severance: 0,
  });
  const [payment_capacity, setPayment_capacity] = useState({
    available_value: 0,
    base_income: 0,
    percentage_used: 0,
  });

  const [uncovered_wallet, setUncovered_wallet] = useState({
    overdraft_factor: 0,
    discovered_value: 0,
    reciprocity: 0,
  });

  const [dataWereObtained, setWataWereObtained] = useState(false);
  const [dataBehaviorError, setBehaviorError] = useState(false);
  const [dataCreditProfile, setCreditProfile] = useState(false);
  const [dataPaymentcapacity, setPaymentcapacity] = useState(false);
  const [dataUncoveredWallet, setUncoveredWallet] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const isMobile = useMediaQuery("(max-width:880px)");

  useEffect(() => {
    (async () => {
      try {
        const [
          riskScoring,
          credit_profileInfo,
          payment_capacity,
          uncovered_wallet,
          riskScoringMaximum,
        ] = await Promise.allSettled([
          getById<IRiskScoring>("risk-scoring", "credit_request_id", id!, true),
          getById("credit_profileInfo", "credit_request_id", id!, true),
          getById("payment_capacity", "credit_request_id", id!, true),
          getById("credit_behavior", "credit_request_id", id!, true),
          getById("uncovered_wallet", "credit_request_id", id!, true),
          get("range_requered_Business_Unit"),
        ]);

        if (riskScoring.status !== "fulfilled") {
          setWataWereObtained(true);
        }

        if (credit_profileInfo.status === "fulfilled") {
          const creditData = credit_profileInfo.value;
          if (Array.isArray(creditData) && creditData.length > 0) {
            setCredit_profileInfo((prevState) => ({
              ...prevState,
              ...creditData[0].labor_stability,
            }));
          }
        } else {
          setCreditProfile(true);
        }
        if (payment_capacity.status === "fulfilled") {
          const data = payment_capacity.value;
          if (Array.isArray(data) && data.length > 0) {
            setPayment_capacity((prevState) => ({
              ...prevState,
              ...data[0].payment_capacity,
            }));
          }
        } else {
          setPaymentcapacity(true);
        }

        if (uncovered_wallet.status === "fulfilled") {
          const data = uncovered_wallet.value;
          if (Array.isArray(data) && data.length > 0) {
            setUncovered_wallet((prevState) => ({
              ...prevState,
              ...data[0]?.uncovered_wallet,
            }));
          }
        } else {
          setUncoveredWallet(true);
        }
        if (riskScoringMaximum.status === "fulfilled") {
          const data = riskScoringMaximum.value;
          if (Array.isArray(data) && data.length > 0) {
            setUncoveredWallet(false);
          }
        } else {
          setUncoveredWallet(false);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    getCreditRequestByCode(
      businessUnitPublicCode,
      businessManagerCode,
      id!,
      userAccount
    )
      .then((data) => {
        setRequests(data[0] as ICreditRequest);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [
    businessUnitPublicCode,
    id,
    dataWereObtained,
    dataBehaviorError,
    dataCreditProfile,
    dataPaymentcapacity,
    dataUncoveredWallet,
    userAccount,
    businessManagerCode,
  ]);

  return (
    <StyledPrint>
      <StyledContainerToCenter>
        <Stack direction="column">
          <Stack
            justifyContent="space-between"
            alignItems="center"
            margin={!isMobile ? "16px" : "20px 40px"}
            gap="16px"
          >
            {isMobile ? (
              <Stack direction="column" gap="16px" width="100%">
                <StyledNoPrint>
                  <Stack justifyContent="space-between">
                    <Button
                      spacing="compact"
                      variant="outlined"
                      iconBefore={<MdOutlineChevronLeft />}
                      onClick={() => navigate(-1)}
                    >
                      {fieldLabels.back}
                    </Button>
                    <Button
                      spacing="compact"
                      variant="filled"
                      onClick={() => print()}
                    >
                      {fieldLabels.print}
                    </Button>
                  </Stack>
                </StyledNoPrint>
                <StylePrintListMobile>
                  <Stack direction="column" alignItems="center">
                    <Text
                      type="title"
                      size="medium"
                      appearance="gray"
                      weight="bold"
                    >
                      {fieldLabels.creditProfile}
                    </Text>
                    <Text
                      type="title"
                      size="medium"
                      appearance="gray"
                      weight="normal"
                    >
                      {requests.clientName
                        ? capitalizeFirstLetterEachWord(requests.clientName)
                        : ""}
                    </Text>
                    <Text
                      type="title"
                      size="medium"
                      appearance="gray"
                      weight="normal"
                    >
                      {`CC: ${requests.clientIdentificationNumber}`}
                    </Text>
                    <Text
                      type="title"
                      size="medium"
                      appearance="gray"
                      weight="bold"
                    >
                      {currencyFormat(requests.loanAmount)}
                    </Text>
                  </Stack>
                </StylePrintListMobile>
                <StyledPrintListMobileShow>
                  <Stack
                    justifyContent="space-between"
                    alignItems="center"
                    margin={!isMobile ? "16px" : "20px 40px"}
                    gap="16px"
                  >
                    <Text
                      type="title"
                      size="medium"
                      appearance="gray"
                      weight="bold"
                    >
                      {fieldLabels.creditProfile}
                    </Text>
                    <StyledUl>
                      <StyledLi>
                        <Text
                          type="title"
                          size="medium"
                          appearance="gray"
                          weight="normal"
                        >
                          {requests.clientName
                            ? capitalizeFirstLetterEachWord(requests.clientName)
                            : ""}
                        </Text>
                      </StyledLi>
                      <StyledLi>
                        <Text
                          type="title"
                          size="medium"
                          appearance="gray"
                          weight="normal"
                        >
                          {`CC: ${requests.clientIdentificationNumber}`}
                        </Text>
                      </StyledLi>
                    </StyledUl>
                    <Text
                      type="title"
                      size="medium"
                      appearance="gray"
                      weight="bold"
                    >
                      {currencyFormat(requests.loanAmount)}
                    </Text>
                  </Stack>
                </StyledPrintListMobileShow>
              </Stack>
            ) : (
              <>
                <StyledNoPrint>
                  <Button
                    spacing="compact"
                    variant="outlined"
                    iconBefore={<MdOutlineChevronLeft />}
                    onClick={() => navigate(-1)}
                  >
                    {fieldLabels.back}
                  </Button>
                </StyledNoPrint>
                <Text
                  type="title"
                  size="medium"
                  appearance="gray"
                  weight="bold"
                >
                  {fieldLabels.creditProfile}
                </Text>
                <StyledUl>
                  <StyledLi>
                    <Text
                      type="title"
                      size="medium"
                      appearance="gray"
                      weight="normal"
                    >
                      {requests.clientName
                        ? capitalizeFirstLetterEachWord(requests.clientName)
                        : ""}
                    </Text>
                  </StyledLi>
                  <StyledLi>
                    <Text
                      type="title"
                      size="medium"
                      appearance="gray"
                      weight="normal"
                    >
                      {`CC: ${requests.clientIdentificationNumber}`}
                    </Text>
                  </StyledLi>
                </StyledUl>
                <Text
                  type="title"
                  size="medium"
                  appearance="gray"
                  weight="bold"
                >
                  {currencyFormat(requests.loanAmount)}
                </Text>
                <StyledNoPrint>
                  <Button
                    onClick={() => print()}
                    spacing="compact"
                    variant="filled"
                  >
                    {fieldLabels.print}
                  </Button>
                </StyledNoPrint>
              </>
            )}
          </Stack>
        </Stack>
        <StyledGridPrint $isMobile={isMobile}>
          <JobStabilityCard
            companySeniority={credit_profileInfo.company_seniority}
            stabilityIndex={credit_profileInfo.labor_stability_index}
            estimatedCompensation={credit_profileInfo.estimated_severance}
            isMobile={isMobile}
            dataCreditProfile={dataCreditProfile}
            setCreditProfile={setCreditProfile}
            requests={requests}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
          />
          <PaymentCapacity
            availableValue={payment_capacity.available_value}
            availablePercentage={100 - payment_capacity.percentage_used}
            percentageUsed={payment_capacity.percentage_used}
            isMobile={isMobile}
            dataPaymentcapacity={dataPaymentcapacity}
            setPaymentcapacity={setPaymentcapacity}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            customerIdentificationNumber={requests.clientIdentificationNumber}
            setLoading={setLoading}
            loading={loading}
            retryCount={retryCount}
            setRetryCount={setRetryCount}
          />
          <OpenWallet
            overdraftFactor={uncovered_wallet.overdraft_factor}
            valueDiscovered={uncovered_wallet.discovered_value}
            reciprocity={uncovered_wallet.reciprocity}
            isMobile={isMobile}
            dataUncoveredWallet={dataUncoveredWallet}
            setUncoveredWallet={setUncoveredWallet}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            customerIdentificationNumber={requests.clientIdentificationNumber}
            setLoading={setLoading}
            setRetryCount={setRetryCount}
          />
          <RiskScoring
            isMobile={isMobile}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            customerIdentificationNumber={requests.clientIdentificationNumber}
          />
          <Guarantees
            guaranteesRequired="Ninguna garantía real, o fianza o codeudor."
            guaranteesOffered="Ninguna, casa Bogotá 200 mt2, o fianza o codeudor Pedro Pérez."
            guaranteesCurrent="Ninguna, apartamento, en Bogotá 80 mt2, o vehículo Mazda 323."
            isMobile={isMobile}
            dataWereObtained={dataWereObtained}
          />
          <CreditBehavior
            isMobile={isMobile}
            dataBehaviorError={dataBehaviorError}
            setBehaviorError={setBehaviorError}
            businessUnitPublicCode={businessUnitPublicCode}
            customerIdentificationNumber={requests.clientIdentificationNumber}
          />
        </StyledGridPrint>
      </StyledContainerToCenter>
    </StyledPrint>
  );
};
