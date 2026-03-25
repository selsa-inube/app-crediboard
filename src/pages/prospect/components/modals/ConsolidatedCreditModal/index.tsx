import { useState, useEffect, useRef, useMemo } from "react";
import {
  Text,
  Stack,
  Grid,
  Divider,
  useMediaQuery,
  Button,
  useFlag,
  Icon,
} from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { BaseModal } from "@components/modals/baseModal";
import { IProspect } from "@services/creditRequest/query/ProspectByCode/types";
import { getCreditPayments } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment";
import { IPayment } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { paymentOptionValues } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { IConsolidatedCredit } from "@services/creditRequest/query/ProspectByCode/types";
import { EnumType } from "@hooks/useEnum";
import { ICrediboardData } from "@context/AppContext/types";
import { InvestmentCreditCard } from "@components/cards/InvestmentCreditCard";
import { CardConsolidatedCredit } from "@components/cards/CardConsolidatedCredit";
import { updateConsolidatedCredits } from "@services/creditRequest/updateConsolidatedCredits";

import { ScrollableContainer } from "./styles";
import { feedback, ModalConfig } from "./config";
import { ICustomerData } from "../../AddProductModal/config";
import { MdOutlineInfo } from "react-icons/md";

export interface ConsolidatedCreditsProps {
  handleClose: () => void;
  businessUnitPublicCode: string;
  custumerData: ICustomerData;
  businessManagerCode: string;
  loading?: boolean;
  prospectData?: IProspect;
  setConsolidatedCredits: React.Dispatch<
    React.SetStateAction<IConsolidatedCredit[]>
  >;
  consolidatedCredits: IConsolidatedCredit[];
  lang: EnumType;
  handleInfo: () => void;
  availableEditCreditRequest: boolean;
  eventData: ICrediboardData;
  showEdit?: boolean;
  onProspectRefreshData?: () => void;
}

