import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineChevronLeft } from "react-icons/md";
import { Stack, Text, Button, useMediaQuery } from "@inubekit/inubekit";

import { get, getById } from "@mocks/utils/dataMock.service";
import { ICreditRequest, IRiskScoring } from "@services/types";
import { capitalizeFirstLetterEachWord } from "@utils/formatData/text";
import { currencyFormat } from "@utils/formatData/currency";
import { getCreditRequestByCode } from "@services/credit-request/query/getCreditRequestByCode";
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
} from "./styles";
import { fieldLabels } from "./config";

export const CreditProfileInfo = () => {
  const [requests, setRequests] = useState({} as ICreditRequest);
  const [riskScoring, setRiskScoring] = useState<IRiskScoring["risk_scoring"]>({
    total_score: 0,
    minimum_score: 0,
    seniority: 0,
    seniority_score: 0,
    risk_center: 0,
    risk_center_score: 0,
    job_stability_index: 0,
    job_stability_index_score: 0,
    marital_status: "",
    marital_status_score: 0,
    economic_activity: "",
    economic_activity_score: 0,
  });
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
  const [credit_behavior, setCredit_behavior] = useState({
    core_risk_score: 0,
    central_risk_score_date: 0,
    number_of_internal_arrears: 0,
    maximum_number_of_installments_in_arrears: 0,
  });
  const [uncovered_wallet, setUncovered_wallet] = useState({
    overdraft_factor: 0,
    discovered_value: 0,
    reciprocity: 0,
  });

  const [riskScoringMax, setRiskScoringMax] = useState({
    seniority_score: 0,
    risk_center_score: 0,
    job_stability_index_score: 0,
    marital_status_score: 0,
    economic_activity_score: 0,
  });

  const [loading, setLoading] = useState(false);
  const [dataWereObtained, setWataWereObtained] = useState(false);
  const [dataBehaviorError, setBehaviorError] = useState(false);
  const [dataCreditProfile, setCreditProfile] = useState(false);
  const [dataPaymentcapacity, setPaymentcapacity] = useState(false);
  const [dataUncoveredWallet, setUncoveredWallet] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const isMobile = useMediaQuery("(max-width:880px)");

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const [
          riskScoring,
          credit_profileInfo,
          payment_capacity,
          credit_behavior,
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

        if (
          riskScoring.status === "fulfilled" &&
          Array.isArray(riskScoring.value)
        ) {
          const [riskScoringData] = riskScoring.value;

          setRiskScoring((prev) => ({
            ...prev,
            ...riskScoringData?.risk_scoring,
          }));
        } else {
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

        if (credit_behavior.status === "fulfilled") {
          const data = credit_behavior.value;
          if (Array.isArray(data) && data.length > 0) {
            setCredit_behavior((prevState) => ({
              ...prevState,
              ...data[0].credit_behavior,
            }));
          }
        } else {
          setBehaviorError(true);
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
            setRiskScoringMax((prevState) => ({
              ...prevState,
              ...data[0],
            }));
          }
        } else {
          setUncoveredWallet(false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    getCreditRequestByCode(businessUnitPublicCode, id!)
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
                    <Button spacing="compact" variant="filled">
                      {fieldLabels.print}
                    </Button>
                  </Stack>
                </StyledNoPrint>
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
          />
          <PaymentCapacity
            availableValue={payment_capacity.available_value}
            availablePercentage={100 - payment_capacity.percentage_used}
            incomeB={payment_capacity.base_income}
            percentageUsed={payment_capacity.percentage_used}
            isMobile={isMobile}
            dataPaymentcapacity={dataPaymentcapacity}
            setPaymentcapacity={setPaymentcapacity}
          />
          <OpenWallet
            overdraftFactor={uncovered_wallet.overdraft_factor}
            valueDiscovered={uncovered_wallet.discovered_value}
            reciprocity={uncovered_wallet.reciprocity}
            isMobile={isMobile}
            dataUncoveredWallet={dataUncoveredWallet}
            setUncoveredWallet={setUncoveredWallet}
          />
          <RiskScoring
            totalScore={riskScoring.total_score}
            minimumScore={riskScoring.minimum_score}
            seniority={riskScoring.seniority}
            seniorityScore={riskScoring.seniority_score}
            riskCenter={riskScoring.risk_center}
            riskCenterScore={riskScoring.risk_center_score}
            jobStabilityIndex={riskScoring.job_stability_index}
            jobStabilityIndexScore={riskScoring.job_stability_index_score}
            maritalStatusScore={riskScoring.marital_status_score}
            economicActivityScore={riskScoring.economic_activity_score}
            maritalStatus={riskScoring.marital_status}
            economicActivity={riskScoring.economic_activity}
            isLoading={loading}
            isMobile={isMobile}
            dataWereObtained={Object.keys(riskScoring).length === 0}
            dataRiskScoringMax={riskScoringMax}
            setWataWereObtained={setWataWereObtained}
          />
          <Guarantees
            guaranteesRequired="Ninguna garantía real, o fianza o codeudor."
            guaranteesOffered="Ninguna, casa Bogotá 200 mt2, o fianza o codeudor Pedro Pérez."
            guaranteesCurrent="Ninguna, apartamento, en Bogotá 80 mt2, o vehículo Mazda 323."
            isMobile={isMobile}
            dataWereObtained={dataWereObtained}
          />
          <CreditBehavior
            centralScoreRisky={credit_behavior.core_risk_score}
            centralScoreDate={String(credit_behavior.central_risk_score_date)}
            numberInternalBlackberries={
              credit_behavior.number_of_internal_arrears
            }
            maximumNumberInstallmentsArrears={
              credit_behavior.maximum_number_of_installments_in_arrears
            }
            isMobile={isMobile}
            dataBehaviorError={dataBehaviorError}
            setBehaviorError={setBehaviorError}
          />
        </StyledGridPrint>
      </StyledContainerToCenter>
    </StyledPrint>
  );
};
