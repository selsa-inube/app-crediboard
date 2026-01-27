import { Formik, FormikValues } from "formik";
import * as Yup from "yup";
import { MdOutlineAttachMoney } from "react-icons/md";

import { Icon, Grid, useMediaQuery, Textfield } from "@inubekit/inubekit";
import { BaseModal } from "@components/modals/baseModal";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { useEnum } from "@hooks/useEnum";

import { dataInputsEnum } from "./config";

interface IEditFinancialObligationModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
}

function EditFinancialObligationModal(
  props: IEditFinancialObligationModalProps
) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconAfter,
  } = props;

  const isMobile = useMediaQuery("(max-width: 880px)");
  const { lang } = useEnum();

  const validationSchema = Yup.object({
    fee: Yup.number().required(""),
    balance: Yup.number().required(""),
  });

  const handleFormSubmit = async (values: FormikValues) => {
    onConfirm(values);
  };

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
      {(formik) => (
        <BaseModal
          title={title}
          backButton={dataInputsEnum.cancel.i18n[lang]}
          nextButton={confirmButtonText}
          handleBack={onCloseModal}
          handleNext={formik.submitForm}
          disabledNext={!formik.dirty || !formik.isValid}
          iconAfterNext={iconAfter}
          finalDivider={true}
          width={isMobile ? "300px" : "410px"}
          height={isMobile ? "298px" : "auto"}
        >
          <Grid
            templateColumns="1fr"
            autoRows="auto"
            gap="20px"
            width={isMobile ? "280px" : "100%"}
          >
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
          </Grid>
        </BaseModal>
      )}
    </Formik>
  );
}

export { EditFinancialObligationModal };
export type { IEditFinancialObligationModalProps };
