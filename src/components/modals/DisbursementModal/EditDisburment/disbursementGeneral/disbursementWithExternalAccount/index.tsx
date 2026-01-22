import { useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import {
  Stack,
  Text,
  Divider,
  Toggle,
  Select,
  Textfield,
  Textarea,
  Input,
  Checkbox,
  inube,
} from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { typeAccount } from "@mocks/filing-application/disbursement-general/disbursementgeneral.mock";
import {
  currencyFormat,
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { IOptionsSelect } from "@components/modals/RequirementsModals/types";
import { IDisbursementGeneral } from "@components/modals/DisbursementModal/types";
import { SearchAllBank } from "@services/bank/SearchAllBank";
import { ICustomerData } from "@pages/prospect/components/AddProductModal/types";
import { ErrorModal } from "@components/modals/ErrorModal";
import { IProspect } from "@services/prospect/types";
import { EnumType } from "@hooks/useEnum";

import { GeneralInformationForm } from "../../GeneralInformationForm";
import {
  disbursementGeneralEnum,
  disbursemenOptionAccountEnum,
} from "../config";
import { useDisbursementForm } from "../../hook/useDisbursementForm";

interface IDisbursementWithExternalAccountProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  formik: FormikValues;
  optionNameForm: string;
  identificationNumber: string;
  businessUnitPublicCode: string;
  isAmountReadOnly: boolean;
  businessManagerCode: string;
  lang: EnumType;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IDisbursementGeneral) => void;
  getTotalAmount: () => number;
  prospectData: IProspect;
  customerData?: ICustomerData;
}

