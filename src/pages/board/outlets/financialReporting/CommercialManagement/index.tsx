import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineAdd,
  MdOutlineChevronRight,
  MdOutlineMoreVert,
  MdOutlinePhone,
  MdOutlinePictureAsPdf,
  MdOutlineShare,
  MdOutlineVideocam,
  MdOutlinePayments,
  MdOutlineInfo,
} from "react-icons/md";

import {
  Stack,
  Icon,
  Text,
  Divider,
  useMediaQuery,
  Button,
  SkeletonLine,
} from "@inubekit/inubekit";
import {
  ICreditRequest,
  IModeOfDisbursement,
} from "@services/creditRequest/query/types";
import { IPaymentChannel } from "@services/creditRequest/command/types";
import { MenuProspect } from "@components/navigation/MenuProspect";
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterEachWord,
} from "@utils/formatData/text";
import { ExtraordinaryPaymentModal } from "@components/modals/ExtraordinaryPaymentModal";
import { DisbursementFlowManager } from "@components/modals/DisbursementModal/EditDisburment";
import { Fieldset } from "@components/data/Fieldset";
import { extraordinaryInstallmentMock } from "@mocks/prospect/extraordinaryInstallment.mock";
import { formatPrimaryDate } from "@utils/formatData/date";
import { currencyFormat } from "@utils/formatData/currency";
import { IProspect, ICreditProduct } from "@services/prospect/types";
import { getCreditRequestByCode } from "@services/creditRequest/query/getCreditRequestByCode";
import { getModeOfDisbursement } from "@services/creditRequest/query/getModeOfDisbursement";
import { CreditProspect } from "@pages/prospect/components/CreditProspect";
import { AppContext } from "@context/AppContext";
import { dataTabsDisbursement } from "@components/modals/DisbursementModal/types";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { BaseModal } from "@components/modals/baseModal";
import userNotFound from "@assets/images/ItemNotFound.png";
import { IExtraordinaryInstallmentsAddSeries } from "@services/prospect/types";
import { ReportCreditsModal } from "@components/modals/ReportCreditsModal";
import { IIncomeSources } from "@pages/prospect/components/CreditProspect/types";
import { CreditLimitModal } from "@pages/prospect/components/modals/CreditLimitModal";
import { IncomeModal } from "@pages/prospect/components/modals/IncomeModal";
import { IncomeBorrowersModal } from "@components/modals/incomeBorrowersModal";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { boardColumnsEnum } from "@config/pages/board/board";
import { IProspectSummaryById } from "@services/prospect/types";
import { TruncatedText } from "@components/modals/TruncatedTextModal";
import { useEnum } from "@hooks/useEnum";

import { TBoardColumn } from "../../boardlayout/config/board";
import { titlesModalEnum } from "../ToDo/config";
import { errorMessagesEnum } from "../config";
import {
  incomeOptions,
  menuOptions,
  tittleOptionsEnum,
  initialDisbursementState,
  infoErrorProspectEnum,
} from "./config/config";
import {
  StyledCollapseIcon,
  StyledFieldset,
  StyledContainerIcon,
  StyledVerticalDivider,
  StyledPrint,
  StyledContainerDiverProspect,
} from "./styles";

interface ComercialManagementProps {
  data: ICreditRequest;
  prospectData: IProspect;
  collapse: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
  sentData: IExtraordinaryInstallmentsAddSeries | null;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallmentsAddSeries | null>
  >;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  generateAndSharePdf: () => void;
  creditRequestCode: string;
  errorGetProspects: boolean;
  setErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  isPrint?: boolean;
  hideContactIcons?: boolean;
  requestValue?: IPaymentChannel[];
}

