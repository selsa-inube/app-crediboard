import { useContext, useEffect, useState } from "react";

import { Stack, Divider, useMediaQuery, useFlag } from "@inubekit/inubekit";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { CreditProductCard } from "@components/cards/CreditProductCard";
import { NewCreditProductCard } from "@components/cards/CreditProductCard/newCard";
import { CardValues } from "@components/cards/cardValues";
import { DeleteModal } from "@components/modals/DeleteModal";
import { getSearchProspectSummaryById } from "@services/creditRequest/query/ProspectSummaryById";
import { AppContext } from "@context/AppContext";
import {
  IProspect,
  ICreditProduct,
  IProspectSummaryById,
} from "@services/prospect/types";
import { DeductibleExpensesModal } from "@pages/prospect/components/modals/DeductibleExpensesModal";
import { getAllDeductibleExpensesById } from "@services/creditRequest/query/deductibleExpenses";
import { EditProductModal } from "@pages/prospect/components/modals/ProspectProductModal";
import { ConsolidatedCredits } from "@pages/prospect/components/modals/ConsolidatedCreditModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { privilegeCrediboard, optionsDisableStage } from "@config/privilege";
import { RemoveCreditProduct } from "@services/creditRequest/command/removeCreditProduct";
import { ErrorModal } from "@components/modals/ErrorModal";
import { useEnum } from "@hooks/useEnum";

import { SummaryProspectCreditEnum, tittleOptionsEnum } from "./config/config";
import { paymentCycleMap } from "@pages/prospect/components/modals/ProspectProductModal/config";
import { capitalizeFirstLetter } from "@utils/formatData/text";

import {
  StyledCardsCredit,
  StyledPrint,
  StylePrintCardSummary,
  StyledPrintCardProspect,
} from "./styles";

interface CardCommercialManagementProps {
  id: string;
  dataRef: React.RefObject<HTMLDivElement>;
  onClick: () => void;
  moneyDestination: string;
  businessManagerCode: string;
  clientIdentificationNumber: string;
  availableEditCreditRequest: boolean;
  prospectData?: IProspect;
  refreshProducts?: () => void;
  onProspectUpdate?: (prospect: IProspect) => void;
  canAddProduct?: boolean;
}

