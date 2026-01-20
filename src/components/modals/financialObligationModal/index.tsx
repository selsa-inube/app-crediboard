import { FormikValues, useFormik } from "formik";
import localforage from "localforage";
import * as Yup from "yup";
import { MdOutlineAttachMoney, MdOutlineTag } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";

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
import { SearchAllBank } from "@services/bank/SearchAllBank";

import { ScrollableContainer } from "./styles";
import {
  obligationTypeOptionsEnum,
  entityOptionsEnum,
  meansPaymentOptionsEnum,
  dataInputsEnum,
} from "./config";
import { TruncatedText } from "../TruncatedTextModal";
import { IOptionsSelect } from "../RequirementsModals/types";
import { ErrorModal } from "../ErrorModal";

interface FinancialObligationModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
}

function FinancialObligationModal(props: FinancialObligationModalProps) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    iconBefore,
    iconAfter,
  } = props;

  const isMobile = useMediaQuery("(max-width: 880px)");
  const { lang, enums } = useEnum();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [banks, setBanks] = useState<IOptionsSelect[]>([]);

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

  const formik = useFormik({
    initialValues: {
      type: "",
      entity: "",
      fee: "",
      balance: "",
      payment: "",
      idUser: "",
      feePaid: "",
      term: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, helpers) => {
      await handleFormSubmit(values);
      helpers.setSubmitting(false);
      onCloseModal();
    },
  });

  const handleFormSubmit = async (values: FormikValues) => {
    const storedData =
      (await localforage.getItem<ITableFinancialObligationsProps[]>(
        "financial_obligation",
      )) || [];

    const updatedValues = {
      ...values,
      feePaid: `${values.feePaid || 0}/${values.term || 0}`,
    };

    if (values.id) {
      const updatedData = storedData.map((item) =>
        item.creditRequestCode === values.id
          ? { ...item, ...updatedValues }
          : item,
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

  const paymentTypeOptions = useMemo(() => {
    return (
      enums?.PaymentType?.map((item) => ({
        id: item.code,
        label: item.i18n[lang],
        value: item.code,
      })) || []
    );
  }, [enums, lang]);

  const obligationsTypeOptions = useMemo(() => {
    return (
      enums?.ObligationType?.map((item) => ({
        id: item.code,
        label: item.i18n[lang],
        value: item.code,
      })) || []
    );
  }, [enums, lang]);

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
        setShowErrorModal(true);
        setMessageError(dataInputsEnum.errorBanks.i18n[lang]);
      }
    };

    fetchBanks();
  }, [lang]);

  useEffect(() => {
    if (obligationsTypeOptions.length === 1) {
      formik.setFieldValue("type", obligationsTypeOptions[0].value);
    }
  }, [obligationsTypeOptions, formik]);

  useEffect(() => {
    if (paymentTypeOptions.length === 1) {
      formik.setFieldValue("payment", paymentTypeOptions[0].value);
    }
  }, [paymentTypeOptions, formik]);

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
      backButton={dataInputsEnum.cancel.i18n[lang]}
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
          {obligationTypeOptionsEnum.length === 1 ? (
            <Textfield
              label={dataInputsEnum.labelType.i18n[lang]}
              name="type"
              id="type"
              size="compact"
              value={obligationTypeOptionsEnum[0]?.i18n[lang] || ""}
              disabled
              fullwidth
            />
          ) : (
            <Select
              label={dataInputsEnum.labelType.i18n[lang]}
              name="type"
              id="type"
              size="compact"
              placeholder={dataInputsEnum.palaceHolderSelect.i18n[lang]}
              options={banks}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.type}
              fullwidth
            />
          )}

          {entityOptionsEnum.length === 1 ? (
            <Textfield
              label={dataInputsEnum.labelEntity.i18n[lang]}
              name="entity"
              id="entity"
              size="compact"
              value={entityOptionsEnum[0]?.i18n[lang] || ""}
              disabled
              fullwidth
            />
          ) : (
            <Select
              label={dataInputsEnum.labelEntity.i18n[lang]}
              name="entity"
              id="entity"
              size="compact"
              placeholder={dataInputsEnum.palaceHolderSelect.i18n[lang]}
              options={banks}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.entity}
              fullwidth
            />
          )}

          <Textfield
            label={dataInputsEnum.labelFee.i18n[lang]}
            name="fee"
            id="fee"
            iconBefore={
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance="dark"
                size="20px"
              />
            }
            placeholder={dataInputsEnum.palaceHolderFee.i18n[lang]}
            value={validateCurrencyField("fee", formik, false, "")}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={(e) => handleChangeWithCurrency(formik, e)}
            fullwidth
          />

          <Textfield
            label={dataInputsEnum.labelBalance.i18n[lang]}
            name="balance"
            id="balance"
            iconBefore={
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance="dark"
                size="20px"
              />
            }
            placeholder={dataInputsEnum.palaceHolderBalance.i18n[lang]}
            value={validateCurrencyField("balance", formik, false, "")}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={(e) => handleChangeWithCurrency(formik, e)}
            fullwidth
          />

          {meansPaymentOptionsEnum.length === 1 ? (
            <Textfield
              label={dataInputsEnum.labelPayment.i18n[lang]}
              name="payment"
              id="payment"
              size="compact"
              value={meansPaymentOptionsEnum[0]?.i18n[lang] || ""}
              disabled
              fullwidth
            />
          ) : (
            <Select
              label={dataInputsEnum.labelPayment.i18n[lang]}
              name="payment"
              id="payment"
              size="compact"
              placeholder={dataInputsEnum.palaceHolderSelect.i18n[lang]}
              options={paymentTypeOptions}
              onBlur={formik.handleBlur}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              value={formik.values.payment}
              fullwidth
            />
          )}

          <Textfield
            label={dataInputsEnum.labelId.i18n[lang]}
            name="idUser"
            id="idUser"
            iconBefore={
              <Icon icon={<MdOutlineTag />} appearance="dark" size="20px" />
            }
            placeholder={dataInputsEnum.palaceHolderId.i18n[lang]}
            value={formik.values.idUser}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={(e) => handleChangeWithCurrency(formik, e)}
            fullwidth
          />

          <Textfield
            label={dataInputsEnum.labelFeePaid.i18n[lang]}
            name="feePaid"
            id="feePaid"
            iconBefore={
              <Icon icon={<MdOutlineTag />} appearance="dark" size="20px" />
            }
            placeholder={dataInputsEnum.palaceHolderFeePaid.i18n[lang]}
            value={formik.values.feePaid}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            fullwidth
          />

          <Textfield
            label={dataInputsEnum.labelterm.i18n[lang]}
            name="term"
            id="term"
            iconBefore={
              <Icon icon={<MdOutlineTag />} appearance="dark" size="20px" />
            }
            placeholder={dataInputsEnum.palaceHolderterm.i18n[lang]}
            value={formik.values.term}
            size="compact"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            fullwidth
          />
        </Grid>
        {showErrorModal && (
          <ErrorModal
            handleClose={() => setShowErrorModal(false)}
            isMobile={isMobile}
            message={messageError}
          />
        )}
      </ScrollableContainer>
    </BaseModal>
  );
}

export { FinancialObligationModal };
export type { FinancialObligationModalProps };
