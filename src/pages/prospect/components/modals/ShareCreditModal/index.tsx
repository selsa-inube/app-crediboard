import { Formik } from "formik";
import * as Yup from "yup";
import { MdInfoOutline } from "react-icons/md";
import { Text, Stack, Icon, Textfield } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { useEnum } from "@hooks/useEnum";

import { dataShareModalEnum } from "./config";

export interface IShareCreditModalProps {
  handleClose: () => void;
  isMobile: boolean;
}

export function ShareCreditModal(props: IShareCreditModalProps) {
  const { handleClose, isMobile } = props;
  const { lang } = useEnum();

  const initialValues = {
    name: "",
    email: "",
    aditionalEmail: "",
    share: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(""),
    email: Yup.string().email().required(""),
    aditionalEmail: Yup.string().email(),
    share: Yup.boolean(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {(formik) => (
        <BaseModal
          title={dataShareModalEnum.title.i18n[lang]}
          nextButton={dataShareModalEnum.share.i18n[lang]}
          backButton={dataShareModalEnum.cancel.i18n[lang]}
          handleNext={() => {
            formik.submitForm();
            handleClose();
          }}
          handleBack={handleClose}
          disabledNext={!formik.dirty || !formik.isValid}
          width={isMobile ? "287px" : "402px"}
        >
          <Stack direction="column" gap="16px">
            <Stack direction="column">
              <Stack gap="4px">
                <Text type="label" weight="bold" size="medium">
                  {dataShareModalEnum.name.i18n[lang]}
                </Text>
                <Text type="body" size="small" appearance="danger">
                  {dataShareModalEnum.required.i18n[lang]}
                </Text>
              </Stack>
              <Textfield
                name="name"
                id="name"
                placeholder={dataShareModalEnum.placeHolderName.i18n[lang]}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullwidth={true}
              />
            </Stack>
            <Stack direction="column">
              <Stack gap="4px">
                <Text type="label" weight="bold" size="medium">
                  {dataShareModalEnum.email.i18n[lang]}
                </Text>
                <Text type="body" size="small" appearance="danger">
                  {dataShareModalEnum.required.i18n[lang]}
                </Text>
              </Stack>
              <Textfield
                name="email"
                id="email"
                placeholder={dataShareModalEnum.placeHolderEmail.i18n[lang]}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullwidth={true}
              />
            </Stack>
            <Stack direction="column">
              <Stack gap="4px">
                <Text type="label" weight="bold" size="medium">
                  {dataShareModalEnum.aditionalEmail.i18n[lang]}
                </Text>
              </Stack>
              <Stack direction="column" gap="4px">
                <Textfield
                  name="aditionalEmail"
                  id="aditionalEmail"
                  placeholder={dataShareModalEnum.placeHolderAditionalEmail.i18n[lang]}
                  value={formik.values.aditionalEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullwidth={true}
                />
                <Stack gap="4px">
                  <Icon
                    icon={<MdInfoOutline />}
                    appearance="primary"
                    size="14px"
                  ></Icon>
                  <Text type="label" size="small">
                    {dataShareModalEnum.optional.i18n[lang]}
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </BaseModal>
      )}
    </Formik>
  );
}
