import { useEffect, useRef, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import {
  Stack,
  Text,
  Divider,
  Toggle,
  Checkbox,
  Textarea,
  Select,
  Textfield,
  inube,
  SkeletonLine,
} from "@inubekit/inubekit";
import { FormikValues } from "formik";

import {
  currencyFormat,
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
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

export function DisbursementWithInternalAccount(
  props: IDisbursementWithInternalAccountProps,
) {
  const {
    isMobile,
    formik,
    optionNameForm,
    businessUnitPublicCode,
    businessManagerCode,
    onFormValid,
    prospectSummaryData,
    isAmountReadOnly,
    customerData,
  } = props;

  const {
    isAutoCompleted,
    currentIdentification,
    isDisabled,
    handleCheckboxChange,
    handleToggleChange,
    isInvalidAmount,
  } = useDisbursementForm({ ...props, skipValidation: true });

  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountOptions, setAccountOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);
  const lastValidState = useRef<boolean | null>(null);

  useEffect(() => {
    const checkValidity = () => {
      const stepErrors = formik.errors[optionNameForm];
      const hasYupErrors = stepErrors && Object.keys(stepErrors).length > 0;
      const currentValues = formik.values[optionNameForm] || {};
      const isFormVisible = !currentValues.toggle;
      const isThirdParty = currentValues.toggle === false;

      let failsBusinessRule = false;
      if (isFormVisible && customerData?.publicCode) {
        if (
          String(currentValues.identification) ===
          String(customerData.publicCode)
        ) {
          failsBusinessRule = true;
        }
      }

      let isGeneralInfoIncomplete = false;

      if (isThirdParty) {
        const requiredFields = [
          "documentType",
          "identification",
          "name",
          "lastName",
          "birthdate",
          "sex",
          "phone",
          "mail",
          "city",
        ];
        isGeneralInfoIncomplete = requiredFields.some((field) => {
          const value = currentValues[field];
          return !value || String(value).trim() === "";
        });
      }

      const isAccountMissing =
        !currentValues.accountNumber ||
        String(currentValues.accountNumber).trim() === "";

      const isValid =
        !hasYupErrors &&
        !failsBusinessRule &&
        (!isThirdParty || !isGeneralInfoIncomplete) &&
        !isAccountMissing;

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
          formik.values[optionNameForm].identification
            ? formik.values[optionNameForm].identification
            : formik.values[optionNameForm].payeeIdentificationNumber,
          businessUnitPublicCode,
          businessManagerCode,
        );
        const uniqueMap = new Map<
          string,
          { id: string; label: string; value: string }
        >();
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
        setAccountOptions([]);
      } finally {
        setIsLoadingAccounts(false);
      }
    }
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdentification, formik.values[optionNameForm]?.toggle]);

  const { setFieldValue } = formik;

  useEffect(() => {
    if (accountOptions.length === 1) {
      if (accountOptions[0].value) {
        formik.setFieldValue(
          `${optionNameForm}.accountNumber`,
          accountOptions[0].value,
        );
      }
    }
  }, [accountOptions, optionNameForm, setFieldValue, formik]);

  return (
    <Stack
      direction="column"
      padding={isMobile ? "4px 10px" : "10px 16px"}
      gap="16px"
      justifyContent="center"
    >
      <Stack direction="column" gap="20px">
        <Stack>
          <Textfield
            id={`${optionNameForm}.amount`}
            name={`amount`}
            label={disbursementGeneral.label}
            placeholder={disbursementGeneral.place}
            size="compact"
            value={validateCurrencyField(
              `amount`,
              formik,
              false,
              optionNameForm,
            )}
            onChange={(event) =>
              handleChangeWithCurrency(formik, event, optionNameForm)
            }
            onBlur={() => {
              formik.setFieldTouched(`${optionNameForm}.amount`, true);
              formik.handleBlur(`amount`);
            }}
            status={isInvalidAmount ? "invalid" : undefined}
            readOnly={isAmountReadOnly}
            iconBefore={
              <MdOutlineAttachMoney color={inube.palette.neutralAlpha.N900A} />
            }
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
          <Text type="label" size="medium">
            {disbursementGeneral.labelCheck}
          </Text>
        </Stack>
      </Stack>
      <Divider dashed />
      <Stack direction="column" gap="16px">
        <Text type="label" size="medium">
          {disbursementGeneral.labelToggle}
        </Text>
      </Stack>
      <Stack direction="row" gap="16px">
        <Toggle
          id="toggle"
          name="toggle"
          checked={formik.values[optionNameForm]?.toggle ?? true}
          onChange={handleToggleChange}
          size="large"
        />
        <Text
          appearance={
            (formik.values[optionNameForm]?.toggle ?? true)
              ? "success"
              : "danger"
          }
        >
          {(formik.values[optionNameForm]?.toggle ?? true)
            ? disbursementGeneral.optionToggleYes
            : disbursementGeneral.optionToggleNo}
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
                name={`accountNumber`}
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
        id={`${optionNameForm}.observation`}
        name={`${optionNameForm}.observation`}
        label={disbursemenOptionAccount.observation}
        placeholder={disbursemenOptionAccount.placeObservation}
        value={formik.values[optionNameForm]?.observation || ""}
        onChange={(event) => {
          const value = event.target.value;
          if (value.length <= 200) {
            formik.handleChange(event);
          }
        }}
        onBlur={formik.handleBlur}
        fullwidth
      />
    </Stack>
  );
}
