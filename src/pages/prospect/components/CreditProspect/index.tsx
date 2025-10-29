import { useEffect, useRef, useState } from "react";
import {
  MdOutlineAdd,
  MdOutlineInfo,
  MdOutlinePayments,
  MdOutlinePictureAsPdf,
  MdOutlineShare,
} from "react-icons/md";
import { Stack, Icon, Button, IOption, useFlag } from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { MenuProspect } from "@components/navigation/MenuProspect";
import { PaymentCapacity } from "@components/modals/PaymentCapacityModal";
import { ReciprocityModal } from "@components/modals/ReciprocityModal";
import { ScoreModal } from "@components/modals/FrcModal";
import { ReportCreditsModal } from "@components/modals/ReportCreditsModal";
import { ExtraordinaryPaymentModal } from "@components/modals/ExtraordinaryPaymentModal";
import { IPaymentChannel } from "@services/creditRequest/command/types";
import { extraordinaryInstallmentMock } from "@mocks/prospect/extraordinaryInstallment.mock";
import { IAddCreditProduct } from "@services/prospect/addCreditProduct/types";
import { mockProspectCredit } from "@mocks/prospect/prospectCredit.mock";
import { IProspect } from "@services/prospect/types";
import {
  StyledContainerIcon,
  StyledVerticalDivider,
} from "@pages/board/outlets/financialReporting/CommercialManagement/styles";
import {
  incomeOptions,
  menuOptions,
} from "@pages/board/outlets/financialReporting/CommercialManagement/config/config";
import { CardCommercialManagement } from "@pages/board/outlets/financialReporting/CommercialManagement/CardCommercialManagement";
import { IExtraordinaryInstallments } from "@services/prospect/types";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { IncomeBorrowersModal } from "@components/modals/incomeBorrowersModal";
import { privilegeCrediboard } from "@config/privilege";
import { addCreditProductService } from "@services/prospect/addCreditProduct";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";

import { AddProductModal } from "../AddProductModal";
import { dataCreditProspect } from "./config";
import { StyledPrint } from "./styles";
import { IIncomeSources } from "./types";
import { CreditLimitModal } from "../modals/CreditLimitModal";
import { IncomeModal } from "../modals/IncomeModal";
import { ShareCreditModal } from "../modals/ShareCreditModal";
import InfoModal from "../modals/InfoModal";

interface ICreditProspectProps {
  borrowersProspect: IProspect | undefined;
  borrowerOptions: IOption[];
  selectedIndex: number;
  dataProspect: IProspect[];
  selectedBorrower: IProspect["borrowers"][number] | undefined;
  incomeData: Record<string, IIncomeSources>;
  isMobile: boolean;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  sentData: IExtraordinaryInstallments | null;
  creditRequestCode?: string;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  prospectData?: IProspect;
  onProspectUpdate?: (prospect: IProspect) => void;
  isPrint?: boolean;
  showPrint?: boolean;
  setRequestValue?: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  showMenu: () => void;
  handleChange: (name: string, newValue: string) => void;
  handleIncomeSubmit: (values: IIncomeSources) => void;
  generateAndSharePdf: () => void;
  setDataProspect?: React.Dispatch<React.SetStateAction<IProspect[]>>;
}

