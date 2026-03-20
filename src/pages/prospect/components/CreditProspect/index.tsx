import { useEffect, useRef, useState, useCallback, useContext } from "react";
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
import { IAddProduct } from "@services/creditRequest/addCreditProduct/types";

import {
  IProspect,
  IProspectSummaryById,
} from "@services/creditRequest/query/ProspectByCode/types";
import {
  StyledContainerIcon,
  StyledVerticalDivider,
} from "@pages/board/outlets/financialReporting/CommercialManagement/styles";
import {
  incomeOptions,
  menuOptions,
} from "@pages/board/outlets/financialReporting/CommercialManagement/config/config";
import { CardCommercialManagement } from "@pages/board/outlets/financialReporting/CommercialManagement/CardCommercialManagement";
import { IExtraordinaryInstallmentsAddSeries } from "@services/creditRequest/query/ProspectByCode/types";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { IncomeBorrowersModal } from "@components/modals/incomeBorrowersModal";
import { privilegeCrediboard, optionsDisableStage } from "@config/privilege";
import { BaseModal } from "@components/modals/baseModal";
import { CardGray } from "@components/cards/CardGray";
import { updateProspect } from "@services/prospect/updateProspect";
import { useEnum } from "@hooks/useEnum";
import { ICrediboardData } from "@context/AppContext/types";
import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { documentClientNumber } from "@utils/documentClientNumber";
import { addCreditProduct } from "@services/creditRequest/addCreditProduct";
import { getSearchProspectByCode } from "@services/creditRequest/query/ProspectByCode";
import { IAllEnumsResponse } from "@services/enumerators/types";
import { SystemStateContext } from "@context/systemStateContext";
import {
  manageShowError,
  IError,
} from "@context/systemStateContextProvider/utils";

import { AddProductModal } from "../AddProductModal";
import { configModal, dataCreditProspectEnum } from "./config";
import { StyledPrint, StyledPrintCardProspect } from "./styles";
import { IIncomeSources } from "./types";
import { IncomeModal } from "../modals/IncomeModal";
import { ShareCreditModal } from "../modals/ShareCreditModal";
import InfoModal from "../modals/InfoModal";
import { ICustomerData } from "../AddProductModal/config";
import { ScoreModalProspect } from "../ScoreModalProspect";

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
  sentData: IExtraordinaryInstallmentsAddSeries | null;
  currentModal: string;
  eventData: ICrediboardData;
  handleOpenModal: (modalName: string) => void;
  handleCloseModal: () => void;
  creditRequestCode?: string;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallmentsAddSeries | null>
  >;
  prospectData?: IProspect;
  onProspectUpdate?: (prospect: IProspect) => void;
  onProspectRefreshData?: () => Promise<void>;
  generalLoading: boolean;
  setGeneralLoading: (
    isLoading: boolean | ((prev: boolean) => boolean),
  ) => void;
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
  showAddProduct?: boolean;
  customerData: ICustomerData;
}