export const CardCommercialManagement = (
  props: CardCommercialManagementProps,
) => {
  const {
    dataRef,
    id,
    onClick,
    prospectData,
    onProspectUpdate,
    moneyDestination,
    clientIdentificationNumber,
    availableEditCreditRequest,
    canAddProduct,
  } = props;
  const [prospectProducts, setProspectProducts] = useState<ICreditProduct[]>(
    [],
  );

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const businessManagerCode = eventData.businessManager.publicCode;
  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ICreditProduct | null>(
    null,
  );
  const currentModal = modalHistory[modalHistory.length - 1];
  const [selectedProductId, setSelectedProductId] = useState("");
  const [prospectSummaryData, setProspectSummaryData] =
    useState<IProspectSummaryById>();
  const [showConsolidatedModal, setShowConsolidatedModal] = useState(false);
  const [showDeductibleExpensesModal, setDeductibleExpensesModal] =
    useState(false);
  const [deductibleExpenses, setDeductibleExpenses] = useState<
    { expenseName: string; expenseValue: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [consolidatedCredits, setConsolidatedCredits] = useState(
    prospectData?.consolidatedCredits || [],
  );
  const [isSendingData, setIsSendingData] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (prospectData?.creditProducts) {
      setProspectProducts(prospectData?.creditProducts);
    }
  }, [prospectData]);
  const isMobile = useMediaQuery("(max-width: 800px)");
  const { lang, enums } = useEnum();
  const { addFlag } = useFlag();

  const handleDelete = async () => {
    if (!prospectData || !prospectProducts.length) return;
    try {
      setIsSendingData(true);
      const updatedProspect = await RemoveCreditProduct(
        businessUnitPublicCode,
        eventData.user.identificationDocumentNumber || "",
        {
          creditProductCode: selectedProductId,
          creditRequestCode: id,
        },
        eventData.token,
      );
      setProspectProducts((prev) =>
        prev.filter(
          (product) => product.creditProductCode !== selectedProductId,
        ),
      );

      const normalizedProspect = {
        ...updatedProspect,
        creditProducts: updatedProspect!.creditProducts?.map((product) => ({
          ...product,
          schedule: product.schedule || product.installmentFrequency,
        })),
      };

      if (onProspectUpdate && updatedProspect) {
        onProspectUpdate(normalizedProspect as IProspect);
      }

      setIsSendingData(false);
      setShowDeleteModal(false);

      addFlag({
        title: tittleOptionsEnum.successDeleteTitle.i18n[lang],
        description: tittleOptionsEnum.successDeleteDescription.i18n[lang],
        appearance: "success",
        duration: 5000,
      });
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
      setMessageError(
        tittleOptionsEnum.errorDeleteProduct.i18n[lang] || description,
      );
      setIsSendingData(false);
    }
  };

  const handleDeleteClick = (creditProductId: string) => {
    setSelectedProductId(creditProductId);
    setShowDeleteModal(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchProspectSummaryById(
          businessUnitPublicCode,
          businessManagerCode,
          id,
          eventData.token || "",
        );
        if (result) {
          setProspectSummaryData(result);
        }
      } catch (error) {
        addFlag({
          title: tittleOptionsEnum.titleError.i18n[lang],
          description: tittleOptionsEnum.descriptionError.i18n[lang],
          appearance: "danger",
          duration: 5000,
        });
      }
    };
    if (prospectData) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, prospectData?.prospectId]);

  useEffect(() => {
    if (!businessUnitPublicCode || !prospectData?.prospectId) return;

    const fetchExpenses = async () => {
      try {
        const data = await getAllDeductibleExpensesById(
          businessUnitPublicCode,
          businessManagerCode,
          id,
          eventData.token || "",
        );
        setDeductibleExpenses(data);
      } catch (error) {
        addFlag({
          title: tittleOptionsEnum.deductibleExpensesErrorTitle.i18n[lang],
          description: `${error}`,
          appearance: "danger",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
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
            padding="4px 8px 16px 8px"
            direction={isMobile ? "column" : "row"}
          >
            {prospectProducts.map((entry, index) => (
              <CreditProductCard
                key={`${entry.creditProductCode}-${index}`}
                lineOfCredit={entry.lineOfCreditAbbreviatedName}
                paymentMethod={
                  entry.ordinaryInstallmentsForPrincipal?.[0]
                    ?.paymentChannelAbbreviatedName
                }
                loanAmount={entry.loanAmount}
                interestRate={entry.interestRate}
                termMonths={entry.loanTerm}
                periodicFee={
                  entry.ordinaryInstallmentsForPrincipal?.[0]?.installmentAmount
                }
                schedule={
                  entry.ordinaryInstallmentsForPrincipal?.[0]
                    ?.installmentFrequency ||
                  capitalizeFirstLetter(
                    entry.ordinaryInstallmentsForPrincipal?.[0]
                      ?.installmentFrequency ||
                      paymentCycleMap[entry.installmentFrequency as string] ||
                      "",
                  ) ||
                  ""
                }
                availableEditCreditRequest={availableEditCreditRequest}
                onEdit={
                  editCreditApplication
                    ? handleInfo
                    : () => {
                        setSelectedProduct(entry);
                        setModalHistory((prev) => [
                          ...prev,
                          "editProductModal",
                        ]);
                      }
                }
                onDelete={
                  editCreditApplication
                    ? handleInfo
                    : () => handleDeleteClick(entry.creditProductCode)
                }
                lang={lang}
                canDelete={prospectProducts.length === 1}
                installmentFrequency={
                  enums?.Peridiocity?.find(
                    (item) => item.code === entry.installmentFrequency,
                  )?.i18n?.[lang] || ""
                }
              />
            ))}
            {!availableEditCreditRequest && !canAddProduct && (
              <StyledPrint>
                <NewCreditProductCard onClick={onClick} lang={lang} />
              </StyledPrint>
            )}
          </Stack>
        </StyledCardsCredit>
        <div style={{ pageBreakInside: "avoid" }}>
          {isMobile && <Divider />}
          <StylePrintCardSummary>
            <Stack
              gap="24px"
              margin="36px 16px 8px 8px"
              direction={isMobile ? "column" : "row"}
              justifyContent="space-between"
            >
              {SummaryProspectCreditEnum.map((entry, index) => (
                <CardValues
                  key={index}
                  items={entry.item.map((item) => ({
                    title: item.title.i18n[lang],
                    amount: String(prospectSummaryData?.[item.id] ?? 0),
                    operation: item.operation,
                    miniIcon: item.miniIcon,
                    icon:
                      item.id === "totalConsolidatedAmount" &&
                      availableEditCreditRequest ? (
                        <MdOutlineRemoveRedEye />
                      ) : (
                        item.icon
                      ),
                    modal: item.modal,
                  }))}
                  showIcon={entry.iconEdit}
                  isMobile={isMobile}
                  handleEdit={() => setShowConsolidatedModal(true)}
                  handleView={() => setDeductibleExpensesModal(true)}
                />
              ))}
            </Stack>
          </StylePrintCardSummary>
        </div>
        {showDeleteModal && (
          <DeleteModal
            handleClose={() => setShowDeleteModal(false)}
            handleDelete={handleDelete}
            TextDelete={tittleOptionsEnum.descriptionDelete.i18n[lang]}
            isSendingData={isSendingData}
          />
        )}
        {currentModal === "editProductModal" && selectedProduct && (
          <EditProductModal
            onCloseModal={() => setModalHistory((prev) => prev.slice(0, -1))}
            title={`Editar producto`}
            confirmButtonText="Guardar"
            moneyDestination={moneyDestination}
            initialValues={{
              creditLine: selectedProduct.lineOfCreditAbbreviatedName || "",
              creditAmount: selectedProduct.loanAmount || 0,
              paymentMethod:
                selectedProduct.ordinaryInstallmentsForPrincipal?.[0]
                  ?.paymentChannelAbbreviatedName || "",
              paymentCycle:
                selectedProduct.ordinaryInstallmentsForPrincipal?.[0]
                  ?.installmentFrequency || "",
              firstPaymentCycle: "",
              termInMonths: selectedProduct.loanTerm || 0,
              amortizationType: "",
              interestRate: selectedProduct.interestRate || 0,
              rateType: "",
              installmentAmount:
                selectedProduct.ordinaryInstallmentsForPrincipal?.[0]
                  ?.installmentAmount || 0,
            }}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            clientIdentificationNumber={clientIdentificationNumber}
            creditRequestCode={id || ""}
            creditProductCode={selectedProduct?.creditProductCode || ""}
            prospectId={prospectData?.prospectId || ""}
            onProspectUpdate={(updatedProspect) => {
              if (updatedProspect?.creditProducts) {
                setProspectProducts(updatedProspect.creditProducts);
              }

              if (onProspectUpdate) {
                onProspectUpdate(updatedProspect);
              }

              setModalHistory((prev) => prev.slice(0, -1));
            }}
          />
        )}

        {showConsolidatedModal && (
          <ConsolidatedCredits
            handleClose={() => setShowConsolidatedModal(false)}
            prospectData={prospectData}
            availableEditCreditRequest={availableEditCreditRequest}
            handleInfo={handleInfo}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            consolidatedCredits={consolidatedCredits}
            setConsolidatedCredits={setConsolidatedCredits}
            onProspectUpdated={() => {}}
            clientIdentificationNumber={clientIdentificationNumber}
            creditRequestCode={id || ""}
            eventData={eventData}
          />
        )}
        {showDeductibleExpensesModal && (
          <DeductibleExpensesModal
            handleClose={() => setDeductibleExpensesModal(false)}
            initialValues={deductibleExpenses}
            loading={isLoading}
            isMobile={isMobile}
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
            handleClose={() => setShowErrorModal(false)}
            isMobile={isMobile}
            message={messageError}
          />
        )}
      </div>
    </StyledPrintCardProspect>
  );
};