export const ComercialManagement = (props: ComercialManagementProps) => {
  const {
    data,
    isPrint = false,
    collapse,
    setCollapse,
    creditRequestCode,
    hideContactIcons,
    prospectData,
    generateAndSharePdf,
    sentData,
    setSentData,
    setRequestValue,
    errorGetProspects,
    setErrorModal,
    setErrorMessage,
  } = props;

  const [showMenu, setShowMenu] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [modalHistory, setModalHistory] = useState<string[]>([]);
  const [prospectProducts, setProspectProducts] = useState<ICreditProduct[]>(
    [],
  );
  const [localProspectData, setLocalProspectData] =
    useState<IProspect>(prospectData);
  const [disbursementData, setDisbursementData] = useState<{
    internal: IModeOfDisbursement | null;
    external: IModeOfDisbursement | null;
    checkEntity: IModeOfDisbursement | null;
    checkManagement: IModeOfDisbursement | null;
    cash: IModeOfDisbursement | null;
  }>(initialDisbursementState);
  const [requests, setRequests] = useState<ICreditRequest | null>(null);
  const [dataProspect, setDataProspect] = useState<IProspect[]>([]);
  const [incomeData, setIncomeData] = useState<Record<string, IIncomeSources>>(
    {},
  );
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [error, setError] = useState(false);

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

  const navigation = useNavigate();
  const isMobile = useMediaQuery("(max-width: 720px)");
  const { lang } = useEnum();

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.publicCode;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  useEffect(() => {
    setLocalProspectData(prospectData);
    if (prospectData !== undefined) {
      setLoading(false);
    }
  }, [prospectData]);

  const handleOpenModal = (modalName: string) => {
    setModalHistory((prevHistory) => [...prevHistory, modalName]);
  };

  useEffect(() => {
    if (prospectData && Array.isArray(prospectData.creditProducts)) {
      setProspectProducts(prospectData.creditProducts as ICreditProduct[]);
    }
  }, [prospectData]);

  useEffect(() => {
    const fetchCreditRequest = async () => {
      try {
        const data = await getCreditRequestByCode(
          businessUnitPublicCode,
          businessManagerCode,
          creditRequestCode,
          userAccount,
          eventData.token || "",
        );
        setRequests(data[0] as ICreditRequest);
      } catch (error) {
        const err = error as {
          message?: string;
          status?: number;
          data?: { description?: string; code?: string };
        };

        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + (err?.message || "") + (err?.data?.description || "");

        setErrorMessage(description);
        setErrorModal(true);
      }
    };

    if (creditRequestCode) {
      fetchCreditRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    businessUnitPublicCode,
    creditRequestCode,
    userAccount,
    businessManagerCode,
  ]);

  const handleDisbursement = async () => {
    if (requests?.creditRequestId) {
      setLoading(true);
      try {
        const response = await getModeOfDisbursement(
          businessUnitPublicCode,
          businessManagerCode,
          requests.creditRequestId,
          eventData.token || "",
        );

        const typeMapping: Record<
          string,
          keyof typeof initialDisbursementState
        > = {
          Internal_account: "internal",
          External_account: "external",
          Certified_check: "checkEntity",
          Business_check: "checkManagement",
          Cash: "cash",
        };

        const organizedData = response.reduce<{
          internal: IModeOfDisbursement | null;
          external: IModeOfDisbursement | null;
          checkEntity: IModeOfDisbursement | null;
          checkManagement: IModeOfDisbursement | null;
          cash: IModeOfDisbursement | null;
        }>(
          (acc, item) => {
            const key = typeMapping[item.modeOfDisbursementType];
            if (key) {
              acc[key] = item;
            }
            return acc;
          },
          { ...initialDisbursementState },
        );

        setDisbursementData(organizedData);
      } catch (error) {
        const err = error as {
          message?: string;
          status?: number;
          data?: { description?: string; code?: string };
        };

        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + (err?.message || "") + (err?.data?.description || "");

        setErrorMessage(description);
        setErrorModal(true);
      } finally {
        if (prospectData !== undefined) {
          setLoading(false);
        }
      }
    }
  };
  console.log(eventData.token, "aaa");
  const handleCloseModal = () => {
    setModalHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory.pop();
      return newHistory;
    });
  };

  const handleCollapse = () => {
    setCollapse(!collapse);
    setShowMenu(false);
  };

  const currentModal = modalHistory[modalHistory.length - 1];

  const dataDefault: dataTabsDisbursement = {
    disbursementAmount: "",
    isInTheNameOfBorrower: "",
    payeeName: "",
    payeeSurname: "",
    payeeBiologicalSex: "",
    payeeIdentificationType: "",
    payeeIdentificationNumber: "",
    payeeBirthday: "",
    payeePhoneNumber: "",
    payeeEmail: "",
    payeeCityOfResidence: "",
    accountBankName: "",
    accountType: "",
    accountNumber: "",
    observation: "",
  };

  const onChangesReportCredit = (name: string, newValue: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: newValue }));
  };

  const borrowersProspect =
    dataProspect.length > 0 ? dataProspect[0] : undefined;

  const selectedBorrower = borrowersProspect?.borrowers?.[selectedIndex];

  const handleIncomeSubmit = (updatedData: IIncomeSources) => {
    if (selectedBorrower) {
      const borrowerName = selectedBorrower.borrowerName;

      setIncomeData((prev) => ({
        ...prev,
        [borrowerName]: { ...updatedData, edited: true },
      }));

      setDataProspect((prev) => {
        return prev.map((prospect) => {
          const updatedBorrowers = prospect.borrowers.map((borrower) => {
            if (borrower.borrowerName === borrowerName) {
              const updatedProperties = [
                ...borrower.borrowerProperties.filter(
                  (prop) =>
                    ![
                      "PeriodicSalary",
                      "OtherNonSalaryEmoluments",
                      "PensionAllowances",
                      "PersonalBusinessUtilities",
                      "ProfessionalFees",
                      "Leases",
                      "Dividends",
                      "FinancialIncome",
                      "name",
                      "surname",
                    ].includes(prop.propertyName),
                ),
                {
                  propertyName: "PeriodicSalary",
                  propertyValue: updatedData.PeriodicSalary?.toString() || "0",
                },
                {
                  propertyName: "OtherNonSalaryEmoluments",
                  propertyValue:
                    updatedData.OtherNonSalaryEmoluments?.toString() || "0",
                },
                {
                  propertyName: "PensionAllowances",
                  propertyValue:
                    updatedData.PensionAllowances?.toString() || "0",
                },
                {
                  propertyName: "PersonalBusinessUtilities",
                  propertyValue:
                    updatedData.PersonalBusinessUtilities?.toString() || "0",
                },
                {
                  propertyName: "ProfessionalFees",
                  propertyValue:
                    updatedData.ProfessionalFees?.toString() || "0",
                },
                {
                  propertyName: "Leases",
                  propertyValue: updatedData.Leases?.toString() || "0",
                },
                {
                  propertyName: "Dividends",
                  propertyValue: updatedData.Dividends?.toString() || "0",
                },
                {
                  propertyName: "FinancialIncome",
                  propertyValue: updatedData.FinancialIncome?.toString() || "0",
                },
                { propertyName: "name", propertyValue: updatedData.name || "" },
                {
                  propertyName: "surname",
                  propertyValue: updatedData.surname || "",
                },
              ];

              return { ...borrower, borrowerProperties: updatedProperties };
            }
            return borrower;
          });

          return { ...prospect, borrowers: updatedBorrowers };
        });
      });
      setOpenModal(null);
    }
  };

  const borrowerOptions =
    borrowersProspect?.borrowers?.map((borrower) => ({
      id: crypto.randomUUID(),
      label: borrower.borrowerName,
      value: borrower.borrowerName,
    })) ?? [];

  useEffect(() => {
    setDataProspect(prospectData ? [prospectData] : []);
  }, [prospectData]);

  const handleChangeIncome = (_name: string, value: string) => {
    const index = borrowersProspect?.borrowers?.findIndex(
      (borrower) => borrower.borrowerName === value,
    );
    setSelectedIndex(index ?? 0);
  };

  useEffect(() => {
    if (selectedBorrower) {
      const borrowerName = selectedBorrower.borrowerName;
      if (!incomeData[borrowerName]?.edited) {
        setIncomeData((prev) => ({
          ...prev,
          [borrowerName]: {
            identificationNumber: selectedBorrower.borrowerIdentificationNumber,
            identificationType: selectedBorrower.borrowerIdentificationType,
            name:
              getPropertyValue(selectedBorrower.borrowerProperties, "name") ||
              "",
            surname:
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "surname",
              ) || "",
            Leases: parseFloat(
              getPropertyValue(selectedBorrower.borrowerProperties, "Leases") ||
                "0",
            ),
            Dividends: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "Dividends",
              ) || "0",
            ),
            FinancialIncome: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "FinancialIncome",
              ) || "0",
            ),
            PeriodicSalary: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "PeriodicSalary",
              ) || "0",
            ),
            OtherNonSalaryEmoluments: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "OtherNonSalaryEmoluments",
              ) || "0",
            ),
            PensionAllowances: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "PensionAllowances",
              ) || "0",
            ),
            PersonalBusinessUtilities: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "PersonalBusinessUtilities",
              ) || "0",
            ),
            ProfessionalFees: parseFloat(
              getPropertyValue(
                selectedBorrower.borrowerProperties,
                "ProfessionalFees",
              ) || "0",
            ),
            edited: false,
          },
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBorrower]);

  const borrower = dataProspect?.[0]?.borrowers?.[0];

  const dataMaximumCreditLimitService = {
    identificationDocumentType: borrower?.borrowerIdentificationType || "",
    identificationDocumentNumber: borrower?.borrowerIdentificationNumber || "",
    moneyDestination: dataProspect?.[0]?.moneyDestinationAbbreviatedName || "",
    primaryIncomeType:
      borrower?.borrowerProperties?.find(
        (property) => property.propertyName === "PeriodicSalary",
      )?.propertyValue || "",
  };

  const availableEditCreditRequest = !(
    data.stage === "GESTION_COMERCIAL" ||
    data.stage === "VERIFICACION_APROBACION"
  );

  let normalizedStageTitle: TBoardColumn[] | string = boardColumnsEnum.filter(
    (item) => {
      return item.id === data.stage;
    },
  ) as TBoardColumn[];

  if (normalizedStageTitle[0]) {
    normalizedStageTitle = normalizedStageTitle[0].i18n[lang];
  } else {
    normalizedStageTitle = "";
  }

  let prospectSummaryData: IProspectSummaryById = {
    id: "",
    netAmountToDisburse: data.loanAmount,
    requestedAmount: 0,
    deductibleExpenses: 0,
    totalRegularInstallments: 0,
    totalConsolidatedAmount: 0,
  };

  if (prospectData) {
    prospectSummaryData = {
      id: prospectData.prospectId,
      netAmountToDisburse: data.loanAmount,
      requestedAmount: 0,
      deductibleExpenses: 0,
      totalRegularInstallments: 0,
      totalConsolidatedAmount: 0,
    };
  }

  const modesOfDisbursement = [
    ...new Set(
      prospectProducts?.flatMap(
        (product) => product.modeOfDisbursement || [],
      ) || [],
    ),
  ];

  return (
    <>
      <Fieldset
        title={errorMessagesEnum.comercialManagement.titleCard.i18n[lang]}
        descriptionTitle={normalizedStageTitle}
        hasError={!data ? true : false}
      >
        {!data ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessagesEnum.comercialManagement.title.i18n[lang]}
            description={
              errorMessagesEnum.comercialManagement.description.i18n[lang]
            }
            buttonDescription={
              errorMessagesEnum.comercialManagement.button.i18n[lang]
            }
            onRetry={() => navigation(-2)}
          />
        ) : (
          <StyledFieldset>
            <Stack direction="column" gap="6px">
              <Stack justifyContent="space-between" alignItems="center">
                <Stack direction="column">
                  <Stack>
                    <Stack gap="6px" width="max-content">
                      <Text type="title" size="small" appearance="gray">
                        {tittleOptionsEnum.titleCreditId.i18n[lang]}
                      </Text>
                      <Text type="title" size="small">
                        {data.creditRequestCode}
                      </Text>
                      <Text
                        type="title"
                        size="small"
                        appearance="gray"
                        padding={`0px 0px 0px 8px`}
                      >
                        {formatPrimaryDate(
                          new Date(data.creditRequestDateOfCreation),
                        )}
                      </Text>
                    </Stack>
                  </Stack>
                  {isMobile && (
                    <Stack margin="4px 0px">
                      <TruncatedText
                        text={data.clientName}
                        maxLength={50}
                        type="title"
                        size={!isMobile ? "large" : "medium"}
                        transformFn={capitalizeFirstLetterEachWord}
                      />
                    </Stack>
                  )}
                  <Stack gap={!isMobile ? "4px" : "4px"}>
                    <Text type="title" size="small" appearance="gray">
                      {tittleOptionsEnum.titleDestination.i18n[lang]}
                    </Text>
                    <TruncatedText
                      text={data.moneyDestinationAbreviatedName}
                      maxLength={60}
                      type="title"
                      size="small"
                      transformFn={capitalizeFirstLetter}
                    />
                  </Stack>
                  <Stack gap="4px">
                    <Text type="title" size="small" appearance="gray">
                      {tittleOptionsEnum.tittleAmount.i18n[lang]}
                    </Text>
                    <Text type="title" size="small">
                      {data.loanAmount === 0
                        ? "$ 0"
                        : currencyFormat(data.loanAmount)}
                    </Text>
                  </Stack>
                </Stack>

                {!isMobile && (
                  <Stack gap="36px">
                    <TruncatedText
                      text={data.clientName}
                      maxLength={60}
                      type="title"
                      transformFn={capitalizeFirstLetterEachWord}
                    />
                  </Stack>
                )}
                <Stack gap="2px">
                  {!isMobile && (
                    <>
                      <StyledPrint>
                        <Stack gap="16px">
                          <Button
                            type="link"
                            spacing="compact"
                            path={`/extended-card/${creditRequestCode}/credit-profile`}
                          >
                            {tittleOptionsEnum.titleProfile.i18n[lang]}
                          </Button>
                          <Stack gap="2px" alignItems="center">
                            {loading && !errorGetProspects ? (
                              <SkeletonLine
                                width="210px"
                                height="31px"
                                animated
                              />
                            ) : (
                              <Button
                                type="button"
                                spacing="compact"
                                variant="outlined"
                                onClick={() => {
                                  handleDisbursement();
                                  handleOpenModal("disbursementModal");
                                }}
                                disabled={errorGetProspects}
                              >
                                {tittleOptionsEnum.titleDisbursement.i18n[lang]}
                              </Button>
                            )}
                            {errorGetProspects && (
                              <Icon
                                icon={<MdOutlineInfo />}
                                appearance="primary"
                                size="16px"
                                cursorHover
                                onClick={() => setInfoModal(true)}
                              />
                            )}
                          </Stack>
                        </Stack>
                      </StyledPrint>
                      {!hideContactIcons && (
                        <>
                          <StyledVerticalDivider />
                          <StyledPrint>
                            <Icon
                              icon={<MdOutlinePhone />}
                              appearance="primary"
                              size="24px"
                              cursorHover
                            />
                          </StyledPrint>
                          <StyledPrint>
                            <Icon
                              icon={<MdOutlineVideocam />}
                              appearance="primary"
                              size="24px"
                              cursorHover
                            />
                          </StyledPrint>
                        </>
                      )}
                      <StyledVerticalDivider />
                    </>
                  )}
                  <StyledCollapseIcon
                    $collapse={collapse}
                    onClick={handleCollapse}
                  >
                    <StyledPrint>
                      <Icon
                        icon={<MdOutlineChevronRight />}
                        appearance="primary"
                        size={"26px"}
                        cursorHover
                      />
                    </StyledPrint>
                  </StyledCollapseIcon>
                </Stack>
              </Stack>

              {isMobile && (
                <>
                  <StyledPrint>
                    <Button
                      type="link"
                      spacing="compact"
                      path={`/extended-card/${creditRequestCode}/credit-profile`}
                      fullwidth
                    >
                      {tittleOptionsEnum.titleProfile.i18n[lang]}
                    </Button>
                  </StyledPrint>
                  <StyledPrint>
                    <Button
                      type="button"
                      spacing="compact"
                      variant="outlined"
                      onClick={() => {
                        handleDisbursement();
                        handleOpenModal("disbursementModal");
                      }}
                      fullwidth
                    >
                      {tittleOptionsEnum.titleDisbursement.i18n[lang]}
                    </Button>
                  </StyledPrint>
                </>
              )}
              {isMobile && !hideContactIcons && (
                <Stack gap="16px" padding="12px 0px 12px 0px">
                  <Button
                    spacing="compact"
                    variant="outlined"
                    fullwidth
                    iconBefore={<MdOutlinePhone />}
                  >
                    {tittleOptionsEnum.titleCall.i18n[lang]}
                  </Button>
                  <Button
                    spacing="compact"
                    variant="outlined"
                    fullwidth
                    iconBefore={<MdOutlineVideocam />}
                  >
                    {tittleOptionsEnum.titleVideoCall.i18n[lang]}
                  </Button>
                </Stack>
              )}

              {collapse && <Divider />}
              {collapse && (
                <>
                  {isMobile && (
                    <StyledPrint>
                      <Stack padding="10px 0px" width="100%">
                        <Button
                          type="button"
                          appearance="primary"
                          spacing="compact"
                          fullwidth
                          iconBefore={
                            <Icon
                              icon={<MdOutlineAdd />}
                              appearance="light"
                              size="18px"
                              spacing="narrow"
                            />
                          }
                          disabled={availableEditCreditRequest}
                          onClick={() => handleOpenModal("editProductModal")}
                        >
                          {tittleOptionsEnum.titleAddProduct.i18n[lang]}
                        </Button>
                      </Stack>
                    </StyledPrint>
                  )}
                </>
              )}
              {collapse && (
                <>
                  <StyledPrint>
                    {isMobile && (
                      <Stack padding="0px 0px 10px">
                        {prospectProducts?.some(
                          (product) => product.extraordinaryInstallments,
                        ) && (
                          <Button
                            type="button"
                            appearance="primary"
                            spacing="compact"
                            variant="outlined"
                            fullwidth
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
                            {tittleOptionsEnum.titleExtraPayments.i18n[lang]}
                          </Button>
                        )}
                      </Stack>
                    )}
                  </StyledPrint>
                </>
              )}
              {collapse && (
                <>
                  {isMobile && (
                    <StyledPrint>
                      <Stack justifyContent="end">
                        <StyledContainerIcon>
                          <Icon
                            icon={<MdOutlinePictureAsPdf />}
                            appearance="primary"
                            size="24px"
                            disabled={isPrint}
                            cursorHover
                            onClick={print}
                          />
                          <Icon
                            icon={<MdOutlineShare />}
                            appearance="primary"
                            size="24px"
                            cursorHover
                            onClick={async () => await generateAndSharePdf()}
                          />
                          <Icon
                            icon={<MdOutlineMoreVert />}
                            appearance="primary"
                            size="24px"
                            cursorHover
                            onClick={() => setShowMenu(!showMenu)}
                          />
                          {showMenu && (
                            <MenuProspect
                              options={menuOptions(
                                handleOpenModal,
                                prospectProducts?.some(
                                  (product) =>
                                    product.extraordinaryInstallments,
                                ),
                                lang,
                              )}
                            />
                          )}
                        </StyledContainerIcon>
                      </Stack>
                    </StyledPrint>
                  )}
                </>
              )}
              <StyledContainerDiverProspect>
                {collapse && <Stack>{isMobile && <Divider />}</Stack>}
              </StyledContainerDiverProspect>
              {collapse && (
                <CreditProspect
                  key={refreshKey}
                  borrowersProspect={borrowersProspect}
                  borrowerOptions={borrowerOptions}
                  selectedIndex={selectedIndex}
                  dataProspect={dataProspect[0]}
                  selectedBorrower={selectedBorrower}
                  incomeData={incomeData}
                  isMobile={isMobile}
                  prospectData={localProspectData}
                  businessManagerCode={businessManagerCode}
                  showPrint
                  showMenu={() => setShowMenu(false)}
                  handleChange={handleChangeIncome}
                  isPrint={true}
                  handleIncomeSubmit={handleIncomeSubmit}
                  sentData={sentData}
                  setSentData={setSentData}
                  setRequestValue={setRequestValue}
                  businessUnitPublicCode={businessUnitPublicCode}
                  generateAndSharePdf={generateAndSharePdf}
                  setDataProspect={setDataProspect}
                  creditRequestCode={creditRequestCode}
                  availableEditCreditRequest={availableEditCreditRequest}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  currentModal={currentModal}
                  eventData={eventData}
                  handleOpenModal={handleOpenModal}
                  handleCloseModal={handleCloseModal}
                  onProspectUpdate={(prospect) => {
                    setLocalProspectData(prospect);
                    setRefreshKey((prev) => prev + 1);
                  }}
                />
              )}
            </Stack>
            {currentModal === "creditLimit" && (
              <CreditLimitModal
                isMobile={isMobile}
                handleClose={handleCloseModal}
                businessUnitPublicCode={businessUnitPublicCode}
                businessManagerCode={businessManagerCode}
                dataMaximumCreditLimitService={{
                  ...dataMaximumCreditLimitService,
                  lineOfCreditAbbreviatedName: "creditLineTxt",
                }}
                setError={setError}
                setLoading={setLoading}
                error={error}
                loading={loading}
                incomeData={incomeData}
                moneyDestination={data.moneyDestinationAbreviatedName}
                setRequestValue={setRequestValue}
              />
            )}
            {currentModal === "IncomeModal" && (
              <IncomeBorrowersModal
                borrowersProspect={borrowersProspect}
                borrowerOptions={borrowerOptions}
                selectedIndex={selectedIndex}
                dataProspect={dataProspect[0]}
                selectedBorrower={selectedBorrower}
                isMobile={isMobile}
                handleCloseModal={handleCloseModal}
                handleChange={handleChangeIncome}
                setOpenModal={setOpenModal}
                availableEditCreditRequest={availableEditCreditRequest}
              />
            )}
            {currentModal === "reportCreditsModal" && (
              <ReportCreditsModal
                onChange={onChangesReportCredit}
                debtor={form.borrower}
                handleClose={handleCloseModal}
                prospectData={prospectData ? [prospectData] : undefined}
                options={incomeOptions}
                businessUnitPublicCode={businessUnitPublicCode}
                creditRequestCode={creditRequestCode}
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
                creditRequestCode={creditRequestCode}
                businessUnitPublicCode={businessUnitPublicCode}
                businessManagerCode={businessManagerCode}
                availableEditCreditRequest={availableEditCreditRequest}
              />
            )}
            {openModal === "IncomeModalEdit" && (
              <IncomeModal
                handleClose={() => setOpenModal(null)}
                initialValues={
                  selectedBorrower && incomeData[selectedBorrower.borrowerName]
                }
                onSubmit={handleIncomeSubmit}
                businessUnitPublicCode={businessUnitPublicCode}
                creditRequestCode={creditRequestCode}
                businessManagerCode={businessManagerCode}
                borrowerOptions={borrowerOptions}
              />
            )}
            {currentModal === "disbursementModal" && (
              <DisbursementFlowManager
                dataDefault={dataDefault}
                handleClose={handleCloseModal}
                identificationNumber={
                  selectedBorrower?.borrowerIdentificationNumber || ""
                }
                initialDisbursementData={disbursementData}
                isMobile={isMobile}
                parentLoading={loading}
                prospectSummaryData={prospectSummaryData}
                modesOfDisbursement={modesOfDisbursement}
                prospectData={prospectData}
                businessUnitPublicCode={businessUnitPublicCode}
                businessManagerCode={businessManagerCode}
                creditRequestCode={creditRequestCode}
                setErrorMessage={setErrorMessage}
                setErrorModal={setErrorModal}
              />
            )}
            {infoModal && (
              <>
                <BaseModal
                  title={titlesModalEnum.title.i18n[lang]}
                  nextButton={titlesModalEnum.textButtonNext.i18n[lang]}
                  handleNext={() => setInfoModal(false)}
                  handleClose={() => setInfoModal(false)}
                  width={isMobile ? "290px" : "400px"}
                >
                  <Stack gap="16px" direction="column">
                    <Text weight="bold" size="large">
                      {titlesModalEnum.subTitle.i18n[lang]}
                    </Text>
                    <Text weight="normal" size="medium" appearance="gray">
                      {errorGetProspects
                        ? infoErrorProspectEnum.description.i18n[lang]
                        : titlesModalEnum.description.i18n[lang]}
                    </Text>
                  </Stack>
                </BaseModal>
              </>
            )}
          </StyledFieldset>
        )}
      </Fieldset>
    </>
  );
};
