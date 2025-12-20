import { useEffect, useRef, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import { Stack, Text, Divider, useFlag, Toggle, Checkbox, Textarea, Select, Textfield, inube, SkeletonLine } from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { currencyFormat, handleChangeWithCurrency, validateCurrencyField } from "@utils/formatData/currency";
import { IDisbursementGeneral } from "@components/modals/DisbursementModal/types";
import { ICustomerData } from "@pages/prospect/components/AddProductModal/types";
import { searchAllCardSavingProducts } from "@services/bank/cardSavingProducts/SearchAllCardSavingProducts";
import { IProspectSummaryById, IProspect } from "@services/prospect/types";
import { CardGray } from "@components/cards/CardGray";

import { GeneralInformationForm } from "../../GeneralInformationForm";
import { disbursementGeneral, disbursemenOptionAccount } from "../config";
import { useDisbursementForm } from "../../hook/useDisbursementForm";

interface IDisbursementWithInternalAccountProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  formik: FormikValues;
  optionNameForm: string;
  identificationNumber: string;
  businessUnitPublicCode: string;
  isAmountReadOnly: boolean;
  prospectSummaryData: IProspectSummaryById | undefined;
  businessManagerCode: string;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IDisbursementGeneral) => void;
  getTotalAmount: () => number;
  prospectData: IProspect;
  customerData?: ICustomerData;
}

