import { MdOutlineAttachMoney } from "react-icons/md";
import {
  Stack,
  Text,
  Divider,
  Toggle,
  Textfield,
  Checkbox,
  Textarea,
  inube,
} from "@inubekit/inubekit";
import { FormikValues } from "formik";

import {
  currencyFormat,
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { IDisbursementGeneral } from "@components/modals/DisbursementModal/types";
import { ICustomerData } from "@pages/prospect/components/AddProductModal/types";
import { IProspect } from "@services/prospect/types";

import {
  disbursementGeneral,
  disbursemenOptionAccount,
} from "../config";
import { GeneralInformationForm } from "../../GeneralInformationForm";
import { useDisbursementForm } from "../../hook/useDisbursementForm";

interface IDisbursementWithCheckEntityProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  formik: FormikValues;
  optionNameForm: string;
  identificationNumber: string;
  businessUnitPublicCode: string;
  isAmountReadOnly: boolean;
  businessManagerCode: string;
  customerData?: ICustomerData;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IDisbursementGeneral) => void;
  getTotalAmount: () => number;
  prospectData: IProspect;
}

export function DisbursementWithCheckEntity(
  props: IDisbursementWithCheckEntityProps,
) {
  const {
    isMobile,
    initialValues,
    formik,
    optionNameForm,
    identificationNumber,
    isAmountReadOnly,
    customerData,
    getTotalAmount,
    prospectData,
  } = props;

  const {
    isAutoCompleted,
    isDisabled,
    handleCheckboxChange,
    handleToggleChange,
    isInvalidAmount
  } = useDisbursementForm(props);

  return (
    <Stack
      direction="column"
      padding={isMobile ? "4px 10px" : "10px 16px"}
      gap="16px"
      justifyContent="center"
    >
      <Stack direction="column" gap="20px">
        <Stack width={isMobile ? "100%" : "498px"}>
          <Textfield
            id="amount"
            name="amount"
            iconBefore={
              <MdOutlineAttachMoney color={inube.palette.neutralAlpha.N900A} />
            }
            label={disbursementGeneral.label}
            placeholder={disbursementGeneral.place}
            size="compact"
            value={validateCurrencyField(
              "amount",
              formik,
              false,
              optionNameForm,
            )}
            onChange={(event) => {
              handleChangeWithCurrency(formik, event, optionNameForm);
            }}
            onBlur={() => {
              formik.setFieldTouched(`${optionNameForm}.amount`, true);
              formik.handleBlur(`amount`);
            }}
            status={
              isInvalidAmount ? "invalid" : undefined
            }
            readOnly={isAmountReadOnly}
            message={`${disbursemenOptionAccount.valueTurnFail}${currencyFormat(initialValues.amount, false)}`}
            fullwidth
          />
        </Stack>
        <Stack gap="10px" direction="row" alignItems="center">
          <Checkbox
            id={"featureCheckbox"}
            name={"featureCheckbox"}
            checked={isDisabled || formik.values[optionNameForm]?.check}
            indeterminate={false}
            onChange={handleCheckboxChange}
            value={"featureCheckbox"}
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
          disabled={false}
          margin="0px"
          onChange={handleToggleChange}
          padding="0px"
          size="large"
          value="toggle"
        />
        <Text
          appearance={
            (formik.values[optionNameForm]?.toggle ?? true) ? "success" : "danger"
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
            customerData={customerData}
            getTotalAmount={getTotalAmount}
            identificationNumber={identificationNumber}
            prospectData={prospectData}
          />
          <Divider dashed />
        </>
      )}
      <Stack direction="row" gap="16px">
        <Textarea
          id={"description"}
          name={`${optionNameForm}.description`}
          label={disbursemenOptionAccount.observation}
          placeholder={disbursemenOptionAccount.placeObservation}
          value={formik.values[optionNameForm]?.description || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth
        />
      </Stack>
    </Stack>
  );
}
