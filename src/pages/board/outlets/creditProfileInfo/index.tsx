import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineChevronLeft } from "react-icons/md";
import { Stack, Text, Button, useMediaQuery } from "@inubekit/inubekit";

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

export const CreditProfileInfo = () => {
  const [requests, setRequests] = useState({} as ICreditRequest);

  const [loading, setLoading] = useState(false);
  const { creditRequestCode } = useParams();

  const navigate = useNavigate();

  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const isMobile = useMediaQuery("(max-width:880px)");

  useEffect(() => {
    if (
      !businessUnitPublicCode &&
      !businessManagerCode &&
      !creditRequestCode &&
      !userAccount
    )
      return;
    getCreditRequestByCode(
      businessUnitPublicCode,
      businessManagerCode,
      creditRequestCode!,
      eventData.user.identificationDocumentNumber || ""
    )
      .then((data) => {
        setRequests(data[0] as ICreditRequest);
      })
      .catch((error) => {
        console.error(error);
      });
    //eslint-disable-next-line
  }, [
    businessUnitPublicCode,
    creditRequestCode,
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
            isMobile={isMobile}
            requests={requests}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
          />
          <PaymentCapacity
            isMobile={isMobile}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            requests={requests}
            setLoading={setLoading}
            loading={loading}
          />
          <OpenWallet
            isMobile={isMobile}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            requests={requests}
            setLoading={setLoading}
          />
          <RiskScoring
            isMobile={isMobile}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            requests={requests}
          />
          <Guarantees
            guaranteesRequired="Ninguna garantía real, o fianza o codeudor."
            guaranteesOffered="Ninguna, casa Bogotá 200 mt2, o fianza o codeudor Pedro Pérez."
            guaranteesCurrent="Ninguna, apartamento, en Bogotá 80 mt2, o vehículo Mazda 323."
            isMobile={isMobile}
          />
          <CreditBehavior
            isMobile={isMobile}
            businessUnitPublicCode={businessUnitPublicCode}
            requests={requests}
          />
        </StyledGridPrint>
      </StyledContainerToCenter>
    </StyledPrint>
  );
};
