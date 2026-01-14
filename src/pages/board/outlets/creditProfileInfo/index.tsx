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
import { fieldLabelsEnum } from "./config";

import { useEnum } from "@hooks/useEnum";

export const CreditProfileInfo = () => {
  const [requests, setRequests] = useState({} as ICreditRequest);

  const [loading, setLoading] = useState(false);
  const { creditRequestCode } = useParams();

  const navigate = useNavigate();
  const { lang } = useEnum();

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
                      {fieldLabelsEnum.back.i18n[lang]}
                    </Button>
                    <Button
                      spacing="compact"
                      variant="filled"
                      onClick={() => print()}
                    >
                      {fieldLabelsEnum.print.i18n[lang]}
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
                      {fieldLabelsEnum.creditProfile.i18n[lang]}
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
                      {fieldLabelsEnum.creditProfile.i18n[lang]}
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
                    {fieldLabelsEnum.back.i18n[lang]}
                  </Button>
                </StyledNoPrint>
                <Text
                  type="title"
                  size="medium"
                  appearance="gray"
                  weight="bold"
                >
                  {fieldLabelsEnum.creditProfile.i18n[lang]}
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
                    {fieldLabelsEnum.print.i18n[lang]}
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
            isMobile={isMobile}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            creditRequestId={requests.creditRequestId!}
            prospectCode={requests.creditRequestCode!}
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
