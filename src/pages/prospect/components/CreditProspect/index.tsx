import { useEffect, useRef, useState } from "react";
import {
  MdOutlineAdd,
  MdOutlineInfo,
  MdOutlinePayments,
  MdOutlinePictureAsPdf,
  MdOutlineShare,
} from "react-icons/md";
import {
  Stack,
  Icon,
  Button,
  IOption,
  useFlag,
  Textarea,
} from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { MenuProspect } from "@components/navigation/MenuProspect";
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
import { privilegeCrediboard, optionsDisableStage } from "@config/privilege";
import { addCreditProductService } from "@services/prospect/addCreditProduct";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";
import { updateProspect } from "@services/prospect/updateProspect";
import { ErrorModal } from "@components/modals/ErrorModal";
import { useEnum } from "@hooks/useEnum";

import { AddProductModal } from "../AddProductModal";
import { dataCreditProspectEnum, errorMessage } from "./config";
import { StyledPrint, StyledPrintCardProspect } from "./styles";
import { IIncomeSources } from "./types";
import { IncomeModal } from "../modals/IncomeModal";
import { ShareCreditModal } from "../modals/ShareCreditModal";
import InfoModal from "../modals/InfoModal";

interface ICreditProspectProps {
  borrowersProspect: IProspect | undefined;
  borrowerOptions: IOption[];
  selectedIndex: number;
  dataProspect: IProspect;
  selectedBorrower: IProspect["borrowers"][number] | undefined;
  incomeData: Record<string, IIncomeSources>;
  isMobile: boolean;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  sentData: IExtraordinaryInstallments | null;
  currentModal: string;
  handleOpenModal: (modalName: string) => void;
  handleCloseModal: () => void;
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
  availableEditCreditRequest: boolean;
  setDataProspect?: React.Dispatch<React.SetStateAction<IProspect[]>>;
  setOpenModal?: React.Dispatch<React.SetStateAction<string | null>> | null;
  openModal?: string | null;
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
    availableEditCreditRequest,
    openModal,
    setOpenModal,
    currentModal,
    handleOpenModal,
    handleCloseModal,
  } = props;
  const [showShareModal, setShowShareModal] = useState(false);

  const [showEditApprovalModal, setShowEditApprovalModal] = useState(false);
  const [editedApprovalObservations, setEditedApprovalObservations] =
    useState("");
  const [messageError, setMessageError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSendingData, setIsSendingData] = useState(false);

  const { addFlag } = useFlag();
  const { lang } = useEnum();

  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });

  const dataCommercialManagementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (creditRequestCode) {
      const foundProspect = mockProspectCredit.find(
        (prospect) => prospect.public_code === creditRequestCode,
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

  const handleApprovalObservationsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditedApprovalObservations(event.target.value);
  };

  const handleSaveApprovalObservations = async () => {
    if (!prospectData) return;

    const updatedProspect: IProspect = {
      ...prospectData,
      clientManagerObservation: editedApprovalObservations,
    };

    try {
      await updateProspect(
        businessUnitPublicCode,
        businessManagerCode,
        updatedProspect,
      );

      if (setDataProspect) {
        setDataProspect((prevProspects) =>
          prevProspects.map((prospect) =>
            prospect.prospectId === prospectData.prospectId
              ? {
                  ...prospect,
                  clientManagerObservation: editedApprovalObservations,
                }
              : prospect,
          ),
        );
      }

      if (onProspectUpdate) {
        onProspectUpdate(updatedProspect);
      }

      setShowEditApprovalModal(false);
      handleCloseModal();

      addFlag({
        title: dataCreditProspectEnum.successTitle.i18n[lang],
        description: dataCreditProspectEnum.successDescription.i18n[lang],
        appearance: "success",
        duration: 5000,
      });
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(dataCreditProspectEnum.errorCredit.i18n[lang]);
    }
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
      setIsSendingData(true);
      const updatedProspect = await addCreditProductService(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
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
      setIsSendingData(false);
    } catch (error) {
      setIsSendingData(false);
      setMessageError(`${errorMessage.addCreditProduct.description}`);
      setShowErrorModal(true);
    }
  };

  const handlePdfGeneration = () => {
    print();
  };

  const borrower = dataProspect?.borrowers?.[0];

  const dataMaximumCreditLimitService = {
    identificationDocumentType: borrower?.borrowerIdentificationType || "",
    identificationDocumentNumber: borrower?.borrowerIdentificationNumber || "",
    moneyDestination: dataProspect?.moneyDestinationAbbreviatedName || "",
    primaryIncomeType:
      borrower?.borrowerProperties?.find(
        (property) => property.propertyName === "PeriodicSalary",
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
          <Stack gap="10px" justifyContent="end" alignItems="center">
            <Button
              type="button"
              appearance="primary"
              spacing="compact"
              disabled={editCreditApplication || availableEditCreditRequest}
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
              {dataCreditProspectEnum.addProduct.i18n[lang]}
            </Button>
            {editCreditApplication ||
              (availableEditCreditRequest && (
                <Icon
                  icon={<MdOutlineInfo />}
                  appearance="primary"
                  size="16px"
                  cursorHover
                  onClick={handleInfo}
                />
              ))}
            {prospectData?.creditProducts?.some(
              (product) =>
                Array.isArray(product.extraordinaryInstallments) &&
                product.extraordinaryInstallments.length > 0,
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
                {dataCreditProspectEnum.extraPayment.i18n[lang]}
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
                      product.extraordinaryInstallments.length > 0,
                  ) || false,
                  lang,
                )}
                onMouseLeave={showMenu}
              />
            </StyledContainerIcon>
          </Stack>
        </StyledPrint>
      )}
      <StyledPrintCardProspect>
        <Stack direction="column">
          <CardCommercialManagement
            id={creditRequestCode!}
            dataRef={dataCommercialManagementRef}
            moneyDestination={dataProspect?.moneyDestinationAbbreviatedName}
            businessManagerCode={businessManagerCode}
            clientIdentificationNumber={
              dataMaximumCreditLimitService.identificationDocumentNumber
            }
            onClick={() => handleOpenModal("editProductModal")}
            prospectData={prospectData || undefined}
            onProspectUpdate={onProspectUpdate}
            availableEditCreditRequest={availableEditCreditRequest}
          />
        </Stack>
      </StyledPrintCardProspect>
      {openModal === "reciprocityModal" && (
        <ReciprocityModal
          handleClose={() => {
            if (setOpenModal) setOpenModal(null);
          }}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          clientIdentificationNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
        />
      )}
      {openModal === "scoreModal" && (
        <ScoreModal
          handleClose={() => {
            if (setOpenModal) setOpenModal(null);
          }}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          clientIdentificationNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
        />
      )}
      {currentModal === "editProductModal" && (
        <AddProductModal
          title={dataCreditProspectEnum.addProduct.i18n[lang]}
          confirmButtonText={dataCreditProspectEnum.save.i18n[lang]}
          initialValues={initialValues}
          iconBefore={<MdOutlineAdd />}
          onCloseModal={handleCloseModal}
          onConfirm={handleConfirm}
          moneyDestination={dataMaximumCreditLimitService.moneyDestination}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          isSendingData={isSendingData}
          identificationDocumentNumber={
            dataMaximumCreditLimitService.identificationDocumentNumber
          }
          identificationDocumentType={
            dataMaximumCreditLimitService.identificationDocumentType
          }
          dataProspect={dataProspect as IProspect}
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
          setOpenModal={setOpenModal as (modal: string) => void}
          availableEditCreditRequest={availableEditCreditRequest}
        />
      )}
      {openModal === "IncomeModalEdit" && (
        <IncomeModal
          handleClose={() => {
            if (setOpenModal) {
              setOpenModal(null);
            }
          }}
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
          availableEditCreditRequest={availableEditCreditRequest}
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
          availableEditCreditRequest={availableEditCreditRequest}
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
          description={
            availableEditCreditRequest
              ? optionsDisableStage.description
              : privilegeCrediboard.description
          }
          nextButtonText={privilegeCrediboard.nextButtonText}
          isMobile={isMobile}
        />
      )}
      {currentModal === "observationsModal" && (
        <>
          <BaseModal
            width={isMobile ? "300px" : "500px"}
            title={dataCreditProspectEnum.observations.i18n[lang]}
            handleClose={handleCloseModal}
            handleNext={() => {
              setEditedApprovalObservations(
                dataProspect?.clientManagerObservation || "",
              );
              setShowEditApprovalModal(true);
            }}
            nextButton="Modificar"
            backButton="Cancelar"
          >
            <Stack direction="column" gap="16px">
              <CardGray
                apparencePlaceHolder="gray"
                label={dataCreditProspectEnum.approvalObservations.i18n[lang]}
                placeHolder={
                  dataProspect?.clientManagerObservation === ""
                    ? dataCreditProspectEnum.approvalObservations.i18n[lang]
                    : dataCreditProspectEnum.approvalObservationsNotFound.i18n[
                        lang
                      ]
                }
              />
              <CardGray
                apparencePlaceHolder="gray"
                label={dataCreditProspectEnum.clientsObservations.i18n[lang]}
                placeHolder={
                  dataProspect?.clientManagerObservation === ""
                    ? dataCreditProspectEnum.approvalObservations.i18n[lang]
                    : dataCreditProspectEnum.clientsObservationsNotFound.i18n[
                        lang
                      ]
                }
              />
            </Stack>
          </BaseModal>
        </>
      )}

      {showEditApprovalModal && (
        <BaseModal
          width={isMobile ? "300px" : "500px"}
          title={dataCreditProspectEnum.observations.i18n[lang]}
          handleClose={() => setShowEditApprovalModal(false)}
          handleNext={handleSaveApprovalObservations}
          nextButton="Guardar"
          backButton="Cancelar"
        >
          <Stack direction="column" gap="16px">
            <Textarea
              id="approvalObservations"
              label={dataCreditProspectEnum.approvalObservations.i18n[lang]}
              value={editedApprovalObservations}
              onChange={handleApprovalObservationsChange}
              maxLength={250}
              fullwidth
            />
            <CardGray
              apparencePlaceHolder="gray"
              label={dataCreditProspectEnum.clientsObservations.i18n[lang]}
              placeHolder={dataProspect?.clientComments}
            />
          </Stack>
        </BaseModal>
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
    </Stack>
  );
}
