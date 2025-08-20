import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FormikValues } from "formik";
import {
  MdOutlineAdd,
  MdOutlinePayments,
  MdOutlinePictureAsPdf,
  MdOutlineShare,
} from "react-icons/md";
import { Stack, Icon, Button, IOption } from "@inubekit/inubekit";

import { MenuProspect } from "@components/navigation/MenuProspect";
import { PaymentCapacity } from "@components/modals/PaymentCapacityModal";
import { ReciprocityModal } from "@components/modals/ReciprocityModal";
import { ScoreModal } from "@components/modals/FrcModal";
import { ReportCreditsModal } from "@components/modals/ReportCreditsModal";
import { ExtraordinaryPaymentModal } from "@components/modals/ExtraordinaryPaymentModal";
import { IPaymentChannel } from "@services/creditRequest/command/types";
import { extraordinaryInstallmentMock } from "@mocks/prospect/extraordinaryInstallment.mock";
import { addCreditProduct } from "@mocks/utils/addCreditProductMock.service";
import { mockProspectCredit } from "@mocks/prospect/prospectCredit.mock";
import { IProspect } from "@services/prospect/types";
import {
  incomeOptions,
  menuOptions,
} from "@pages/prospect/outlets/financialReporting/CommercialManagement/config/config";
import {
  StyledContainerIcon,
  StyledVerticalDivider,
} from "@pages/prospect/outlets/financialReporting/CommercialManagement/styles";
import { IExtraordinaryInstallments } from "@services/prospect/types";
import { CardCommercialManagement } from "@pages/prospect/outlets/financialReporting/CommercialManagement/CardCommercialManagement";
import { IncomeBorrowersModal } from "@components/modals/incomeBorrowersModal";

import { dataCreditProspect } from "./config";
import { StyledPrint } from "./styles";
import { IIncomeSources } from "./types";
import { CreditLimitModal } from "../modals/CreditLimitModal";
import { IncomeModal } from "../modals/IncomeModal";
import { EditProductModal } from "../modals/ProspectProductModal";
import { ShareCreditModal } from "../modals/ShareCreditModal";

interface ICreditProspectProps {
  borrowersProspect: IProspect | undefined;
  borrowerOptions: IOption[];
  selectedIndex: number;
  dataProspect: IProspect[];
  selectedBorrower: IProspect["borrowers"][number] | undefined;
  incomeData: Record<string, IIncomeSources>;
  isMobile: boolean;
  businessUnitPublicCode: string;
  sentData: IExtraordinaryInstallments | null;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  prospectData?: IProspect;
  isPrint?: boolean;
  showPrint?: boolean;
  setRequestValue?: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  showMenu: () => void;
  handleChange: (name: string, newValue: string) => void;
  handleIncomeSubmit: (values: IIncomeSources) => void;
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
    isMobile,
    isPrint = false,
    showPrint = true,
    sentData,
    setSentData,
    businessUnitPublicCode,
    showMenu,
    handleChange,
    handleIncomeSubmit,
  } = props;

  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();
  const [showShareModal, setShowShareModal] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);

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

  const currentModal = modalHistory[modalHistory.length - 1];

  const { id } = useParams();

  const dataCommercialManagementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const foundProspect = mockProspectCredit.find(
        (prospect) => prospect.public_code === id
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
  }, [id]);

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

  const onChanges = (name: string, newValue: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: newValue,
    }));
  };

  const handleConfirm = async (values: FormikValues) => {
    if (!id) {
      console.error("ID no está definido");
      return;
    }

    const result = await addCreditProduct(id, values, mockProspectCredit);

    if (result) {
      handleCloseModal();
    }
  };

  return (
    <Stack direction="column" gap="24px">
      {!isMobile && (
        <StyledPrint>
          <Stack gap="16px" justifyContent="end" alignItems="center">
            <Button
              type="button"
              appearance="primary"
              spacing="compact"
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
                    onClick={print}
                  />
                  <Icon
                    icon={<MdOutlineShare />}
                    appearance="primary"
                    size="24px"
                    onClick={() => setShowShareModal(true)}
                    cursorHover
                  />
                  <StyledVerticalDivider />
                </Stack>
              )}
              <MenuProspect
                only
                options={menuOptions(
                  handleOpenModal,
                  !prospectData?.creditProducts?.some(
                    (product) =>
                      Array.isArray(product.extraordinaryInstallments) &&
                      product.extraordinaryInstallments.length > 0
                  )
                )}
                onMouseLeave={showMenu}
              />
            </StyledContainerIcon>
          </Stack>
        </StyledPrint>
      )}
      <Stack direction="column">
        <CardCommercialManagement
          id={id!}
          dataRef={dataCommercialManagementRef}
          onClick={() => handleOpenModal("editProductModal")}
          prospectData={prospectData || undefined}
        />
      </Stack>
      {currentModal === "creditLimit" && (
        <CreditLimitModal
          handleClose={handleCloseModal}
          isMobile={isMobile}
          setRequestValue={setRequestValue || (() => {})}
          requestValue={requestValue}
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
          balanceOfContributions={4000000}
          accordingToRegulation={2}
          assignedQuota={1000000}
        />
      )}
      {openModal === "scoreModal" && (
        <ScoreModal
          title="Score Details"
          handleClose={() => setOpenModal(null)}
          subTitle="Your Financial Score"
          totalScore={150}
          seniority={150}
          centralRisk={50}
          employmentStability={230}
          maritalStatus={30}
          economicActivity={118}
          monthlyIncome={3000000}
          maxIndebtedness={50000000}
        />
      )}
      {currentModal === "editProductModal" && (
        <EditProductModal
          title="Agregar productos"
          confirmButtonText="Guardar"
          initialValues={initialValues}
          iconBefore={<MdOutlineAdd />}
          onCloseModal={handleCloseModal}
          onConfirm={handleConfirm}
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
        />
      )}
      {currentModal === "reportCreditsModal" && (
        <ReportCreditsModal
          handleClose={handleCloseModal}
          options={incomeOptions}
          onChange={onChanges}
          debtor={form.borrower}
          prospectData={prospectData ? [prospectData] : undefined}
        />
      )}
      {currentModal === "extraPayments" && (
        <ExtraordinaryPaymentModal
          dataTable={extraordinaryInstallmentMock}
          handleClose={handleCloseModal}
          prospectData={prospectData}
          sentData={sentData}
          setSentData={setSentData}
          businessUnitPublicCode={businessUnitPublicCode}
        />
      )}
      {showShareModal && (
        <ShareCreditModal
          handleClose={() => setShowShareModal(false)}
          isMobile={isMobile}
        />
      )}
    </Stack>
  );
}
