import { useContext, useEffect, useState } from "react";
import { FormikValues } from "formik";
import {
  Stack,
  Divider,
  useMediaQuery,
  SkeletonLine,
} from "@inubekit/inubekit";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { CreditProductCard } from "@components/cards/CreditProductCard";
import { NewCreditProductCard } from "@components/cards/CreditProductCard/newCard";
import { ErrorModal } from "@components/modals/ErrorModal";
import { CardValues } from "@components/cards/cardValues";
import { DeleteModal } from "@components/modals/DeleteModal";
import { ConsolidatedCredits } from "@pages/prospect/components/modals/ConsolidatedCreditModal";
import { DeductibleExpensesModal } from "@pages/prospect/components/modals/DeductibleExpensesModal";
import {
  IProspect,
  ICreditProduct,
  IProspectSummaryById,
} from "@services/creditRequest/query/ProspectByCode/types";
import { AppContext } from "@context/AppContext";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { StyledCreditProductCard } from "@components/cards/CreditProductCard/styles";
import { IAllEnumsResponse } from "@services/enumerators/types";
import { capitalizeFirstLetter } from "@utils/formatData/text";
import { EnumType } from "@hooks/useEnum";
import { RemoveCreditProduct } from "@services/creditRequest/command/removeCreditProduct";
import { updateCreditProduct } from "@services/creditRequest/updateCreditProduct";
import { documentClientNumber } from "@utils/documentClientNumber";
import { optionsDisableStage } from "@config/privilege";
import { areValuesEqual } from "@pages/prospect/components/modals/ProspectProductModal/utils";
import { getSearchProspectSummaryById } from "@services/creditRequest/query/ProspectSummaryById";
import { getAllDeductibleExpensesById } from "@services/creditRequest/query/deductibleExpenses";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { EditProductModal } from "@pages/prospect/components/modals/ProspectProductModal";

import {
  paymentCycleMap,
  privilegeCrediboard,
  SummaryProspectCredit,
  tittleOptions,
} from "./config/config";
import { IUpdateCreditProductPayload } from "../types";
import {
  StyledCardsCredit,
  StyledPrint,
  StyledPrintCardProspect,
  StylePrintCardSummary,
} from "./styles";
interface CardCommercialManagementProps {
  id: string;
  dataRef: React.RefObject<HTMLDivElement>;
  lang: EnumType;
  enums: IAllEnumsResponse;
  onClick: () => void;
  setShowMessageSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  prospectSummaryData?: IProspectSummaryById;
  setProspectSummaryData?: React.Dispatch<
    React.SetStateAction<IProspectSummaryById>
  >;
  setGeneralLoading: React.Dispatch<React.SetStateAction<boolean>>;
  creditRequestCode: string | undefined;
  generalLoading: boolean;
  availableEditCreditRequest: boolean;
  prospectData?: IProspect;
  showAddProduct?: boolean;
  refreshProducts?: () => void;
  onProspectUpdate?: (prospect: IProspect) => void;
  onProspectRefreshData?: () => void;
  fetchProspectData?: () => Promise<void>;
  disableAddProduct?: boolean;
}

