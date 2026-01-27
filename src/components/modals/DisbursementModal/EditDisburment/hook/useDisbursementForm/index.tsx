import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { FormikValues } from "formik";

import { IDisbursementGeneral } from "@components/modals/DisbursementModal/types";
import { ICustomerData } from "@pages/prospect/components/AddProductModal/types";
import { IProspect } from "@services/prospect/types";
import { searchAllCustomerCatalog } from "@services/costumer/SearchCustomerCatalogByCode";
import { AppContext } from "@context/AppContext";

interface IUseDisbursementFormProps {
  formik: FormikValues;
  initialValues: IDisbursementGeneral;
  optionNameForm: string;
  customerData?: ICustomerData;
  identificationNumber: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  prospectData: IProspect;
  getTotalAmount: () => number;
  handleOnChange: (values: IDisbursementGeneral) => void;
  onFormValid: (isValid: boolean) => void;
  skipValidation?: boolean;
}

export const useDisbursementForm = (props: IUseDisbursementFormProps) => {
  const {
    formik,
    initialValues,
    optionNameForm,
    customerData,
    identificationNumber,
    businessUnitPublicCode,
    businessManagerCode,
    prospectData,
    getTotalAmount,
    onFormValid,
    skipValidation = false,
  } = props;

  const [isAutoCompleted, setIsAutoCompleted] = useState(false);
  const [currentIdentification, setCurrentIdentification] =
    useState(identificationNumber);
  const { eventData } = useContext(AppContext);

  useEffect(() => {
    if (!skipValidation) {
      onFormValid(formik.isValid);
    }
  }, [formik.isValid, onFormValid, skipValidation]);

  const currentAmountValue = formik.values[optionNameForm]?.amount;
  const currentCheckValue = formik.values[optionNameForm]?.check;

  const totalAmount = getTotalAmount();
  const isDisabled = totalAmount >= initialValues.amount;
  const currentTotal = getTotalAmount();
  const limit = initialValues.amount;
  const isOverLimit = currentTotal > limit;
  const isInvalidAmount =
    isOverLimit ||
    (Boolean(formik.touched[optionNameForm]?.amount) &&
      Boolean(formik.errors[optionNameForm]?.amount));

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    formik.setFieldValue(`${optionNameForm}.check`, isChecked);

    if (isChecked) {
      const remainingAmount = initialValues.amount - totalAmount;
      if (remainingAmount > 0) {
        const currentAmount = Number(
          formik.values[optionNameForm]?.amount || 0,
        );
        const newAmount = currentAmount + remainingAmount;
        formik.setFieldValue(`${optionNameForm}.amount`, newAmount);
      }
    }
  };

  useEffect(() => {
    const currentAmount = Number(formik.values[optionNameForm]?.amount || 0);
    const totalCalc = getTotalAmount();
    if (formik.values[optionNameForm]?.check) {
      if (currentAmount + totalCalc - currentAmount !== initialValues.amount) {
        formik.setFieldValue(`${optionNameForm}.check`, false);
      }
    }
  }, [
    currentAmountValue,
    currentCheckValue,
    getTotalAmount,
    initialValues.amount,
    optionNameForm,
    formik,
  ]);

  const restoreCustomerDataFields = useCallback(() => {
    const person = customerData?.generalAttributeClientNaturalPersons?.[0];

    formik.setFieldValue(
      `${optionNameForm}.documentType`,
      person?.typeIdentification || "",
    );
    formik.setFieldValue(
      `${optionNameForm}.identification`,
      customerData?.publicCode || "",
    );
    formik.setFieldValue(`${optionNameForm}.name`, person?.firstNames || "");
    formik.setFieldValue(`${optionNameForm}.lastName`, person?.lastNames || "");
    formik.setFieldValue(`${optionNameForm}.sex`, person?.gender || "");
    formik.setFieldValue(
      `${optionNameForm}.birthdate`,
      person?.dateBirth || "",
    );
    formik.setFieldValue(
      `${optionNameForm}.phone`,
      person?.cellPhoneContact || "",
    );
    formik.setFieldValue(`${optionNameForm}.mail`, person?.emailContact || "");
    formik.setFieldValue(
      `${optionNameForm}.city`,
      person?.zone?.split("-")[1] || "",
    );

    setCurrentIdentification(customerData?.publicCode || "");
  }, [customerData, formik, optionNameForm]);

  const clearFields = useCallback(() => {
    const fields = [
      "documentType",
      "name",
      "lastName",
      "sex",
      "birthdate",
      "phone",
      "mail",
      "city",
      "identification",
      "accountNumber",
    ];
    fields.forEach((field) => {
      formik.setFieldValue(`${optionNameForm}.${field}`, "");
    });
  }, [formik, optionNameForm]);

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    formik.setFieldValue(`${optionNameForm}.toggle`, isChecked);
    if (isChecked) restoreCustomerDataFields();
    else clearFields();
  };

  const initialLoadRef = useRef(false);

  const identificationRef = formik.values[optionNameForm]?.identification;

  useEffect(() => {
    if (initialLoadRef.current) return;

    const dataKey = Object.keys(initialValues).find(
      (key) => key === optionNameForm,
    ) as keyof IDisbursementGeneral;
    const initialData = initialValues[dataKey];

    if (
      initialData &&
      typeof initialData === "object" &&
      "amount" in initialData
    ) {
      const currentToggle = formik.values[optionNameForm]?.toggle;

      if (
        optionNameForm === "Cash" &&
        Number(initialValues.amount) <= 0 &&
        customerData
      ) {
        if (currentToggle !== true) {
          formik.setFieldValue(`${optionNameForm}.toggle`, true);
          restoreCustomerDataFields();
        }
      }
    }

    initialLoadRef.current = true;
  }, [
    initialValues,
    optionNameForm,
    customerData,
    formik,
    restoreCustomerDataFields,
  ]);

  const identificationValue = formik.values[optionNameForm]?.identification;
  const nameValue = formik.values[optionNameForm]?.name;

  useEffect(() => {
    if (isAutoCompleted && identificationValue !== currentIdentification) {
      const fields = [
        "documentType",
        "name",
        "lastName",
        "sex",
        "birthdate",
        "phone",
        "mail",
        "city",
      ];

      if (formik.values[optionNameForm]?.name) {
        fields.forEach((formikValue) =>
          formik.setFieldValue(`${optionNameForm}.${formikValue}`, ""),
        );
        setIsAutoCompleted(false);
      }
    }
  }, [
    identificationValue,
    currentIdentification,
    isAutoCompleted,
    formik,
    optionNameForm,
    nameValue,
  ]);

  useEffect(() => {
    const identification = formik.values[optionNameForm]?.identification;
    const borrowerIdentification =
      prospectData?.borrowers?.[0]?.borrowerIdentificationNumber;

    if (!identification || identification === borrowerIdentification) return;
    if (identification === currentIdentification) return;

    const fetchCustomer = async () => {
      try {
        const customer = await searchAllCustomerCatalog(
          identification,
          businessUnitPublicCode,
          businessManagerCode,
          eventData.token,
          true,
        );

        const data = customer?.generalAttributeClientNaturalPersons?.[0];
        if (
          customer?.publicCode &&
          data &&
          customer.publicCode !== customerData?.publicCode
        ) {
          setCurrentIdentification(identification);

          formik.setFieldValue(
            `${optionNameForm}.documentType`,
            data.typeIdentification || "",
          );
          formik.setFieldValue(`${optionNameForm}.name`, data.firstNames || "");
          formik.setFieldValue(
            `${optionNameForm}.lastName`,
            data.lastNames || "",
          );
          formik.setFieldValue(`${optionNameForm}.sex`, data.gender || "");
          formik.setFieldValue(
            `${optionNameForm}.birthdate`,
            data.dateBirth || "",
          );
          formik.setFieldValue(
            `${optionNameForm}.phone`,
            data.cellPhoneContact || "",
          );
          formik.setFieldValue(
            `${optionNameForm}.mail`,
            data.emailContact || "",
          );
          formik.setFieldValue(
            `${optionNameForm}.city`,
            data.zone?.split("-")[1] || "",
          );

          setIsAutoCompleted(true);
        } else {
          setIsAutoCompleted(false);
          setCurrentIdentification(identificationNumber);
        }
      } catch (error) {
        setIsAutoCompleted(false);
      }
    };

    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    identificationRef,
    businessUnitPublicCode,
    businessManagerCode,
    customerData,
    identificationNumber,
    optionNameForm,
    prospectData,
    currentIdentification,
  ]);

  return {
    isAutoCompleted,
    currentIdentification,
    setCurrentIdentification,
    isDisabled,
    handleCheckboxChange,
    handleToggleChange,
    isInvalidAmount,
  };
};
