import { useState, useMemo, useEffect } from "react";
import { MdInfoOutline, MdErrorOutline } from "react-icons/md";
import {
  Divider,
  Icon,
  Stack,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  SkeletonLine
} from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";
import { getMaximumCreditLimitBasedOnPaymentCapacityByLineOfCredit } from "@services/creditLimit/getMaximumCreditLimitBasedOnPaymentCapacityByLineOfCredit";
import { IMaximumCreditLimit } from "@services/creditLimit/getMaximumCreditLimitBasedOnPaymentCapacityByLineOfCredit/types";
import { IdataMaximumCreditLimitService } from "@pages/simulateCredit/CreditLimitCard/types";
import { formatPrimaryDate } from "@utils/formatData/date";

import { BaseModal } from "../baseModal";
import {
  dataTabs,
  headers,
  paymentCapacityData,
  getMaxValueText
} from "./config";
import { StyledTable } from "./styles";
import { ISourcesOfIncomeState } from "./types";

interface IPaymentCapacityModalProps {
  isMobile: boolean;
  handleClose: () => void;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  dataMaximumCreditLimitService: IdataMaximumCreditLimitService;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  loading: boolean;
  incomeData: ISourcesOfIncomeState;
}

export function PayCapacityModal(props: IPaymentCapacityModalProps) {
  const {
    isMobile,
    dataMaximumCreditLimitService,
    handleClose,
    setError,
    setLoading,
    loading,
    error,
    incomeData,
    businessUnitPublicCode,
    businessManagerCode,
  } = props;
  const [currentTab, setCurrentTab] = useState("ordinary");
  const [maximumCreditLimitData, setMaximumCreditLimitData] =
    useState<IMaximumCreditLimit | null>(null);

  const tabsToRender = useMemo(() => {
    const hasExtraordinary =
      maximumCreditLimitData?.extraordinaryInstallments &&
      maximumCreditLimitData.extraordinaryInstallments.length > 0;

    if (hasExtraordinary) {
      return dataTabs;
    }

    return dataTabs.filter((tab) => tab.id !== "extraordinary");
  }, [maximumCreditLimitData]);

  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  const memoizedDataMaximumCreditLimitService = useMemo(() => dataMaximumCreditLimitService, [dataMaximumCreditLimitService]);
  const memoizedIncomeData = useMemo(() => incomeData, [incomeData]);

  useEffect(() => {
    const fetchMaximumCreditLimit = async () => {
      setLoading(true);
      setError(false);

      try {
        const submitData: IMaximumCreditLimit = {
          customerCode: memoizedDataMaximumCreditLimitService.identificationDocumentNumber,
          dividends: memoizedIncomeData.Dividends || 0,
          financialIncome: memoizedIncomeData.FinancialIncome || 0,
          leases: memoizedIncomeData.Leases || 0,
          lineOfCreditAbbreviatedName:
            memoizedDataMaximumCreditLimitService.lineOfCreditAbbreviatedName || "",
          moneyDestination: memoizedDataMaximumCreditLimitService.moneyDestination,
          otherNonSalaryEmoluments: memoizedIncomeData.OtherNonSalaryEmoluments || 0,
          pensionAllowances: memoizedIncomeData.PensionAllowances || 0,
          periodicSalary: memoizedIncomeData.PeriodicSalary || 0,
          personalBusinessUtilities: memoizedIncomeData.PersonalBusinessUtilities || 0,
          professionalFees: memoizedIncomeData.ProfessionalFees || 0,
        };

        const data = await getMaximumCreditLimitBasedOnPaymentCapacityByLineOfCredit(
          businessUnitPublicCode,
          businessManagerCode,
          submitData,
        );

        if (data) {
          setMaximumCreditLimitData(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMaximumCreditLimit();
  }, [
    businessUnitPublicCode,
    businessManagerCode,
    memoizedDataMaximumCreditLimitService,
    memoizedIncomeData,
    setLoading,
    setError
  ]);

  const totalExtraordinary =
    (maximumCreditLimitData?.maximumCreditLimitValue || 0) +
    (maximumCreditLimitData?.extraordinaryInstallments?.reduce(
      (sum, quote) => sum + (Number(quote.installmentAmount) || 0),
      0,
    ) || 0);

  const maximumTotalAmount =
    (maximumCreditLimitData?.maximumCreditLimitValue || 0) +
    (maximumCreditLimitData?.extraordinaryInstallments?.reduce(
      (sum, installment) => sum + (Number(installment.installmentAmount) || 0),
      0,
    ) || 0);
  return (
    <BaseModal
      title="Monto máx. según capacidad de pago"
      nextButton="Cerrar"
      variantNext="outlined"
      handleClose={handleClose}
      handleNext={handleClose}
      width={isMobile ? "305px" : "500px"}
      height={isMobile ? "580px" : "692px"}
    >
      {error ? (
        <Fieldset>
          <Stack
            direction="column"
            alignItems="center"
            gap="16px"
            padding="24px 8px"
          >
            <Icon icon={<MdErrorOutline />} size="32px" appearance="danger" />
            <Text size="large" weight="bold" appearance="danger">
              {paymentCapacityData.errorDate}
            </Text>
            <Text size="small" appearance="dark" textAlign="center">
              {paymentCapacityData.errorNoData}
            </Text>
          </Stack>
        </Fieldset>
      ) : (
        <Stack
          direction="column"
          height={isMobile ? "355px" : "530px"}
          width={isMobile ? "260px" : "auto"}
        >
          <Fieldset>
            <Stack
              direction="column"
              gap="16px"
              padding={isMobile ? "0 3px" : "0 8px"}
              height={isMobile ? "170px" : "350px"}
            >
              <Stack width="100%" padding="0">
                <Tabs
                  selectedTab={currentTab}
                  tabs={tabsToRender}
                  onChange={onChange}
                  scroll={isMobile}
                />
              </Stack>
              {currentTab === "ordinary" && (
                <Stack direction="column" gap="16px" >
                  <Stack justifyContent="space-between">
                    <Text type="body" size="medium" weight="bold">
                      {paymentCapacityData.incomeSources}
                    </Text>
                    <Stack alignItems="center" gap="4px">
                      <Text appearance="success">$</Text>
                      {loading ? (
                        <SkeletonLine width="70px" animated={true} />
                      ) : (
                        <Text type="body" size="small">
                          {currencyFormat(
                            maximumCreditLimitData?.maximumCreditLimitValue ||
                            0,
                            false,
                          )}
                        </Text>
                      )}
                    </Stack>
                  </Stack>
                  <Stack justifyContent="space-between">
                    <Text type="body" size="medium" appearance="gray">
                      {paymentCapacityData.subsistenceReserve}
                    </Text>
                    <Stack alignItems="center" gap="4px">
                      <Text appearance="success">$</Text>
                      {loading ? (
                        <SkeletonLine width="70px" animated={true} />
                      ) : (
                        <Text type="body" size="small">
                          {currencyFormat(
                            maximumCreditLimitData?.basicLivingExpenseReserve ||
                            0,
                            false,
                          )}
                        </Text>
                      )}
                    </Stack>
                  </Stack>
                  <Divider dashed />
                  <Stack justifyContent="space-between">
                    <Text type="body" size="medium" weight="bold">
                      {paymentCapacityData.newPromises}
                    </Text>
                    <Stack alignItems="center" gap="4px">
                      <Text appearance="success">$</Text>
                      {loading ? (
                        <SkeletonLine width="70px" animated={true} />
                      ) : (
                        <Text type="body" size="small">
                          {currencyFormat(
                            maximumCreditLimitData?.maxAmount || 0,
                            false,
                          )}
                        </Text>
                      )}
                    </Stack>
                  </Stack>
                  <Stack justifyContent="space-between">
                    <Text type="body" size="medium" appearance="gray">
                      {paymentCapacityData.getLineOfCredit(
                        maximumCreditLimitData?.lineOfCreditAbbreviatedName ||
                        "",
                      )}
                    </Text>
                    <Stack alignItems="center" gap="4px">
                      {loading ? (
                        <SkeletonLine width="70px" animated={true} />
                      ) : (
                        <Text type="body" size="small">
                          {maximumCreditLimitData?.maxTerm + paymentCapacityData.months}
                        </Text>
                      )}
                    </Stack>
                  </Stack>
                  <Divider dashed />
                  <Text type="body" size="small">
                    {getMaxValueText(
                      maximumCreditLimitData?.maxAmount || 0,
                      maximumCreditLimitData?.maxTerm || 0,
                    )}
                  </Text>
                  <Stack direction="column" alignItems="center" margin="0 0 8px 0">
                    {loading ? (
                      <SkeletonLine width="250px" height="50px" animated={true} />
                    ) : (
                      <>
                        <Text
                          type="headline"
                          size="small"
                          weight="bold"
                          appearance="gray"
                        >
                          {currencyFormat(
                            maximumCreditLimitData?.maximumCreditLimitValue ||
                            0,
                            true,
                          )}
                        </Text>
                        <Text type="body" size="small" appearance="gray">
                          {paymentCapacityData.maxValueDescription}
                        </Text>
                      </>
                    )}
                  </Stack>
                </Stack>
              )}
              {currentTab === "extraordinary" &&
                maximumCreditLimitData?.extraordinaryInstallments !==
                undefined && (
                  <StyledTable>
                    <Table tableLayout="auto">
                      <Thead>
                        <Tr>
                          {headers.map((header) => (
                            <Th key={header.key} align="center">
                              {header.label}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {loading && (
                          <Tr>
                            <Td colSpan={headers.length} align="center">
                              <SkeletonLine width="100%" animated={true} />
                            </Td>
                          </Tr>
                        )}
                        {
                          !loading &&
                            maximumCreditLimitData?.extraordinaryInstallments &&
                            maximumCreditLimitData.extraordinaryInstallments
                              .length > 0 ? (
                            maximumCreditLimitData.extraordinaryInstallments.map(
                              (row, rowIndex) => (
                                <Tr key={rowIndex} zebra={rowIndex % 2 !== 0}>
                                  <Td align="center">
                                    {row.paymentChannelAbbreviatedName}
                                  </Td>
                                  <Td align="center">
                                    {currencyFormat(
                                      Number(row.installmentAmount) || 0,
                                      true,
                                    )}
                                  </Td>
                                  <Td align="center">{formatPrimaryDate(new Date(row.installmentDate))}</Td>
                                </Tr>
                              ),
                            )
                          ) : (
                            <Tr>
                              <Td colSpan={headers.length} align="center">
                                <Text type="body" size="small" appearance="gray">
                                  {paymentCapacityData.noExtraordinary}
                                </Text>
                              </Td>
                            </Tr>
                          )}
                      </Tbody>
                    </Table>
                    <Stack direction="column" gap="8px" margin="8px 0 0 0" justifyContent="center" alignContent="center" alignItems="center" >
                      <Text type="body" size="small">
                        {paymentCapacityData.maxValueAmount}
                      </Text>
                      <Stack direction="column" alignItems="center">
                        <Stack alignItems="center" gap="4px">
                          {loading ? (
                            <SkeletonLine width="150px" animated={true} />
                          ) : (
                            <>
                              <Text
                                type="headline"
                                size="small"
                                weight="bold"
                                appearance="gray"
                              >
                                {currencyFormat(maximumTotalAmount, true)}
                              </Text>
                              <Icon
                                appearance="primary"
                                icon={<MdInfoOutline />}
                                size="14px"
                                spacing="narrow"
                              />
                            </>
                          )}
                        </Stack>
                        <Text type="body" size="small" appearance="gray">
                          {paymentCapacityData.maxAmountOridinary}
                        </Text>
                      </Stack>
                    </Stack>
                  </StyledTable>
                )}
            </Stack>
          </Fieldset>
          <Fieldset>
            <Stack direction="column" gap="6px" padding="0px 8px">
              <Stack alignItems="center">
                <Icon
                  appearance="help"
                  icon={<MdInfoOutline />}
                  size="16px"
                  spacing="narrow"
                />
                <Text margin="0px 5px" size="small">
                  {paymentCapacityData.maxAmountExtraordinary}
                </Text>
              </Stack>
              <Stack direction="column" alignItems="center" gap="4px">
                {loading ? (
                  <SkeletonLine width="250px" height="50px" animated={true} />
                ) : (
                  <>
                    <Text
                      type="headline"
                      size="large"
                      weight="bold"
                      appearance="primary"
                    >
                      {currencyFormat(totalExtraordinary, true)}
                    </Text>
                    <Text type="body" size="small" appearance="gray">
                      {paymentCapacityData.maxTotal}
                    </Text>
                  </>
                )}
              </Stack>
            </Stack>
          </Fieldset>
        </Stack>
      )}
    </BaseModal>
  );
}