export const CardCommercialManagement = (
  props: CardCommercialManagementProps,
) => {
  const {
    dataRef,
    onClick,
    prospectData,
    showAddProduct = true,
    lang,
    enums,
    availableEditCreditRequest,
    prospectSummaryData,
    setProspectSummaryData,
    creditRequestCode,
    setShowMessageSuccessModal,
    onProspectRefreshData,
    fetchProspectData,
    disableAddProduct = false,
    setGeneralLoading,
    generalLoading,
  } = props;

  const [prospectProducts, setProspectProducts] = useState<ICreditProduct[]>(
    [],
  );

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.publicCode;

  const [isProcessingServices, setIsProcessingServices] =
    useState<boolean>(false);
  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const currentModal = modalHistory[modalHistory.length - 1];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ICreditProduct | null>(
    null,
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const [showConsolidatedModal, setShowConsolidatedModal] = useState(false);
  const [consolidatedCredits, setConsolidatedCredits] = useState(
    prospectData?.consolidatedCredits || [],
  );
  const [showDeductibleExpensesModal, setDeductibleExpensesModal] =
    useState(false);
  const [deductibleExpenses, setDeductibleExpenses] = useState<
    { expenseName: string; expenseValue: number }[]
  >([]);
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (prospectData?.creditProducts) {
      setProspectProducts(prospectData?.creditProducts);
    }
  }, [prospectData]);

  useEffect(() => {
    if (prospectData?.consolidatedCredits) {
      setConsolidatedCredits(prospectData.consolidatedCredits);
    }
  }, [prospectData?.consolidatedCredits]);

  const isMobile = useMediaQuery("(max-width: 800px)");

  const handleDelete = async () => {
    if (!prospectData || !prospectProducts.length) return;
    try {
      setGeneralLoading(true);

      await RemoveCreditProduct(
        businessUnitPublicCode,
        businessManagerCode,
        {
          creditProductCode: selectedProductId,
          creditRequestCode: creditRequestCode || "",
        },
        eventData.token,
      );

      try {
        fetchProspectData && (await fetchProspectData());
      } catch (error) {
        const err = error as {
          message?: string;
          status: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + err?.message + (err?.data?.description || "");

        setShowErrorModal(true);
        setGeneralLoading(false);
        setMessageError(description);
      }

      setGeneralLoading(false);
      setShowDeleteModal(false);
      setShowMessageSuccessModal(true);
    } catch (error) {
      setShowDeleteModal(false);
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal(true);
      setGeneralLoading(false);
      setMessageError(tittleOptions.errorDelete || description);
    }
  };
  const handleConfirm = async (values: FormikValues) => {
    if (!prospectData || !selectedProduct) return;

    try {
      setIsProcessingServices(true);

      const payload: IUpdateCreditProductPayload = {
        creditRequestCode: creditRequestCode,
        creditProductCode: selectedProduct.creditProductCode,
      };

      if (
        !areValuesEqual(values.interestRate, selectedProduct.interestRate, 4)
      ) {
        payload.interestRate = Number(values.interestRate);
      }

      if (!areValuesEqual(values.termInMonths, selectedProduct.loanTerm, 4)) {
        payload.loanTerm = Number(values.termInMonths);
      }

      if (!areValuesEqual(values.creditAmount, selectedProduct.loanAmount, 2)) {
        payload.loanAmount = Number(values.creditAmount);
      }

      if (
        values.rateType &&
        values.rateType !== selectedProduct.interestRateType
      ) {
        payload.interestRateType = values.rateType;
      }

      if (
        values.amortizationType &&
        values.amortizationType !== selectedProduct.repaymentStructure
      ) {
        payload.repaymentStructure = values.amortizationType;
      }

      const initialInstallment =
        selectedProduct.ordinaryInstallmentsForPrincipal?.[0]
          ?.installmentAmount || 0;
      if (!areValuesEqual(values.installmentAmount, initialInstallment, 2)) {
        payload.installmentAmount = Number(values.installmentAmount);
      }

      const initialPaymentMethod =
        selectedProduct.ordinaryInstallmentsForPrincipal?.[0]
          ?.paymentChannelAbbreviatedName || "";
      if (values.paymentMethod !== initialPaymentMethod) {
        payload.paymentChannelAbbreviatedName = values.paymentMethod;
      }

      const initialCycle = prospectData.selectedRegularPaymentSchedule || "";
      if (values.paymentCycle !== initialCycle) {
        payload.paymentChannelCyleName = values.paymentCycle;
      }

      const hasChanges = Object.keys(payload).length > 2;

      if (!hasChanges) {
        setModalHistory((prev) => prev.slice(0, -1));
        setIsProcessingServices(false);
        return;
      }

      await updateCreditProduct(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
        eventData.token,
        eventData.user.identificationDocumentNumber || "",
      );

      if (fetchProspectData) {
        await fetchProspectData();
      }

      setModalHistory((prev) => prev.slice(0, -1));
      setShowMessageSuccessModal(true);
      setIsProcessingServices(false);
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setIsProcessingServices(false);
      setShowErrorModal(true);
      setMessageError(description);
    }
  };

  const handleDeleteClick = (creditProductId: string) => {
    setSelectedProductId(creditProductId);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setGeneralLoading(true);

        const result = await getSearchProspectSummaryById(
          businessUnitPublicCode,
          businessManagerCode,
          creditRequestCode || "",
          eventData.token,
        );
        setGeneralLoading(false);
        if (result && setProspectSummaryData) {
          setProspectSummaryData(result as IProspectSummaryById);
        }
      } catch (error) {
        setGeneralLoading(false);
        const err = error as {
          message?: string;
          status?: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + (err?.message || "") + (err?.data?.description || "");

        setShowErrorModal(true);
        setMessageError(description);
      }
    };
    if (prospectData) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, prospectData?.prospectId, prospectData]);

  useEffect(() => {
    if (!businessUnitPublicCode || !prospectData?.prospectId) return;

    const fetchExpenses = async () => {
      try {
        setGeneralLoading(true);
        const data = await getAllDeductibleExpensesById(
          businessUnitPublicCode,
          businessManagerCode,
          creditRequestCode || "",
          eventData.token,
        );
        setDeductibleExpenses(data);
      } catch (error) {
        const err = error as {
          message?: string;
          status?: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + (err?.message || "") + (err?.data?.description || "");

        setShowErrorModal(true);
        setMessageError(description);
      } finally {
        setGeneralLoading(false);
      }
    };

    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, prospectData?.prospectId]);

  return (
    <StyledPrintCardProspect>
      <div ref={dataRef}>
        <StyledCardsCredit $isMobile={isMobile}>
          <Stack
            gap="24px"
            width="fit-content"
            padding="3px 8px 7px 8px"
            direction={isMobile ? "column" : "row"}
          >
            {!generalLoading && (
              <>
                {prospectProducts.map((entry, index) => (
                  <CreditProductCard
                    key={`${entry.creditProductCode}-${index}`}
                    lineOfCredit={entry.lineOfCreditAbbreviatedName}
                    paymentMethod={
                      entry.ordinaryInstallmentsForPrincipal?.[0]
                        ?.paymentChannelAbbreviatedName
                    }
                    availableEditCreditRequest={availableEditCreditRequest}
                    loanAmount={entry.loanAmount}
                    interestRate={entry.interestRate || 0}
                    termMonths={entry.loanTerm}
                    periodicFee={
                      entry.ordinaryInstallmentsForPrincipal?.[0]
                        ?.installmentAmount
                    }
                    schedule={
                      entry.ordinaryInstallmentsForPrincipal?.[0]
                        ?.installmentFrequency ||
                      capitalizeFirstLetter(
                        entry.ordinaryInstallmentsForPrincipal?.[0]
                          ?.installmentFrequency ||
                          paymentCycleMap[
                            entry.installmentFrequency as string
                          ] ||
                          "",
                      ) ||
                      ""
                    }
                    onEdit={() =>
                      editCreditApplication
                        ? handleInfo()
                        : (setSelectedProduct(entry),
                          setModalHistory((prev) => [
                            ...prev,
                            "editProductModal",
                          ]))
                    }
                    onDelete={() =>
                      editCreditApplication
                        ? handleInfo()
                        : handleDeleteClick(entry.creditProductCode)
                    }
                    showIcons={showAddProduct}
                    lang={lang}
                    canDelete={prospectProducts.length === 1}
                    installmentFrequency={
                      enums.Peridiocity?.find(
                        (item) => item.code === entry.installmentFrequency,
                      )?.i18n?.[lang] || ""
                    }
                  />
                ))}
              </>
            )}
            {!(showAddProduct && !generalLoading) ||
              (!disableAddProduct && !availableEditCreditRequest && (
                <StyledPrint>
                  <NewCreditProductCard onClick={onClick} lang={lang} />
                </StyledPrint>
              ))}
            {generalLoading && (
              <>
                {Array(3)
                  .fill(0)
                  .map((_, indexContainer) => (
                    <Stack>
                      <StyledCreditProductCard
                        isLoading
                        key={indexContainer}
                        $showIcons={true}
                      >
                        <Stack
                          direction="column"
                          height="100%"
                          padding="12px"
                          gap="8px"
                        >
                          <SkeletonLine height="40px" width="100%" animated />
                          <Stack
                            gap="16px"
                            direction="column"
                            margin="16px 0 0 0"
                          >
                            <Stack gap="8px" direction="column">
                              <SkeletonLine
                                height="10px"
                                width="90%"
                                animated
                              />
                              <SkeletonLine
                                height="30px"
                                width="60%"
                                animated
                              />
                            </Stack>
                            <Stack gap="8px" direction="column">
                              <SkeletonLine
                                height="10px"
                                width="90%"
                                animated
                              />
                              <SkeletonLine
                                height="30px"
                                width="60%"
                                animated
                              />
                            </Stack>
                            <Stack gap="8px" direction="column">
                              <SkeletonLine
                                height="10px"
                                width="90%"
                                animated
                              />
                              <SkeletonLine
                                height="30px"
                                width="60%"
                                animated
                              />
                            </Stack>
                          </Stack>
                        </Stack>
                      </StyledCreditProductCard>
                    </Stack>
                  ))}
              </>
            )}
          </Stack>
        </StyledCardsCredit>
        {isMobile && <Divider />}
        <StylePrintCardSummary>
          <Stack
            gap="24px"
            margin="12px 16px 0px 8px"
            direction={isMobile ? "column" : "row"}
            justifyContent="space-between"
          >
            {SummaryProspectCredit.map((entry, index) => (
              <CardValues
                isLoading={generalLoading}
                key={index}
                items={entry.item.map((item) => {
                  let iconToRender = item.icon;

                  if (
                    item.id === "totalConsolidatedAmount" &&
                    !showAddProduct
                  ) {
                    iconToRender = <MdOutlineRemoveRedEye />;
                  } else if (availableEditCreditRequest) {
                    iconToRender = <MdOutlineRemoveRedEye />;
                  }

                  return {
                    ...item,
                    title: item.title.i18n[lang],
                    amount: String(prospectSummaryData?.[item.id] ?? 0),
                    icon: iconToRender,
                  };
                })}
                showIcon={entry.iconEdit}
                isMobile={isMobile}
                handleEdit={() => setShowConsolidatedModal(true)}
                handleView={() => setDeductibleExpensesModal(true)}
              />
            ))}
          </Stack>
        </StylePrintCardSummary>
        {showDeleteModal && (
          <DeleteModal
            handleClose={() => setShowDeleteModal(false)}
            handleDelete={handleDelete}
            TextDelete={tittleOptions.deletedExpensesErrorDescription}
            isLoading={generalLoading}
            lang={lang}
          />
        )}
        {currentModal === "editProductModal" && selectedProduct && (
          <EditProductModal
            onCloseModal={() => setModalHistory((prev) => prev.slice(0, -1))}
            onConfirm={handleConfirm}
            title={tittleOptions.editProduct}
            confirmButtonText={tittleOptions.save}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            initialValues={{
              creditLine: selectedProduct.lineOfCreditAbbreviatedName || "",
              creditAmount: selectedProduct.loanAmount || 0,
              paymentMethod:
                selectedProduct.ordinaryInstallmentsForPrincipal?.[0]
                  ?.paymentChannelAbbreviatedName || "",
              paymentCycle: prospectData?.selectedRegularPaymentSchedule || "",
              firstPaymentCycle: "",
              termInMonths:
                Number(selectedProduct.loanTerm) % 1 !== 0
                  ? Number(selectedProduct.loanTerm).toFixed(4)
                  : Number(selectedProduct.loanTerm) || 0,
              interestRate:
                Number(selectedProduct.interestRate).toFixed(4) || 0,
              installmentAmount:
                selectedProduct.ordinaryInstallmentsForPrincipal[0]
                  .installmentAmount || 1,
              amortizationType: selectedProduct.repaymentStructure || "",
              rateType: selectedProduct.interestRateType || "",
            }}
            prospectData={{
              lineOfCredit: selectedProduct.lineOfCreditAbbreviatedName || "",
              moneyDestination:
                prospectData!.moneyDestinationAbbreviatedName || "",
              paymentChannelType:
                prospectData!.preferredPaymentChannelAbbreviatedName,
            }}
            setShowErrorModal={setShowErrorModal}
            setMessageError={setMessageError}
            isProcessingServices={isProcessingServices}
            lang={lang}
            enums={enums}
            creditRequestCode={creditRequestCode}
            custumerData={documentClientNumber(prospectData as IProspect)}
          />
        )}
        {showConsolidatedModal && (
          <ConsolidatedCredits
            handleClose={() => {
              setShowConsolidatedModal(false);
              setConsolidatedCredits(prospectData?.consolidatedCredits || []);
            }}
            custumerData={documentClientNumber(prospectData as IProspect)}
            prospectData={prospectData}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            consolidatedCredits={consolidatedCredits}
            setConsolidatedCredits={setConsolidatedCredits}
            onProspectRefreshData={onProspectRefreshData}
            showEdit={showAddProduct}
            availableEditCreditRequest={availableEditCreditRequest}
            lang={lang}
            eventData={eventData}
            handleInfo={handleInfo}
          />
        )}
        {showDeductibleExpensesModal && (
          <DeductibleExpensesModal
            handleClose={() => setDeductibleExpensesModal(false)}
            initialValues={deductibleExpenses}
            loading={generalLoading}
            isMobile={isMobile}
            lang={lang}
          />
        )}
        {isModalOpen && (
          <InfoModal
            onClose={handleInfoModalClose}
            title={privilegeCrediboard.title}
            subtitle={privilegeCrediboard.subtitle}
            description={
              availableEditCreditRequest
                ? optionsDisableStage.description
                : privilegeCrediboard.description
            }
            nextButtonText={privilegeCrediboard.nextButtonText}
            isMobile={isMobile}
          />
        )}
        {showErrorModal && (
          <ErrorModal
            handleClose={() => {
              setShowErrorModal(false);
            }}
            isMobile={isMobile}
            message={messageError}
          />
        )}
      </div>
    </StyledPrintCardProspect>
  );
};