export function DisbursementWithExternalAccount(
  props: IDisbursementWithExternalAccountProps,
) {
  const {
    isMobile,
    initialValues,
    formik,
    optionNameForm,
    isAmountReadOnly,
    lang,
  } = props;

  const {
    isAutoCompleted,
    isDisabled,
    handleCheckboxChange,
    handleToggleChange,
    isInvalidAmount,
  } = useDisbursementForm(props);

  const [banks, setBanks] = useState<IOptionsSelect[]>([]);
  const [alreadyShowMessageErrorBank, setAlreadyShowMessageErrorBank] =
    useState(false);
  const [modalError, setModalError] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await SearchAllBank();
        const formattedBanks = response.map((bank) => ({
          id: bank.bankId,
          label: bank.bankName,
          value: bank.bankName,
        }));
        setBanks(formattedBanks);
      } catch (error) {
        setModalError(true);
      }
    };
    fetchBanks();
  }, [initialValues]);

  useEffect(() => {
    if (banks.length === 1) {
      formik.setFieldValue(`${optionNameForm}.bank`, banks[0].value);
    }
  }, [banks, formik, optionNameForm]);

  useEffect(() => {
    if (typeAccount.length === 1) {
      formik.setFieldValue(
        `${optionNameForm}.accountType`,
        typeAccount[0].value,
      );
    }
  }, [formik, optionNameForm]);

  return (
    <>
      <Stack
        direction="column"
        padding={isMobile ? "4px 10px" : "10px 16px"}
        gap="16px"
        justifyContent="center"
      >
        <Stack direction="column" gap="20px">
          <Stack width={isMobile ? "100%" : "498px"}>
            <Textfield
              id={`${optionNameForm}.amount`}
              name="amount"
              label={disbursementGeneralEnum.labelCheck.i18n[lang]}
              placeholder={disbursementGeneralEnum.placeTurn.i18n[lang]}
              iconBefore={
                <MdOutlineAttachMoney
                  color={inube.palette.neutralAlpha.N900A}
                />
              }
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
              message={`${disbursemenOptionAccountEnum.valueTurnFail.i18n[lang]}${currencyFormat(initialValues.amount, false)}`}
              fullwidth
            />
          </Stack>
          <Stack gap="10px" direction="row" alignItems="center">
            <Checkbox
              id={"featureCheckbox"}
              name={"featureCheckbox"}
              value="featureCheckbox"
              checked={formik.values[optionNameForm]?.check}
              onChange={handleCheckboxChange}
              disabled={isDisabled}
            />
            <Text type="label" size="medium">
              {disbursementGeneralEnum.labelCheck.i18n[lang]}
            </Text>
          </Stack>
        </Stack>
        <Divider dashed />
        <Stack direction="column" gap="16px">
          <Text type="label" size="medium">
            {disbursementGeneralEnum.labelToggle.i18n[lang]}
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
              ? disbursementGeneralEnum.optionToggleYes.i18n[lang]
              : disbursementGeneralEnum.optionToggleNo.i18n[lang]}
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
        <Stack direction={isMobile ? "column" : "row"} gap="16px">
          {banks.length === 1 ? (
            <Textfield
              id={`${optionNameForm}.bank`}
              name={`${optionNameForm}.bank`}
              label={disbursemenOptionAccountEnum.labelBank.i18n[lang]}
              placeholder={disbursemenOptionAccountEnum.placeOption.i18n[lang]}
              size="compact"
              value={banks[0]?.label || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
            <Select
              id={`${optionNameForm}.bank`}
              name={`${optionNameForm}.bank`}
              label={disbursemenOptionAccountEnum.labelBank.i18n[lang]}
              placeholder={disbursemenOptionAccountEnum.placeOption.i18n[lang]}
              size="compact"
              options={banks}
              onBlur={formik.handleBlur}
              onChange={(_, value) =>
                formik.setFieldValue(`${optionNameForm}.bank`, value)
              }
              value={formik.values[optionNameForm]?.bank || ""}
              invalid={alreadyShowMessageErrorBank && banks.length === 0}
              message={
                (alreadyShowMessageErrorBank &&
                  banks.length === 0 &&
                  disbursemenOptionAccountEnum.errorBanks.i18n[lang]) ||
                ""
              }
              fullwidth
            />
          )}
          {typeAccount.length === 1 ? (
            <Textfield
              id={"accountType"}
              name={`${optionNameForm}.accountType`}
              label={disbursemenOptionAccountEnum.labelAccountType.i18n[lang]}
              placeholder={disbursemenOptionAccountEnum.placeOption.i18n[lang]}
              size="compact"
              value={typeAccount[0]?.label || ""}
              readOnly={true}
              disabled={true}
              fullwidth
            />
          ) : (
            <Select
              id={"accountType"}
              name={`${optionNameForm}.accountType`}
              label={disbursemenOptionAccountEnum.labelAccountType.i18n[lang]}
              placeholder={disbursemenOptionAccountEnum.placeOption.i18n[lang]}
              size="compact"
              options={typeAccount}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values[optionNameForm]?.accountType || ""}
              fullwidth
            />
          )}

          <Input
            id={"accountNumber"}
            name={`${optionNameForm}.accountNumber`}
            label={disbursemenOptionAccountEnum.labelAccountNumber.i18n[lang]}
            placeholder={
              disbursemenOptionAccountEnum.placeAccountNumber.i18n[lang]
            }
            value={formik.values[optionNameForm]?.accountNumber || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullwidth={true}
            size="compact"
          />
        </Stack>
        <Textarea
          id={"description"}
          name={`${optionNameForm}.description`}
          label={disbursemenOptionAccountEnum.observation.i18n[lang]}
          placeholder={disbursemenOptionAccountEnum.placeObservation.i18n[lang]}
          value={formik.values[optionNameForm]?.description || ""}
          onChange={(event) => {
            const value = event.target.value;
            if (value.length <= 100) {
              formik.handleChange(event);
            }
          }}
          onBlur={formik.handleBlur}
          fullwidth
        />
      </Stack>
      {modalError && !alreadyShowMessageErrorBank && (
        <ErrorModal
          isMobile={isMobile}
          message={disbursemenOptionAccountEnum.errorBanks.i18n[lang]}
          handleClose={() => {
            setAlreadyShowMessageErrorBank(true);
            setModalError(false);
          }}
        />
      )}
    </>
  );
}
