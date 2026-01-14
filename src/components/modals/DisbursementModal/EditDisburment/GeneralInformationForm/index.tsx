import {
  Date as DateInube,
  Input,
  Select,
  Grid,
  Phonefield,
  Stack,
  Textfield,
} from "@inubekit/inubekit";
import { FormikValues } from "formik";
import { useEffect } from "react";

import {
  Sex,
  typesOfDocuments,
  City,
} from "@mocks/filing-application/disbursement-general/disbursementgeneral.mock";
import { ICustomerData } from "@pages/prospect/components/AddProductModal/types";
import { IProspect } from "@services/prospect/types";
import { useEnum } from "@hooks/useEnum";

import { dataGeneralInformationFormEnum } from "./config";
import { disbursemenOptionAccountEnum } from "../../config";

interface IGeneralInformationFormProps {
  formik: FormikValues;
  isMobile: boolean;
  optionNameForm: string;
  getTotalAmount: () => number;
  identificationNumber: string;
  prospectData: IProspect;
  isReadOnly?: boolean;
  customerData?: ICustomerData;
}

export function GeneralInformationForm(props: IGeneralInformationFormProps) {
  const {
    formik,
    isMobile,
    optionNameForm,
    isReadOnly,
    prospectData
  } = props;

  const language = useEnum().lang;

  useEffect(() => {
    if (typesOfDocuments.length === 1) {
      const onlyOption = typesOfDocuments[0];
      formik.setFieldValue(`${optionNameForm}.documentType`, onlyOption.value);
    }
  }, [optionNameForm, formik, prospectData]);

  useEffect(() => {
    if (Sex.length === 1) {
      const onlyOption = Sex[0];
      formik.setFieldValue(`${optionNameForm}.sex`, onlyOption.value);
    }
  }, [optionNameForm, formik, ]);

  useEffect(() => {
    if (City.length === 1) {
      const onlyOption = City[0];
      formik.setFieldValue(`${optionNameForm}.city`, onlyOption.value);
    }
  }, [optionNameForm, formik]);

  return (
    <>
      <Grid
        templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
        gap="16px"
        autoRows="auto"
      >
        {typesOfDocuments.length === 1 ? (
          <Textfield
            id={"documentType"}
            name={`${optionNameForm}.documentType`}
            label={disbursemenOptionAccountEnum.labelDocumentType.i18n[language]}
            placeholder={disbursemenOptionAccountEnum.placeOption.i18n[language]}
            size="compact"
            value={typesOfDocuments[0]?.label || ""}
            readOnly={true}
            disabled={true}
            fullwidth
          />
        ) : (
          <Select
            id={"documentType"}
            name={`${optionNameForm}.documentType`}
            label={disbursemenOptionAccountEnum.labelDocumentType.i18n[language]}
            placeholder={disbursemenOptionAccountEnum.placeOption.i18n[language]}
            size="compact"
            options={typesOfDocuments}
            onBlur={formik.handleBlur}
            onChange={(_, value) =>
              formik.setFieldValue(`${optionNameForm}.documentType`, value)
            }
            value={formik.values[optionNameForm]?.documentType || ""}
            fullwidth
          />
        )}

        <Input
          id={"identification"}
          name={`${optionNameForm}.identification`}
          label={disbursemenOptionAccountEnum.labelDocumentNumber.i18n[language]}
          placeholder={disbursemenOptionAccountEnum.placeDocumentNumber.i18n[language]}
          value={formik.values[optionNameForm]?.identification || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          type="text"
          size="compact"
          status={
            formik.values[optionNameForm]?.identification ===
              prospectData?.borrowers?.[0]?.borrowerIdentificationNumber
              ? "invalid"
              : undefined
          }
          message={
            formik.values[optionNameForm]?.identification ===
              prospectData?.borrowers?.[0]?.borrowerIdentificationNumber
              ? dataGeneralInformationFormEnum.identityMismatch.i18n[language]
              : undefined
          }
        />

        <Input
          id={"name"}
          name={`${optionNameForm}.name`}
          label={disbursemenOptionAccountEnum.labelName.i18n[language]}
          placeholder={disbursemenOptionAccountEnum.placeName.i18n[language]}
          value={formik.values[optionNameForm]?.name || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
        />

        <Input
          id={"lastName"}
          name={`${optionNameForm}.lastName`}
          label={disbursemenOptionAccountEnum.labelLastName.i18n[language]}
          placeholder={disbursemenOptionAccountEnum.placeLastName.i18n[language]}
          value={formik.values[optionNameForm]?.lastName || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
        />

        <DateInube
          id="birthdate"
          name={`${optionNameForm}.birthdate`}
          label={disbursemenOptionAccountEnum.labelBirthdate.i18n[language]}
          size="compact"
          fullwidth={true}
          value={formik.values[optionNameForm]?.birthdate || ""}
          onChange={(e) => {
            const date = new Date(e.target.value);
            formik.setFieldValue(
              `${optionNameForm}.birthdate`,
              date instanceof Date && !isNaN(date.getTime())
                ? date.toISOString().split("T")[0]
                : "",
            );
          }}
        />
        {Sex.length === 1 ? (
          <Textfield
            id={"sex"}
            name={`${optionNameForm}.sex`}
            label={disbursemenOptionAccountEnum.labelSex.i18n[language]}
            placeholder={disbursemenOptionAccountEnum.placeOption.i18n[language]}
            size="compact"
            value={Sex[0]?.label || ""}
            readOnly={true}
            disabled={true}
            fullwidth
          />
        ) : (
          <Select
            id={"sex"}
            name={`${optionNameForm}.sex`}
            label={disbursemenOptionAccountEnum.labelSex.i18n[language]}
            placeholder={disbursemenOptionAccountEnum.placeOption.i18n[language]}
            size="compact"
            options={Sex}
            onBlur={formik.handleBlur}
            onChange={(_, value) =>
              formik.setFieldValue(`${optionNameForm}.sex`, value)
            }
            value={formik.values[optionNameForm]?.sex || ""}
            fullwidth
          />
        )}

        <Phonefield
          id={"phone"}
          name={`${optionNameForm}.phone`}
          label={disbursemenOptionAccountEnum.labelphone.i18n[language]}
          placeholder={disbursemenOptionAccountEnum.placephone.i18n[language]}
          value={formik.values[optionNameForm]?.phone || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
        />

        <Input
          id={"mail"}
          name={`${optionNameForm}.mail`}
          label={disbursemenOptionAccountEnum.labelMail.i18n[language]}
          placeholder={disbursemenOptionAccountEnum.placeMail.i18n[language]}
          value={formik.values[optionNameForm]?.mail || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
          readOnly={isReadOnly}
          type="email"
        />
      </Grid>

      <Stack width={isMobile ? "100%" : "498px"}>
        {City.length === 1 ? (
          <Textfield
            id={"city"}
            name={`${optionNameForm}.city`}
            label={disbursemenOptionAccountEnum.labelCity.i18n[language]}
            placeholder={disbursemenOptionAccountEnum.placeOption.i18n[language]}
            size="compact"
            value={City[0]?.label || ""}
            readOnly={true}
            disabled={true}
            fullwidth
          />
        ) : (
          <Select
            id={"city"}
            name={`${optionNameForm}.city`}
            label={disbursemenOptionAccountEnum.labelCity.i18n[language]}
            placeholder={disbursemenOptionAccountEnum.placeOption.i18n[language]}
            size="compact"
            options={City}
            onBlur={formik.handleBlur}
            onChange={(_, value) =>
              formik.setFieldValue(`${optionNameForm}.city`, value)
            }
            value={formik.values[optionNameForm]?.city || ""}
            fullwidth
          />
        )}
      </Stack>
    </>
  );
}
