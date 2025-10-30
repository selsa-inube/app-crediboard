import { Formik, FormikValues, FormikProps } from "formik";
import localforage from "localforage";
import * as Yup from "yup";
import { MdOutlineAttachMoney, MdOutlineTag } from "react-icons/md";
import { useEffect, useRef } from "react";

import {
  Icon,
  Grid,
  useMediaQuery,
  Textfield,
  Select,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { ITableFinancialObligationsProps } from "@pages/prospect/components/TableObligationsFinancial";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";

import { ScrollableContainer } from "./styles";
import {
  obligationTypeOptions,
  entityOptions,
  meansPaymentOptions,
  dataInputs,
} from "./config";

interface FinancialObligationModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
}

interface SelectOption {
  id?: string;
  value?: string;
  label?: string;
}

function FinancialObligationModal(props: FinancialObligationModalProps) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconBefore,
    iconAfter,
  } = props;

  const isMobile = useMediaQuery("(max-width: 880px)");
  const isInitialMount = useRef(true);
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);

  const validationSchema = Yup.object({
    type: Yup.string().required(""),
    entity: Yup.string().required(""),
    fee: Yup.number().required(""),
    balance: Yup.number().required(""),
    payment: Yup.string().required(""),
    feePaid: Yup.number()
      .required("")
      .test(function (value) {
        const { term } = this.parent;
        return value !== undefined && term !== undefined ? value < term : true;
      }),
    term: Yup.number().required(""),
    idUser: Yup.number().required(""),
  });

  const handleFormSubmit = async (values: FormikValues) => {
    const storedData =
      (await localforage.getItem<ITableFinancialObligationsProps[]>(
        "financial_obligation"
      )) || [];

    const updatedValues = {
      ...values,
      feePaid: `${values.feePaid || 0}/${values.term || 0}`,
    };

    if (values.id) {
      const updatedData = storedData.map((item) =>
        item.creditRequestCode === values.id
          ? { ...item, ...updatedValues }
          : item
      );
      await localforage.setItem("financial_obligation", updatedData);
    } else {
      const newItem = {
        ...updatedValues,
        id: Date.now(),
      };
      await localforage.setItem("financial_obligation", [
        ...storedData,
        newItem,
      ]);
    }
    onConfirm(updatedValues);
  };

  const getOptionLabel = (options: SelectOption[], value: string) => {
    const option = options?.find(
      (opt) => opt.id === value || opt.value === value
    );
    return option?.label || option?.value || value;
  };
  useEffect(() => {
    if (!isInitialMount.current || !formikRef.current) return;

    const formik = formikRef.current;

    if (obligationTypeOptions && obligationTypeOptions.length === 1) {
      const singleOption = obligationTypeOptions[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.type && optionValue) {
        formik.setFieldValue("type", optionValue);
      }
    }

    if (entityOptions && entityOptions.length === 1) {
      const singleOption = entityOptions[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.entity && optionValue) {
        formik.setFieldValue("entity", optionValue);
      }
    }

    if (meansPaymentOptions && meansPaymentOptions.length === 1) {
      const singleOption = meansPaymentOptions[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.payment && optionValue) {
        formik.setFieldValue("payment", optionValue);
      }
    }

    isInitialMount.current = false;
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, formikHelpers) => {
        await handleFormSubmit(values);
        formikHelpers.setSubmitting(false);
        onCloseModal();
      }}
    >
      {(formik) => {
        formikRef.current = formik;

        return (
          <BaseModal
            title={truncateTextToMaxLength(title, 25)}
            nextButton={confirmButtonText}
            backButton={dataInputs.cancel}
            handleNext={formik.submitForm}
            handleBack={onCloseModal}
            disabledNext={!formik.dirty || !formik.isValid}
            iconAfterNext={iconAfter}
            iconBeforeNext={iconBefore}
            width={isMobile ? "300px" : "600px"}
            finalDivider={true}
          >
            <ScrollableContainer $smallScreen={isMobile}>
              <Grid
                templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                autoRows="auto"
                gap="20px"
                width={isMobile ? "280px" : "100%"}
              >
                {obligationTypeOptions && obligationTypeOptions.length === 1 ? (
                  <Textfield
                    label={dataInputs.labelType}
                    name="type"
                    id="type"
                    size="compact"
                    value={getOptionLabel(
                      obligationTypeOptions,
                      formik.values.type
                    )}
                    disabled
                    fullwidth
                  />
                ) : (
                  <Select
                    label={dataInputs.labelType}
                    name="type"
                    id="type"
                    size="compact"
                    placeholder={dataInputs.palaceHolderSelect}
                    options={obligationTypeOptions}
                    onBlur={formik.handleBlur}
                    onChange={(name, value) =>
                      formik.setFieldValue(name, value)
                    }
                    value={formik.values.type}
                    fullwidth
                  />
                )}

                {entityOptions && entityOptions.length === 1 ? (
                  <Textfield
                    label={dataInputs.labelEntity}
                    name="entity"
                    id="entity"
                    size="compact"
                    value={getOptionLabel(entityOptions, formik.values.entity)}
                    disabled
                    fullwidth
                  />
                ) : (
                  <Select
                    label={dataInputs.labelEntity}
                    name="entity"
                    id="entity"
                    size="compact"
                    placeholder={dataInputs.palaceHolderSelect}
                    options={entityOptions}
                    onBlur={formik.handleBlur}
                    onChange={(name, value) =>
                      formik.setFieldValue(name, value)
                    }
                    value={formik.values.entity}
                    fullwidth
                  />
                )}

                <Textfield
                  label={dataInputs.labelFee}
                  name="fee"
                  id="fee"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineAttachMoney />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputs.palaceHolderFee}
                  value={validateCurrencyField("fee", formik, false, "")}
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={(e) => handleChangeWithCurrency(formik, e)}
                  fullwidth
                />

                <Textfield
                  label={dataInputs.labelBalance}
                  name="balance"
                  id="balance"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineAttachMoney />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputs.palaceHolderBalance}
                  value={validateCurrencyField("balance", formik, false, "")}
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={(e) => handleChangeWithCurrency(formik, e)}
                  fullwidth
                />

                {meansPaymentOptions && meansPaymentOptions.length === 1 ? (
                  <Textfield
                    label={dataInputs.labelPayment}
                    name="payment"
                    id="payment"
                    size="compact"
                    value={getOptionLabel(
                      meansPaymentOptions,
                      formik.values.payment
                    )}
                    disabled
                    fullwidth
                  />
                ) : (
                  <Select
                    label={dataInputs.labelPayment}
                    name="payment"
                    id="payment"
                    size="compact"
                    placeholder={dataInputs.palaceHolderSelect}
                    options={meansPaymentOptions}
                    onBlur={formik.handleBlur}
                    onChange={(name, value) =>
                      formik.setFieldValue(name, value)
                    }
                    value={formik.values.payment}
                    fullwidth
                  />
                )}

                <Textfield
                  label={dataInputs.labelId}
                  name="idUser"
                  id="idUser"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineTag />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputs.palaceHolderId}
                  value={formik.values.idUser}
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={(e) => handleChangeWithCurrency(formik, e)}
                  fullwidth
                />

                <Textfield
                  label={dataInputs.labelFeePaid}
                  name="feePaid"
                  id="feePaid"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineTag />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputs.palaceHolderFeePaid}
                  value={formik.values.feePaid}
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  fullwidth
                />

                <Textfield
                  label={dataInputs.labelterm}
                  name="term"
                  id="term"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineTag />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputs.palaceHolderterm}
                  value={formik.values.term}
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  fullwidth
                />
              </Grid>
            </ScrollableContainer>
          </BaseModal>
        );
      }}
    </Formik>
  );
}

export { FinancialObligationModal };
export type { FinancialObligationModalProps };