export function CreditProspect(props: ICreditProspectProps) {
  const {
    borrowersProspect,
    borrowerOptions,
    selectedIndex,
    dataProspect,
    selectedBorrower,
    incomeData,
    prospectData,
    onProspectUpdate,
    isMobile,
    isPrint = false,
    showPrint = true,
    sentData,
    setSentData,
    businessUnitPublicCode,
    businessManagerCode,
    creditRequestCode,
    showMenu,
    handleChange,
    handleIncomeSubmit,
    generateAndSharePdf,
    setDataProspect,
  } = props;

  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();
  const [showShareModal, setShowShareModal] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);

  const { addFlag } = useFlag();

  const handleOpenModal = (modalName: string) => {
    setModalHistory((prevHistory) => [...prevHistory, modalName]);
  };

  const handleCloseModal = () => {
    setModalHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory.pop();
      return newHistory;
    });
  };
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });
  const currentModal = modalHistory[modalHistory.length - 1];

  const dataCommercialManagementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (creditRequestCode) {
      const foundProspect = mockProspectCredit.find(
        (prospect) => prospect.public_code === creditRequestCode
      );
      if (foundProspect) {
        const mockCredit = foundProspect.consolidated_credit[0];
        setForm({
          borrower: foundProspect.borrower[0].borrower_name,
          monthlySalary: mockCredit.monthly_salary ?? 0,
          otherMonthlyPayments: mockCredit.other_monthly_payments ?? 0,
          pensionAllowances: mockCredit.pension_allowances ?? 0,
          leases: mockCredit.leases ?? 0,
          dividendsOrShares: mockCredit.dividends_or_shares ?? 0,
          financialReturns: mockCredit.financial_returns ?? 0,
          averageMonthlyProfit: mockCredit.average_monthly_profit ?? 0,
          monthlyFees: mockCredit.monthly_fees ?? 0,
          total: undefined,
        });
      }
    }
  }, [creditRequestCode]);

  const [form, setForm] = useState({
    borrower: "",
    monthlySalary: 0,
    otherMonthlyPayments: 0,
    pensionAllowances: 0,
    leases: 0,
    dividendsOrShares: 0,
    financialReturns: 0,
    averageMonthlyProfit: 0,
    monthlyFees: 0,
    total: undefined,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const onChanges = (name: string, newValue: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: newValue }));
  };

  const handleConfirm = async (values: FormikValues) => {
    if (!prospectData?.prospectId) {
      console.error("prospectId no está definido");
      return;
    }

    try {
      const payload: IAddCreditProduct = {
        creditRequestCode: creditRequestCode || "",
        creditProducts: [
          {
            lineOfCreditAbbreviatedName: values.selectedProducts[0],
          },
        ],
      };

      const updatedProspect = await addCreditProductService(
        businessUnitPublicCode,
        businessManagerCode,
        payload
      );

      const normalizedProspect = {
        ...updatedProspect,
        creditProducts: updatedProspect!.creditProducts?.map((product) => ({
          ...product,
          schedule: product.schedule || product.installmentFrequency,
        })),
      };

      const refreshedProspect = normalizedProspect as IProspect;

      if (setDataProspect && refreshedProspect) {
        setDataProspect([refreshedProspect as IProspect]);
      }

      if (onProspectUpdate && refreshedProspect) {
        onProspectUpdate(refreshedProspect as IProspect);
      }

      handleCloseModal();
    } catch (error) {
      handleCloseModal();

      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };

      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      let description =
        code +
        (err?.message || "Error desconocido") +
        (err?.data?.description || "");

      if (
        err?.data?.description === "Credit product already exists in prospect"
      ) {
        description = "El producto de crédito ya existe en el prospecto";
      }

      addFlag({
        title: "Error",
        description,
        appearance: "danger",
        duration: 5000,
      });
    }
  };
  const handlePdfGeneration = () => {
    print();
  };

  const borrower = dataProspect?.[0]?.borrowers?.[0];

  const dataMaximumCreditLimitService = {
    identificationDocumentType: borrower?.borrowerIdentificationType || "",
    identificationDocumentNumber: borrower?.borrowerIdentificationNumber || "",
    moneyDestination: dataProspect?.[0]?.moneyDestinationAbbreviatedName || "",
    primaryIncomeType:
      borrower?.borrowerProperties?.find(
        (property) => property.propertyName === "PeriodicSalary"
      )?.propertyValue || "",
  };

  const initialValues: FormikValues = {
    creditLine: "",
    creditAmount: "",
    paymentMethod: "",
    paymentCycle: "",
    firstPaymentCycle: "",
    termInMonths: "",
    amortizationType: "",
    interestRate: "",
    rateType: "",
  };

  return (
    <Stack direction="column" gap="24px">
      {!isMobile && (
        <StyledPrint>
          <Stack gap="2px" justifyContent="end" alignItems="center">
            <Button
              type="button"
              appearance="primary"
              spacing="compact"
              disabled={editCreditApplication}
              iconBefore={
                <Icon
                  icon={<MdOutlineAdd />}
                  appearance="light"
                  size="18px"
                  spacing="narrow"
                />
              }
              onClick={() => handleOpenModal("editProductModal")}
            >
              {dataCreditProspect.addProduct}
            </Button>
            {editCreditApplication && (
              <Icon
                icon={<MdOutlineInfo />}
                appearance="primary"
                size="16px"
                cursorHover
                onClick={handleInfo}
              />
            )}
            {prospectData?.creditProducts?.some(
              (product) =>
                Array.isArray(product.extraordinaryInstallments) &&
                product.extraordinaryInstallments.length > 0
            ) && (
              <Button
                type="button"
                appearance="primary"
                spacing="compact"
                variant="outlined"
                iconBefore={
                  <Icon
                    icon={<MdOutlinePayments />}
                    appearance="primary"
                    size="18px"
                    spacing="narrow"
                  />
                }
                onClick={() => handleOpenModal("extraPayments")}
              >
                {dataCreditProspect.extraPayment}
              </Button>
            )}
            <StyledVerticalDivider />
            <StyledContainerIcon>
              {showPrint && (
                <Stack gap="8px">
                  <Icon
                    icon={<MdOutlinePictureAsPdf />}
                    appearance="primary"
                    size="24px"
                    disabled={!isPrint}
                    cursorHover
                    onClick={() => handlePdfGeneration()}
                  />
                  <Icon
                    icon={<MdOutlineShare />}
                    appearance="primary"
                    size="24px"
                    onClick={async () => await generateAndSharePdf()}
                    cursorHover
                  />
                  <StyledVerticalDivider />
                </Stack>
              )}
              <MenuProspect
                only
                options={menuOptions(
                  handleOpenModal,
                  prospectData?.creditProducts?.some(
                    (product) =>
                      Array.isArray(product.extraordinaryInstallments) &&
                      product.extraordinaryInstallments.length > 0
                  ) || false
                )}
                onMouseLeave={showMenu}
              />
            </StyledContainerIcon>
          </Stack>
        </StyledPrint>
      )}
      <Stack direction="column">
        <CardCommercialManagement
          id={creditRequestCode!}
          dataRef={dataCommercialManagementRef}
          moneyDestination={dataProspect?.[0]?.moneyDestinationAbbreviatedName}
          businessManagerCode={businessManagerCode}
          clientIdentificationNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
          onClick={() => handleOpenModal("editProductModal")}
          prospectData={prospectData || undefined}
          onProspectUpdate={onProspectUpdate}
        />
      </Stack>
      {currentModal === "creditLimit" && (
        <CreditLimitModal
          handleClose={handleCloseModal}
          isMobile={isMobile}
          setRequestValue={setRequestValue || (() => {})}
          requestValue={requestValue}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          dataMaximumCreditLimitService={dataMaximumCreditLimitService}
          moneyDestination={prospectData?.moneyDestinationAbbreviatedName || ""}
        />
      )}
      {openModal === "paymentCapacity" && (
        <PaymentCapacity
          title="Cupo máx. capacidad de pago"
          handleClose={() => setOpenModal(null)}
          reportedIncomeSources={2000000}
          reportedFinancialObligations={6789000}
          subsistenceReserve={2000000}
          availableForNewCommitments={5000000}
          maxVacationTerm={12}
          maxAmount={1000000}
        />
      )}
      {openModal === "reciprocityModal" && (
        <ReciprocityModal
          handleClose={() => setOpenModal(null)}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          clientIdentificationNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
        />
      )}
      {openModal === "scoreModal" && (
        <ScoreModal
          handleClose={() => setOpenModal(null)}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          clientIdentificationNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
        />
      )}
      {currentModal === "editProductModal" && (
        <AddProductModal
          title="Agregar productos"
          confirmButtonText="Guardar"
          initialValues={initialValues}
          iconBefore={<MdOutlineAdd />}
          onCloseModal={handleCloseModal}
          onConfirm={handleConfirm}
          moneyDestination={dataMaximumCreditLimitService.moneyDestination}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          identificationDocumentNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
        />
      )}
      {currentModal === "IncomeModal" && (
        <IncomeBorrowersModal
          borrowersProspect={borrowersProspect}
          borrowerOptions={borrowerOptions}
          selectedIndex={selectedIndex}
          dataProspect={dataProspect}
          selectedBorrower={selectedBorrower}
          isMobile={isMobile}
          handleCloseModal={handleCloseModal}
          handleChange={handleChange}
          setOpenModal={setOpenModal}
        />
      )}
      {openModal === "IncomeModalEdit" && (
        <IncomeModal
          handleClose={() => setOpenModal(null)}
          initialValues={
            selectedBorrower && incomeData[selectedBorrower.borrowerName]
          }
          onSubmit={handleIncomeSubmit}
          borrowerOptions={borrowerOptions}
          businessUnitPublicCode={businessUnitPublicCode}
          creditRequestCode={creditRequestCode}
          businessManagerCode={businessManagerCode}
        />
      )}
      {currentModal === "reportCreditsModal" && (
        <ReportCreditsModal
          handleClose={handleCloseModal}
          options={incomeOptions}
          onChange={onChanges}
          debtor={form.borrower}
          prospectData={prospectData ? [prospectData] : undefined}
          setDataProspect={setDataProspect}
          businessUnitPublicCode={businessUnitPublicCode}
          creditRequestCode={creditRequestCode || ""}
          businessManagerCode={businessManagerCode}
        />
      )}
      {currentModal === "extraPayments" && (
        <ExtraordinaryPaymentModal
          dataTable={extraordinaryInstallmentMock}
          handleClose={handleCloseModal}
          prospectData={prospectData}
          sentData={sentData}
          setSentData={setSentData}
          creditRequestCode={creditRequestCode || ""}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
        />
      )}
      {showShareModal && (
        <ShareCreditModal
          handleClose={() => setShowShareModal(false)}
          isMobile={isMobile}
        />
      )}
      {isModalOpen && (
        <InfoModal
          onClose={() => setIsModalOpen(false)}
          title={privilegeCrediboard.title}
          subtitle={privilegeCrediboard.subtitle}
          description={privilegeCrediboard.description}
          nextButtonText={privilegeCrediboard.nextButtonText}
          isMobile={isMobile}
        />
      )}
      {currentModal === "observationsModal" && (
        <BaseModal
          width={isMobile ? "300px" : "500px"}
          title={dataCreditProspect.observations}
          handleClose={handleCloseModal}
          handleNext={handleCloseModal}
          nextButton={dataCreditProspect.close}
        >
          <Stack direction="column" gap="16px">
            <CardGray
              apparencePlaceHolder="gray"
              label={dataCreditProspect.approvalObservations}
              placeHolder={dataProspect?.[0]?.clientManagerObservation}
            />
          </Stack>
        </BaseModal>
      )}
    </Stack>
  );
}