export function CreditProspect(props: ICreditProspectProps) {
  const {
    borrowersProspect,
    borrowerOptions,
    selectedIndex,
    dataProspect,
    eventData,
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
    generalLoading,
    setGeneralLoading,
    setOpenModal,
    currentModal,
    handleOpenModal,
    handleCloseModal,
    onProspectRefreshData,
    showAddProduct = true,
    customerData,
  } = props;
  const { setShowModalError, setMessageError } = useContext(SystemStateContext);
  const [showShareModal, setShowShareModal] = useState(false);
  const [prospectSummaryData, setProspectSummaryData] =
    useState<IProspectSummaryById>({} as IProspectSummaryById);
  const [showEditApprovalModal, setShowEditApprovalModal] = useState(false);
  const [editedApprovalObservations, setEditedApprovalObservations] =
    useState("");

  const [isAddProductDisabled, setIsAddProductDisabled] = useState(true);
  const { addFlag } = useFlag();
  const { lang, enums } = useEnum();
  const [showMessageSuccessModal, setShowMessageSuccessModal] = useState(false);
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });

  const dataCommercialManagementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showMessageSuccessModal) {
      addFlag({
        title: configModal.success.title.i18n[lang],
        description: configModal.success.text.i18n[lang],
        appearance: "success",
        duration: 5000,
      });

      const timeoutId = setTimeout(() => {
        setShowMessageSuccessModal(false);
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMessageSuccessModal]);
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

  const disableAddProduct = useCallback(async () => {
    if (!dataProspect) return;

    try {
      setGeneralLoading(true);
      const lineOfCreditValues = await getLinesOfCreditByMoneyDestination(
        businessUnitPublicCode,
        businessManagerCode,
        dataProspect.moneyDestinationAbbreviatedName,
        customerData.clientIdinteficationNumber,
        eventData.token,
      );
      if (Array.isArray(lineOfCreditValues)) {
        setIsAddProductDisabled(
          lineOfCreditValues.length === dataProspect.creditProducts.length,
        );
      }
    } catch (error) {
      manageShowError(error as IError, setMessageError, setShowModalError);
    } finally {
      setGeneralLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    businessUnitPublicCode,
    dataProspect.moneyDestinationAbbreviatedName,
    dataProspect,
  ]);

  useEffect(() => {
    disableAddProduct();
  }, [dataProspect, disableAddProduct]);

  const handleSaveApprovalObservations = async () => {
    if (!prospectData) return;

    const updatedProspect: IProspect = {
      ...prospectData,
      clientManagerObservation: editedApprovalObservations,
    };

    try {
      setGeneralLoading(true);
      await updateProspect(
        businessUnitPublicCode,
        businessManagerCode,
        updatedProspect,
        eventData.token || "",
        eventData?.user.identificationDocumentNumber || "",
      );

      if (setDataProspect) {
        setDataProspect((prevProspects) =>
          prevProspects.map((prospect: IProspect) =>
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
      manageShowError(error as IError, setMessageError, setShowModalError);
    } finally {
      setGeneralLoading(false);
    }
  };

  const handleConfirm = async (values: FormikValues) => {
    if (!prospectData?.prospectId) {
      console.error("prospectId no está definido");
      return;
    }

    try {
      setGeneralLoading(true);
      const payload: IAddProduct = {
        prospectId: prospectData.prospectId,
        paymentChannelAbbreviatedName:
          values.paymentConfiguration.paymentMethod,
        paymentCycle: values.paymentConfiguration.paymentCycle,
        firstPaymentCycleDate: values.paymentConfiguration.firstPaymentDate,
        lineOfCreditAbbreviatedName: values.selectedProducts[0],
        termLimit: Number(values.maximumTermValue) || 0,
        installmentLimit: Number(values.quotaCapValue) || 0,
        additionalAmount: Number(values.creditAmount),
      };

      await addCreditProduct(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
        eventData.token,
      );

      if (prospectData?.prospectId) {
        const updatedProspect = await getSearchProspectByCode(
          businessUnitPublicCode,
          businessManagerCode,
          creditRequestCode || "",
          eventData.token,
        );
        setDataProspect?.([updatedProspect]);
        if (onProspectUpdate) {
          onProspectUpdate(updatedProspect);
        }
      }
      handleCloseModal();
      setShowMessageSuccessModal(true);
    } catch (error) {
      manageShowError(error as IError, setMessageError, setShowModalError);
    } finally {
      setGeneralLoading(false);
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
            {showAddProduct && !isAddProductDisabled && !generalLoading && (
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
            )}

            {(editCreditApplication || availableEditCreditRequest) &&
              !isAddProductDisabled &&
              !generalLoading && (
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
            id={dataProspect?.prospectId || ""}
            dataRef={dataCommercialManagementRef}
            onClick={() => handleOpenModal("editProductModal")}
            prospectData={prospectData || undefined}
            onProspectUpdate={onProspectUpdate}
            prospectSummaryData={prospectSummaryData}
            setProspectSummaryData={setProspectSummaryData}
            setShowMessageSuccessModal={setShowMessageSuccessModal}
            onProspectRefreshData={onProspectRefreshData}
            showAddProduct={showAddProduct}
            availableEditCreditRequest={availableEditCreditRequest}
            lang={lang}
            enums={enums as IAllEnumsResponse}
            fetchProspectData={onProspectRefreshData}
            disableAddProduct={isAddProductDisabled}
            setGeneralLoading={setGeneralLoading}
            generalLoading={generalLoading}
            creditRequestCode={creditRequestCode}
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
          title="Agregar productos"
          confirmButtonText="Guardar"
          initialValues={initialValues}
          iconBefore={<MdOutlineAdd />}
          onCloseModal={handleCloseModal}
          onConfirm={handleConfirm}
          moneyDestination={prospectData!.moneyDestinationAbbreviatedName}
          businessUnitPublicCode={businessUnitPublicCode}
          customerData={documentClientNumber(dataProspect)}
          businessManagerCode={businessManagerCode}
          dataProspect={prospectData as IProspect}
          isLoading={generalLoading}
          lang={lang}
          eventData={eventData}
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
          handleClose={handleCloseModal}
          prospectData={prospectData}
          sentData={sentData}
          setSentData={setSentData}
          businessUnitPublicCode={businessUnitPublicCode}
          lang={lang}
          customerData={customerData}
          showAddButton={availableEditCreditRequest}
          creditRequestCode={creditRequestCode || ""}
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
      {currentModal === "scores" && (
        <ScoreModalProspect
          isMobile={isMobile}
          handleClose={handleCloseModal}
          lang={lang}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          setShowMessageSuccessModal={setShowMessageSuccessModal}
          eventData={eventData}
          prospectData={prospectData as IProspect}
          onProspectRefreshData={onProspectRefreshData}
        />
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
    </Stack>
  );
}