export function DisbursementWithInternalAccount(props: IDisbursementWithInternalAccountProps) {
  const {
    isMobile,
    formik,
    optionNameForm,
    businessUnitPublicCode,
    businessManagerCode,
    onFormValid,
    prospectSummaryData,
    isAmountReadOnly,
    customerData
  } = props;

  const {
    isAutoCompleted,
    currentIdentification,
    isDisabled,
    handleCheckboxChange,
    handleToggleChange,
    isInvalidAmount
  } = useDisbursementForm({ ...props, skipValidation: true });

  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountOptions, setAccountOptions] = useState<{ id: string; label: string; value: string }[]>([]);
  const { addFlag } = useFlag();
  const lastValidState = useRef<boolean | null>(null);

  useEffect(() => {
    const checkValidity = () => {
      const stepErrors = formik.errors[optionNameForm];
      const hasYupErrors = stepErrors && Object.keys(stepErrors).length > 0;
      const currentValues = formik.values[optionNameForm] || {};
      const isFormVisible = !currentValues.toggle;

      let failsBusinessRule = false;
      if (isFormVisible && customerData?.publicCode) {
        if (String(currentValues.identification) === String(customerData.publicCode)) {
          failsBusinessRule = true;
        }
      }
      const isValid = !hasYupErrors && !failsBusinessRule;

      if (lastValidState.current !== isValid) {
        lastValidState.current = isValid;
        onFormValid(isValid);
      }
    };
    const timer = setTimeout(checkValidity, 200);
    return () => clearTimeout(timer);
  }, [formik.errors, formik.values, optionNameForm, customerData, onFormValid]);

  useEffect(() => {
    async function fetchAccounts() {
      setIsLoadingAccounts(true);
      setAccountOptions([]);
      try {
        const response = await searchAllCardSavingProducts(
          currentIdentification,
          businessUnitPublicCode,
          businessManagerCode,
        );
        const uniqueMap = new Map<string, { id: string; label: string; value: string }>();
        response.forEach((account) => {
          const key = `${account.productDescription}-${account.savingProductCode}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {
              id: account.savingProductCode,
              label: `${account.productDescription} - ${account.savingProductCode}`,
              value: `${account.savingProductCode}`,
            });
          }
        });
        setAccountOptions(Array.from(uniqueMap.values()));
      } catch (error) {
        addFlag({
          title: `${disbursemenOptionAccount.errorFlagInternal}`,
          description: `Error: ${error}`,
          appearance: "danger",
          duration: 5000,
        });
        setAccountOptions([]);
      } finally {
        setIsLoadingAccounts(false);
      }
    }
    fetchAccounts();
  }, [currentIdentification, businessUnitPublicCode, businessManagerCode, addFlag]);

  const previousIdentificationRef = useRef<string>();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!previousIdentificationRef.current) {
        previousIdentificationRef.current = currentIdentification;
        return;
      }
      if (previousIdentificationRef.current !== currentIdentification) {
        formik.setFieldValue(`${optionNameForm}.accountNumber`, "");
        previousIdentificationRef.current = currentIdentification;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIdentification, formik, optionNameForm]);

  const currentAccount = formik.values[optionNameForm]?.accountNumber;
  useEffect(() => {
    if (accountOptions.length === 1) {
      const onlyOption = accountOptions[0].value;
      if (currentAccount !== onlyOption) {
        formik.setFieldValue(`${optionNameForm}.accountNumber`, onlyOption);
      }
    }
  }, [accountOptions, currentAccount, optionNameForm, formik]);

  return (
    <Stack direction="column" padding={isMobile ? "4px 10px" : "10px 16px"} gap="16px" justifyContent="center">
      <Stack direction="column" gap="20px">
        <Stack>
          <Textfield
            id="amount"
            name="amount"
            label={disbursementGeneral.label}
            placeholder={disbursementGeneral.place}
            size="compact"
            value={validateCurrencyField("amount", formik, false, optionNameForm)}
            onChange={(e) => handleChangeWithCurrency(formik, e, optionNameForm)}
            onBlur={() => {
              formik.setFieldTouched(`${optionNameForm}.amount`, true);
              formik.handleBlur(`amount`);
            }}
            status={isInvalidAmount ? "invalid" : undefined}
            readOnly={isAmountReadOnly}
            iconBefore={<MdOutlineAttachMoney color={inube.palette.neutralAlpha.N900A} />}
            message={`${disbursemenOptionAccount.valueTurnFail}${currencyFormat(prospectSummaryData?.netAmountToDisburse ?? 0)}`}
            fullwidth
          />
        </Stack>
        <Stack gap="10px" direction="row" alignItems="center">
          <Checkbox
            id="featureCheckbox"
            name="featureCheckbox"
            value="featureCheckbox"
            checked={isDisabled || formik.values[optionNameForm]?.check}
            onChange={handleCheckboxChange}
            disabled={isDisabled}
          />
          <Text type="label" size="medium">{disbursementGeneral.labelCheck}</Text>
        </Stack>
      </Stack>
      <Divider dashed />
      <Stack direction="column" gap="16px">
        <Text type="label" size="medium">{disbursementGeneral.labelToggle}</Text>
      </Stack>
      <Stack direction="row" gap="16px">
        <Toggle
          id="toggle"
          name="toggle"
          checked={formik.values[optionNameForm]?.toggle ?? true}
          onChange={handleToggleChange}
          size="large"
        />
        <Text appearance={(formik.values[optionNameForm]?.toggle ?? true) ? "success" : "danger"}>
          {(formik.values[optionNameForm]?.toggle ?? true) ? disbursementGeneral.optionToggleYes : disbursementGeneral.optionToggleNo}
        </Text>
      </Stack>
      <Divider dashed />
      {!(formik.values[optionNameForm]?.toggle ?? true) && (
        <>
          <GeneralInformationForm
            formik={formik}
            isMobile={isMobile}
            optionNameForm={optionNameForm}
            isReadOnly={isAutoCompleted}
            customerData={props.customerData}
            getTotalAmount={props.getTotalAmount}
            identificationNumber={props.identificationNumber}
            prospectData={props.prospectData}
          />
          <Divider dashed />
        </>
      )}

      <Stack width="100%">
        {isLoadingAccounts ? (
          <SkeletonLine width="100%" height="48px" animated />
        ) : (
          <>
            {accountOptions.length > 1 ? (
              <Select
                id={`${optionNameForm}.accountNumber`}
                name={`${optionNameForm}.accountNumber`}
                label={disbursemenOptionAccount.labelAccount}
                placeholder={disbursemenOptionAccount.placeOption}
                size="compact"
                options={accountOptions}
                onBlur={formik.handleBlur}
                onChange={(_, value) =>
                  formik.setFieldValue(`${optionNameForm}.accountNumber`, value)
                }
                value={formik.values[optionNameForm]?.accountNumber || ""}
                fullwidth
              />
            ) : (
              <CardGray
                label={disbursemenOptionAccount.labelAccount}
                placeHolder={accountOptions[0]?.label || ""}
                isMobile={isMobile}
              />
            )}
          </>
        )}
      </Stack>

      <Textarea
        id={`${optionNameForm}.description`}
        name={`${optionNameForm}.description`}
        label={disbursemenOptionAccount.observation}
        placeholder={disbursemenOptionAccount.placeObservation}
        value={formik.values[optionNameForm]?.description || ""}
        onChange={(e) => formik.setFieldValue(`${optionNameForm}.description`, e.target.value)}
        onBlur={formik.handleBlur}
        fullwidth
      />
    </Stack>
  );
}