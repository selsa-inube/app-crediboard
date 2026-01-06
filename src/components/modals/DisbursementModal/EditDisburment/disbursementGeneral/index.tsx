import { useFormik } from "formik";
import { useEffect, useContext, useMemo, useRef, useCallback } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { AppContext } from "@context/AppContext";
import { ICustomerData } from "@pages/prospect/components/AddProductModal/types";
import { IProspectSummaryById } from "@services/prospect/types";
import { IProspect } from "@services/prospect/types";
import { BaseModal } from "@components/modals/baseModal";
import { ScrollableContainer } from "@pages/prospect/components/AddProductModal/styles";

import { DisbursementWithInternalAccount } from "./disbursementWithInternalAccount/index";
import { DisbursementWithExternalAccount } from "./disbursementWithExternalAccount";
import { DisbursementWithCheckEntity } from "./disbursementWithCheckEntity";
import { DisbursementWithCheckManagement } from "./DisbursementWithCheckManagement";
import { DisbursementWithCash } from "./DisbursementWithCash";
import { disbursemenTabs, modalTitles } from "./config";
import { IDisbursementGeneral, Tab } from "../../types";
import { mapDataIdToTabId } from "../utils";

interface IDisbursementGeneralProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  prospectData: IProspect;
  isSelected: string;
  identificationNumber: string;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IDisbursementGeneral) => void;
  handleTabChange: (id: string) => void;
  prospectSummaryData: IProspectSummaryById | undefined;
  modesOfDisbursement: string[];
  handleClose: () => void;
  handleSave: () => void;
  isLoading?: boolean;
  selectedTab?: string;
  customerData?: ICustomerData;
}