export function ConsolidatedCredits(props: ConsolidatedCreditsProps) {
  const {
    handleClose,
    prospectData,
    businessUnitPublicCode,
    businessManagerCode,
    lang,
    setConsolidatedCredits,
    consolidatedCredits,
    showEdit = true,
    onProspectRefreshData,
    eventData,
    custumerData,
    availableEditCreditRequest,
    handleInfo,
  } = props;
  const isMobile = useMediaQuery("(max-width:880px)");

  const [editOpen, setEditOpen] = useState(true);
  const [obligationPayment, setObligationPayment] = useState<IPayment[] | null>(
    null,
  );
  const [isLoading, setLoading] = useState(false);
  const [sortedObligationPayment, setSortedObligationPayment] = useState<
    IPayment[]
  >([]);

  const [totalCollected, setTotalCollected] = useState(0);
  const initialConsolidatedCreditsRef = useRef<IConsolidatedCredit[]>([]);
  const isInitializedRef = useRef(false);

  const { addFlag } = useFlag();

  const fetchDataObligationPayment = async () => {
    if (!custumerData.clientIdinteficationNumber) {
      return;
    }
    try {
      const data = await getCreditPayments(
        custumerData.clientIdinteficationNumber,
        businessUnitPublicCode,
        businessManagerCode,
        eventData.token,
      );
      setObligationPayment(data ?? null);
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");

      addFlag({
        title: feedback.fetchDataObligationPayment.title.i18n[lang],
        description:
          description ||
          feedback.fetchDataObligationPayment.description.i18n[lang],
        appearance: "danger",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (
      !isInitializedRef.current &&
      consolidatedCredits &&
      consolidatedCredits.length >= 0
    ) {
      initialConsolidatedCreditsRef.current = JSON.parse(
        JSON.stringify(consolidatedCredits),
      );

      let sumOfInitialsConsolidatedCredit = 0;
      for (const credit of consolidatedCredits) {
        sumOfInitialsConsolidatedCredit += credit.consolidatedAmount;
      }
      setTotalCollected(sumOfInitialsConsolidatedCredit);

      isInitializedRef.current = true;
    }
  }, [consolidatedCredits]);

  const initialValuesMap = consolidatedCredits.reduce(
    (acc, credit) => {
      acc[credit.creditProductCode] = {
        amount: credit.consolidatedAmount,
        type: credit.consolidatedAmountType,
      };
      return acc;
    },
    {} as Record<string, { amount: number; type: string }>,
  );

  useEffect(() => {
    fetchDataObligationPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      obligationPayment &&
      obligationPayment.length > 0 &&
      sortedObligationPayment.length === 0
    ) {
      const sorted = [...obligationPayment].sort((a, b) => {
        const aHasValue = (initialValuesMap[a.id]?.amount || 0) > 0;
        const bHasValue = (initialValuesMap[b.id]?.amount || 0) > 0;

        if (aHasValue && !bHasValue) return -1;

        if (!aHasValue && bHasValue) return 1;
        return 0;
      });

      setSortedObligationPayment(sorted);
    }
  }, [obligationPayment, initialValuesMap, sortedObligationPayment.length]);

  const handleUpdateTotal = (
    oldValue: number,
    newValue: number,
    label?: string,
    code?: string,
    id?: string,
    title?: string,
    selectedDate?: Date,
  ) => {
    setTotalCollected((prevTotal) => prevTotal - oldValue + newValue);

    setConsolidatedCredits((prev) => {
      const existingCreditIndex = prev.findIndex(
        (credit) => credit.creditProductCode === code,
      );

      if (newValue === 0) {
        if (existingCreditIndex !== -1) {
          const wasInitiallySelected =
            initialConsolidatedCreditsRef.current.some(
              (credit) => credit.creditProductCode === code,
            );

          if (!wasInitiallySelected) {
            return prev.filter((credit) => credit.creditProductCode !== code);
          }

          return prev.map((credit, index) =>
            index === existingCreditIndex
              ? {
                  ...credit,
                  consolidatedAmount: 0,
                  consolidatedAmountType:
                    label || credit.consolidatedAmountType,
                  estimatedDateOfConsolidation:
                    selectedDate || credit.estimatedDateOfConsolidation,
                }
              : credit,
          );
        }
        return prev;
      }

      if (existingCreditIndex !== -1) {
        return prev.map((credit, index) =>
          index === existingCreditIndex
            ? {
                ...credit,
                consolidatedAmount: newValue,
                consolidatedAmountType: label || credit.consolidatedAmountType,
                lineOfCreditDescription:
                  title || credit.lineOfCreditDescription,
                borrowerIdentificationNumber:
                  id || credit.borrowerIdentificationNumber,
                estimatedDateOfConsolidation:
                  selectedDate || credit.estimatedDateOfConsolidation,
              }
            : credit,
        );
      }

      if (code && newValue > 0) {
        return [
          ...prev,
          {
            creditProductCode: code,
            consolidatedAmount: newValue,
            consolidatedAmountType: label || "",
            estimatedDateOfConsolidation: selectedDate || new Date(),
            lineOfCreditDescription: title || "",
            borrowerIdentificationType: code,
            borrowerIdentificationNumber: id || "",
          },
        ];
      }

      return prev;
    });
  };
  const handleRemoveCredit = (code: string) => {
    setConsolidatedCredits((prev) => {
      const updated = prev.filter((item) => item.creditProductCode !== code);

      return updated;
    });
  };

  const hasRealChanges = useMemo(() => {
    if (!isInitializedRef.current) {
      return false;
    }

    const initialCredits = initialConsolidatedCreditsRef.current;

    if (initialCredits.length === 0 && consolidatedCredits.length === 0) {
      return false;
    }

    if (consolidatedCredits.length !== initialCredits.length) {
      return true;
    }

    const currentMap = new Map(
      consolidatedCredits.map((credit) => [
        credit.creditProductCode,
        {
          amount: credit.consolidatedAmount,
          type: credit.consolidatedAmountType,
        },
      ]),
    );

    const initialMap = new Map(
      initialCredits.map((credit) => [
        credit.creditProductCode,
        {
          amount: credit.consolidatedAmount,
          type: credit.consolidatedAmountType,
        },
      ]),
    );

    for (const code of currentMap.keys()) {
      if (!initialMap.has(code)) {
        return true;
      }
    }

    for (const code of initialMap.keys()) {
      if (!currentMap.has(code)) {
        return true;
      }
    }

    for (const [code, currentCredit] of currentMap) {
      const initialCredit = initialMap.get(code);

      if (!initialCredit) {
        return true;
      }

      if (
        currentCredit.amount !== initialCredit.amount ||
        currentCredit.type !== initialCredit.type
      ) {
        return true;
      }
    }

    return false;
  }, [consolidatedCredits]);

  const handleSaveChanges = async () => {
    if (!prospectData?.prospectId) {
      return;
    }

    try {
      setLoading(true);

      await updateConsolidatedCredits(
        businessUnitPublicCode,
        prospectData.prospectId,
        consolidatedCredits,
        eventData.token,
        eventData.user.identificationDocumentNumber || "",
      );

      if (onProspectRefreshData) {
        onProspectRefreshData();
      }

      handleClose();

      addFlag({
        title: feedback.handleSaveChanges.success.title.i18n[lang],
        description: feedback.handleSaveChanges.success.description.i18n[lang],
        appearance: "success",
        duration: 4000,
      });
      setLoading(false);
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");
      setLoading(false);
      addFlag({
        title: feedback.handleSaveChanges.error.title.i18n[lang],
        description:
          description ||
          feedback.handleSaveChanges.error.description.i18n[lang],
        appearance: "danger",
        duration: 5000,
      });
    }
  };

  return (
    <BaseModal
      title={ModalConfig.title.i18n[lang]}
      nextButton={
        showEdit ? ModalConfig.keep.i18n[lang] : ModalConfig.close.i18n[lang]
      }
      disabledNext={showEdit ? !hasRealChanges : false}
      handleNext={showEdit ? handleSaveChanges : handleClose}
      width={isMobile ? "300px" : "640px"}
      height={isMobile ? "auto" : "688px"}
      handleBack={handleClose}
      finalDivider={true}
      backButton={showEdit ? ModalConfig.close.i18n[lang] : undefined}
      isLoading={isLoading}
    >
      <Stack direction="column" gap="24px">
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems="center"
          justifyContent={isMobile ? "center" : "space-between"}
          gap={isMobile ? "10px" : "0px"}
        >
          <Stack direction="column">
            <Text
              appearance="primary"
              weight="bold"
              type="headline"
              size="large"
            >
              ${currencyFormat(totalCollected, false)}
            </Text>
            <Text
              type="body"
              appearance="gray"
              size="small"
              textAlign="center"
            ></Text>
          </Stack>
          <Stack
            direction="row"
            gap="8px"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            width={isMobile ? "100%" : "auto"}
          >
            {showEdit && (
              <Button
                onClick={() => setEditOpen(false)}
                variant="outlined"
                appearance="primary"
                spacing="wide"
                fullwidth={isMobile}
                disabled={!editOpen || availableEditCreditRequest}
              >
                {ModalConfig.edit.i18n[lang]}
              </Button>
            )}
            {availableEditCreditRequest && (
              <Icon
                icon={<MdOutlineInfo />}
                appearance="primary"
                size="16px"
                cursorHover
                onClick={handleInfo}
              />
            )}
          </Stack>
        </Stack>
        <Divider dashed />
        <ScrollableContainer>
          <Stack
            direction="column"
            gap="16px"
            height={isMobile ? "auto" : "420px"}
            padding="0px 0px 0px 2px"
            margin="0 10px 0 0"
          >
            {editOpen ? (
              <>
                <Text type="body" appearance="gray" size="small" weight="bold">
                  {ModalConfig.selectedText.i18n[lang]}
                </Text>
                <Grid
                  autoRows="auto"
                  templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                  gap="16px"
                  width={consolidatedCredits.length === 0 ? "100%" : "0%"}
                >
                  {consolidatedCredits.length === 0 && (
                    <Text type="body" size="small">
                      {ModalConfig.noSelected.i18n[lang]}
                    </Text>
                  )}
                  {consolidatedCredits.map((item) => (
                    <InvestmentCreditCard
                      codeValue={item.creditProductCode}
                      expired={ModalConfig.terminated.i18n[lang]}
                      expiredValue={item.consolidatedAmount}
                      title={item.lineOfCreditDescription}
                      lang={lang}
                    />
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <Text type="body" appearance="gray" size="small" weight="bold">
                  {ModalConfig.newObligations.i18n[lang]}
                </Text>
                <Grid
                  autoRows="auto"
                  templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                  gap="16px"
                  width="100%"
                  margin="0 20px 0 0"
                >
                  {sortedObligationPayment.length === 0 && (
                    <Text type="body" size="small">
                      {ModalConfig.newObligationsEmpty.i18n[lang]}
                    </Text>
                  )}
                  {sortedObligationPayment.map((creditData) => (
                    <CardConsolidatedCredit
                      key={creditData.id}
                      title={creditData.title}
                      code={creditData.id}
                      expiredValue={
                        creditData.options.find(
                          (option) =>
                            option.label === paymentOptionValues.EXPIREDVALUE,
                        )?.value ?? 0
                      }
                      nextDueDate={
                        creditData.options.find(
                          (option) =>
                            option.label === paymentOptionValues.NEXTVALUE,
                        )?.value ?? 0
                      }
                      fullPayment={
                        creditData.options.find(
                          (option) =>
                            option.label === paymentOptionValues.TOTALVALUE,
                        )?.value ?? 0
                      }
                      description={
                        creditData.options.find(
                          (option) =>
                            option.description ===
                            paymentOptionValues.INMEDIATE,
                        )?.description ?? ""
                      }
                      date={
                        creditData.options.find((option) => option.date)
                          ?.date ?? new Date()
                      }
                      onUpdateTotal={(
                        oldValue,
                        newValue,
                        label,
                        title,
                        selectedDate,
                      ) =>
                        handleUpdateTotal(
                          oldValue,
                          newValue,
                          label,
                          creditData.id,
                          creditData.id,
                          title,
                          selectedDate,
                        )
                      }
                      tags={creditData.tags}
                      initialValue={
                        initialValuesMap[creditData.id]?.amount || 0
                      }
                      isMobile={isMobile}
                      allowCustomValue={creditData.allowCustomValue}
                      initialType={initialValuesMap[creditData.id]?.type}
                      handleRemoveCredit={handleRemoveCredit}
                      lang={lang}
                    />
                  ))}
                </Grid>
                <Text type="body" appearance="gray" size="small" weight="bold">
                  {ModalConfig.selectedText.i18n[lang]}
                </Text>
                <Grid
                  autoRows="auto"
                  templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                  gap="16px"
                  width="100%"
                >
                  {consolidatedCredits.length === 0 && (
                    <Text type="body" size="small">
                      {ModalConfig.noSelected.i18n[lang]}
                    </Text>
                  )}
                  {consolidatedCredits.map((item) => (
                    <InvestmentCreditCard
                      codeValue={item.creditProductCode}
                      expired={ModalConfig.terminated.i18n[lang]}
                      expiredValue={item.consolidatedAmount}
                      title={item.lineOfCreditDescription}
                      lang={lang}
                    />
                  ))}
                </Grid>
              </>
            )}
          </Stack>
        </ScrollableContainer>
      </Stack>
    </BaseModal>
  );
}
