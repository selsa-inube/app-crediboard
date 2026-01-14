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
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { useEnum } from "@hooks/useEnum";

import { ScrollableContainer } from "./styles";
import {
  obligationTypeOptionsEnum,
  entityOptionsEnum,
  meansPaymentOptionsEnum,
  dataInputsEnum,
} from "./config";
import { TruncatedText } from "../TruncatedTextModal";

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
  const language = useEnum().lang;

  const mappedObligationTypeOptions = obligationTypeOptionsEnum.map((opt) => ({
    id: opt.id,
    value: opt.value,
    label: opt.i18n[language],
  }));

  const mappedEntityOptions = entityOptionsEnum.map((opt) => ({
    id: opt.id,
    value: opt.value,
    label: opt.i18n[language],
  }));

  const mappedMeansPaymentOptions = meansPaymentOptionsEnum.map((opt) => ({
    id: opt.id,
    value: opt.value,
    label: opt.i18n[language],
  }));

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

    if (mappedObligationTypeOptions && mappedObligationTypeOptions.length === 1) {
      const singleOption = mappedObligationTypeOptions[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.type && optionValue) {
        formik.setFieldValue("type", optionValue);
      }
    }

    if (mappedEntityOptions && mappedEntityOptions.length === 1) {
      const singleOption = mappedEntityOptions[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.entity && optionValue) {
        formik.setFieldValue("entity", optionValue);
      }
    }

    if (meansPaymentOptionsEnum && meansPaymentOptionsEnum.length === 1) {
      const singleOption = meansPaymentOptionsEnum[0];
      const optionValue = singleOption.id || singleOption.value;
      if (!formik.values.payment && optionValue) {
        formik.setFieldValue("payment", optionValue);
      }
    }

    isInitialMount.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            title={
              <TruncatedText
                text={title}
                maxLength={25}
                size="small"
                type="headline"
              />
            }
            nextButton={confirmButtonText}
            backButton={dataInputsEnum.cancel.i18n[language]}
            handleNext={formik.submitForm}
            handleBack={onCloseModal}
            disabledNext={!formik.dirty || !formik.isValid}
            iconAfterNext={iconAfter}
            iconBeforeNext={iconBefore}
            width={isMobile ? "300px" : "650px"}
            finalDivider={true}
          >
            <ScrollableContainer $smallScreen={isMobile}>
              <Grid
                templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                autoRows="auto"
                gap="20px"
                width={isMobile ? "280px" : "100%"}
              >
                {mappedObligationTypeOptions && mappedObligationTypeOptions.length === 1 ? (
                  <Textfield
                    label={dataInputsEnum.labelType.i18n[language]}
                    name="type"
                    id="type"
                    size="compact"
                    value={getOptionLabel(
                      mappedObligationTypeOptions,
                      formik.values.type
                    )}
                    disabled
                    fullwidth
                  />
                ) : (
                  <Select
                    label={dataInputsEnum.labelType.i18n[language]}
                    name="type"
                    id="type"
                    size="compact"
                    placeholder={dataInputsEnum.palaceHolderSelect.i18n[language]}
                    options={mappedObligationTypeOptions}
                    onBlur={formik.handleBlur}
                    onChange={(name, value) =>
                      formik.setFieldValue(name, value)
                    }
                    value={formik.values.type}
                    fullwidth
                  />
                )}

                {mappedEntityOptions && mappedEntityOptions.length === 1 ? (
                  <Textfield
                    label={dataInputsEnum.labelEntity.i18n[language]}
                    name="entity"
                    id="entity"
                    size="compact"
                    value={getOptionLabel(mappedEntityOptions, formik.values.entity)}
                    disabled
                    fullwidth
                  />
                ) : (
                  <Select
                    label={dataInputsEnum.labelEntity.i18n[language]}
                    name="entity"
                    id="entity"
                    size="compact"
                    placeholder={dataInputsEnum.palaceHolderSelect.i18n[language]}
                    options={mappedEntityOptions}
                    onBlur={formik.handleBlur}
                    onChange={(name, value) =>
                      formik.setFieldValue(name, value)
                    }
                    value={formik.values.entity}
                    fullwidth
                  />
                )}

                <Textfield
                  label={dataInputsEnum.labelFee.i18n[language]}
                  name="fee"
                  id="fee"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineAttachMoney />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputsEnum.palaceHolderFee.i18n[language]}
                  value={validateCurrencyField("fee", formik, false, "")}
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={(e) => handleChangeWithCurrency(formik, e)}
                  fullwidth
                />

                <Textfield
                  label={dataInputsEnum.labelBalance.i18n[language]}
                  name="balance"
                  id="balance"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineAttachMoney />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputsEnum.palaceHolderBalance.i18n[language]}
                  value={validateCurrencyField("balance", formik, false, "")}
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={(e) => handleChangeWithCurrency(formik, e)}
                  fullwidth
                />

                {mappedMeansPaymentOptions && mappedMeansPaymentOptions.length === 1 ? (
                  <Textfield
                    label={dataInputsEnum.labelPayment.i18n[language]}
                    name="payment"
                    id="payment"
                    size="compact"
                    value={getOptionLabel(
                      mappedMeansPaymentOptions,
                      formik.values.payment
                    )}
                    disabled
                    fullwidth
                  />
                ) : (
                  <Select
                    label={dataInputsEnum.labelPayment.i18n[language]}
                    name="payment"
                    id="payment"
                    size="compact"
                    placeholder={dataInputsEnum.palaceHolderSelect.i18n[language]}
                    options={mappedMeansPaymentOptions}
                    onBlur={formik.handleBlur}
                    onChange={(name, value) =>
                      formik.setFieldValue(name, value)
                    }
                    value={formik.values.payment}
                    fullwidth
                  />
                )}

                <Textfield
                  label={dataInputsEnum.labelId.i18n[language]}
                  name="idUser"
                  id="idUser"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineTag />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputsEnum.palaceHolderId.i18n[language]}
                  value={formik.values.idUser}
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={(e) => handleChangeWithCurrency(formik, e)}
                  fullwidth
                />

                <Textfield
                  label={dataInputsEnum.labelFeePaid.i18n[language]}
                  name="feePaid"
                  id="feePaid"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineTag />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputsEnum.palaceHolderFeePaid.i18n[language]}
                  value={formik.values.feePaid}
                  size="compact"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  fullwidth
                />

                <Textfield
                  label={dataInputsEnum.labelterm.i18n[language]}
                  name="term"
                  id="term"
                  iconBefore={
                    <Icon
                      icon={<MdOutlineTag />}
                      appearance="dark"
                      size="20px"
                    />
                  }
                  placeholder={dataInputsEnum.palaceHolderterm.i18n[language]}
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