export function DisbursementGeneral(props: IDisbursementGeneralProps) {
  const {
    isMobile,
    initialValues,
    isSelected,
    identificationNumber,
    onFormValid,
    handleOnChange,
    handleTabChange,
    modesOfDisbursement,
    customerData,
    prospectSummaryData,
    handleClose,
    handleSave,
    isLoading,
    prospectData
  } = props;

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => { },
  });

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const userHasChangedTab = useRef(false);
  const initialTabAmountSet = useRef(false);
  const initialDataLoadedRef = useRef(false);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  useEffect(() => {
    if (!initialDataLoadedRef.current && initialValues.amount > 0) {
      formik.setValues(initialValues);
      initialDataLoadedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  useEffect(() => {
    handleOnChange(formik.values);
  }, [formik.values, handleOnChange]);

  const getTotalAmount = useCallback(() => {
    return modesOfDisbursement.reduce((total, modeKey) => {
      const key = modeKey as keyof Omit<IDisbursementGeneral, "amount">;
      const disbursementData = formik.values[key];

      const amount =
        disbursementData &&
          typeof disbursementData === "object" &&
          "amount" in disbursementData
          ? disbursementData.amount || 0
          : 0;
      return total + Number(amount);
    }, 0);
  }, [formik.values, modesOfDisbursement]);

  useEffect(() => {
    const totalAmount = getTotalAmount();

    const isInternalValid = formik.values.Internal_account?.amount
      ? formik.values.Internal_account.accountNumber !== ""
      : true;

    const isExternalValid = formik.values.External_account?.amount
      ? formik.values.External_account.bank !== "" &&
      formik.values.External_account.accountNumber !== "" &&
      formik.values.External_account.accountType !== ""
      : true;

    const isAmountCorrect = totalAmount === initialValues.amount;
    const isValid = isAmountCorrect && isInternalValid && isExternalValid;

    onFormValid(isValid);
  }, [formik.values, getTotalAmount, initialValues.amount, onFormValid]);

  const validTabs = useMemo(() => {
    if (modesOfDisbursement.length === 0) return [];
    const allTabsConfig = Object.values(disbursemenTabs);
    return modesOfDisbursement
      .map((modeId) => allTabsConfig.find((tab) => tab.id === modeId))
      .filter((tab): tab is Tab => tab !== undefined);
  }, [modesOfDisbursement]);

  useEffect(() => {
    if (validTabs.length === 1 && !initialTabAmountSet.current) {
      const tabId = validTabs[0].id;
      const key = tabId as keyof Omit<IDisbursementGeneral, "amount">;

      if (Number(formik.values[key]?.amount) === 0) {
        formik.setFieldValue(`${tabId}.amount`, initialValues.amount);
        initialTabAmountSet.current = true;
      }
    }

    if (validTabs.length > 0 && !userHasChangedTab.current) {
      if (!validTabs.some((tab) => tab.id === isSelected)) {
        handleTabChange(mapDataIdToTabId(isSelected) || validTabs[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validTabs, initialValues.amount, isSelected, handleTabChange, formik.setFieldValue, formik.values]);

  const handleManualTabChange = (tabId: string) => {
    userHasChangedTab.current = true;
    handleTabChange(tabId);
  };

  const isAmountReadOnly = validTabs.length === 1;

  return (
    <BaseModal
      title={modalTitles.title}
      nextButton={modalTitles.save}
      backButton={modalTitles.close}
      handleClose={handleClose}
      handleBack={handleClose}
      handleNext={handleSave}
      isSendingData={isLoading}
      width={isMobile ? "340px" : "682px"}
      height={isMobile ? "auto" : "800px"}
      marginBottom="32px"
      marginTop="32px"
    >
      <Fieldset>
        <ScrollableContainer
          $smallScreen={isMobile}
          $height={isMobile ? "auto" : "calc(100vh - 430px)"}
        >
          <Tabs
            tabs={validTabs}
            selectedTab={isSelected}
            onChange={handleManualTabChange}
            scroll={isMobile}
          />
          <Stack
            direction="column"
            padding={isMobile ? "4px 10px" : "10px 16px"}
            gap="20px"
          >
            <Stack direction="column" width="100%">
              {validTabs.some((tab) => tab.id === disbursemenTabs.internal.id) &&
                isSelected === disbursemenTabs.internal.id && (
                  <DisbursementWithInternalAccount
                    isMobile={isMobile}
                    onFormValid={onFormValid}
                    initialValues={initialValues}
                    handleOnChange={handleOnChange}
                    formik={formik}
                    optionNameForm="Internal_account"
                    getTotalAmount={getTotalAmount}
                    businessUnitPublicCode={businessUnitPublicCode}
                    identificationNumber={identificationNumber}
                    customerData={customerData}
                    isAmountReadOnly={isAmountReadOnly}
                    prospectSummaryData={prospectSummaryData}
                    businessManagerCode={businessManagerCode}
                    prospectData={prospectData}
                  />
                )}
              {validTabs.some((tab) => tab.id === disbursemenTabs.external.id) &&
                isSelected === disbursemenTabs.external.id && (
                  <DisbursementWithExternalAccount
                    isMobile={isMobile}
                    onFormValid={onFormValid}
                    initialValues={initialValues}
                    handleOnChange={handleOnChange}
                    formik={formik}
                    optionNameForm="External_account"
                    getTotalAmount={getTotalAmount}
                    businessManagerCode={businessManagerCode}
                    businessUnitPublicCode={businessUnitPublicCode}
                    identificationNumber={identificationNumber}
                    customerData={customerData}
                    isAmountReadOnly={isAmountReadOnly}
                    prospectData={prospectData}
                  />
                )}
              {validTabs.some((tab) => tab.id === disbursemenTabs.check.id) &&
                isSelected === disbursemenTabs.check.id && (
                  <DisbursementWithCheckEntity
                    isMobile={isMobile}
                    onFormValid={onFormValid}
                    initialValues={initialValues}
                    handleOnChange={handleOnChange}
                    formik={formik}
                    optionNameForm="Certified_check"
                    getTotalAmount={getTotalAmount}
                    businessManagerCode={businessManagerCode}
                    businessUnitPublicCode={businessUnitPublicCode}
                    identificationNumber={identificationNumber}
                    customerData={customerData}
                    isAmountReadOnly={isAmountReadOnly}
                    prospectData={prospectData}
                  />
                )}
              {validTabs.some((tab) => tab.id === disbursemenTabs.management.id) &&
                isSelected === disbursemenTabs.management.id && (
                  <DisbursementWithCheckManagement
                    isMobile={isMobile}
                    onFormValid={onFormValid}
                    initialValues={initialValues}
                    handleOnChange={handleOnChange}
                    formik={formik}
                    optionNameForm="Business_check"
                    getTotalAmount={getTotalAmount}
                    businessManagerCode={businessManagerCode}
                    businessUnitPublicCode={businessUnitPublicCode}
                    identificationNumber={identificationNumber}
                    customerData={customerData}
                    isAmountReadOnly={isAmountReadOnly}
                    prospectData={prospectData}
                  />
                )}
              {validTabs.some((tab) => tab.id === disbursemenTabs.cash.id) &&
                isSelected === disbursemenTabs.cash.id && (
                  <DisbursementWithCash
                    isMobile={isMobile}
                    onFormValid={onFormValid}
                    initialValues={initialValues}
                    handleOnChange={handleOnChange}
                    formik={formik}
                    optionNameForm="Cash"
                    getTotalAmount={getTotalAmount}
                    businessManagerCode={businessManagerCode}
                    businessUnitPublicCode={businessUnitPublicCode}
                    identificationNumber={identificationNumber}
                    customerData={customerData}
                    isAmountReadOnly={isAmountReadOnly}
                    prospectData={prospectData}
                  />
                )}
            </Stack>
          </Stack>
        </ScrollableContainer>
      </Fieldset>
    </BaseModal>
  );
}
