import * as Yup from "yup";
import { useEffect, useState } from "react";

import { currencyFormat } from "@utils/formatData/currency";
import {
  IPaymentCapacity,
  IPaymentCapacityResponse,
} from "@services/creditLimit/types";
import { getBorrowerPaymentCapacityById } from "@services/creditLimit/getBorrowePaymentCapacity";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { useErrorHandler, IError } from "@hooks/useErrorHandler";

import { TermSelectionUI } from "./interface";
import {
  ITermSelection,
  ITermSelectionValuesMain,
  VALIDATED_NUMBER_REGEX,
} from "../config";
import { borrowerProperties, termSelectionTexts } from "./config/config";

export function TermSelection(props: ITermSelection) {
  const {
    quotaCapValue,
    maximumTermValue,
    quotaCapEnabled,
    maximumTermEnabled,
    isMobile,
    lang,
    dataProspect,
    businessManagerCode,
    businessUnitPublicCode,
    eventData,
    onChange,
    onFormValid,
  } = props;

  const [paymentCapacityData, setPaymentCapacityData] =
    useState<IPaymentCapacityResponse | null>(null);
  const { showErrorModalHandler } = useErrorHandler();

  useEffect(() => {
    if (!quotaCapEnabled && !maximumTermEnabled) {
      onChange({
        quotaCapValue: 0,
        maximumTermValue: 0,
        quotaCapEnabled: true,
        maximumTermEnabled: false,
      });
    }

    if (quotaCapEnabled && maximumTermEnabled) {
      onChange({
        quotaCapValue: quotaCapValue,
        maximumTermValue: 0,
        quotaCapEnabled: true,
        maximumTermEnabled: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues: ITermSelectionValuesMain = {
    toggles: {
      quotaCapToggle: quotaCapEnabled !== undefined ? quotaCapEnabled : true,
      maximumTermToggle:
        maximumTermEnabled !== undefined ? maximumTermEnabled : false,
    },
    quotaCapValue: quotaCapEnabled ? currencyFormat(quotaCapValue) : "",
    maximumTermValue: maximumTermEnabled ? maximumTermValue : "",
  };

  const paymentCapacity = paymentCapacityData?.paymentCapacity || 0;

  const validationSchema = Yup.object().shape({
    quotaCapValue: Yup.string().when(
      "toggles.quotaCapToggle",
      (quotaCapToggle, schema) =>
        quotaCapToggle
          ? schema
              .required(termSelectionTexts.required.i18n[lang])
              .test(
                "is-number",
                termSelectionTexts.invalidNumber.i18n[lang],
                (value) => {
                  const numericValue = Number(
                    String(value).replace(VALIDATED_NUMBER_REGEX, ""),
                  );
                  return !isNaN(numericValue);
                },
              )
              .test(
                "max-limit",
                termSelectionTexts.maxLimit.i18n(
                  currencyFormat(paymentCapacity),
                )[lang],
                (value) => {
                  const numericValue = Number(
                    String(value).replace(VALIDATED_NUMBER_REGEX, ""),
                  );
                  return numericValue <= paymentCapacity;
                },
              )
          : schema,
    ),
    maximumTermValue: Yup.string().when(
      "toggles.maximumTermToggle",
      (maximumTermToggle, schema) =>
        maximumTermToggle ? schema.required("") : schema,
    ),
  });

  const handleValidationsForm = (values: ITermSelectionValuesMain) => {
    const quotaCapNumericValue =
      parseFloat(
        String(values.quotaCapValue).replace(VALIDATED_NUMBER_REGEX, ""),
      ) || 0;
    const maximumTermNumericValue =
      parseFloat(
        String(values.maximumTermValue).replace(VALIDATED_NUMBER_REGEX, ""),
      ) || 0;

    const isValid =
      (values.toggles.quotaCapToggle && quotaCapNumericValue > 0) ||
      (values.toggles.maximumTermToggle && maximumTermNumericValue > 0);

    onFormValid(isValid);
  };

  const handleQuotaCapToggleChange = (
    isChecked: boolean = true,
    setFieldValue: (field: string, value: string | number | boolean) => void,
    values: ITermSelectionValuesMain,
  ) => {
    setFieldValue("toggles.quotaCapToggle", isChecked);
    setFieldValue("toggles.maximumTermToggle", !isChecked);

    if (!isChecked) {
      setFieldValue("quotaCapValue", "");
    } else {
      setFieldValue("maximumTermValue", "");
    }

    const quotaCapNumeric = isChecked
      ? parseFloat(
          String(values.quotaCapValue).replace(VALIDATED_NUMBER_REGEX, ""),
        ) || 0
      : 0;

    onChange({
      quotaCapValue: quotaCapNumeric,
      maximumTermValue: 0,
      quotaCapEnabled: isChecked,
      maximumTermEnabled: !isChecked,
    });
  };

  const handleQuotaCapValueChange = (
    rawValue: string,
    setFieldValue: (field: string, value: string | number) => void,
  ) => {
    const numericValue = Number(rawValue.replace(/\D/g, ""));
    const formattedValue = currencyFormat(numericValue);

    setFieldValue("quotaCapValue", formattedValue);

    onChange({
      quotaCapValue: numericValue,
      maximumTermValue: 0,
      quotaCapEnabled: true,
      maximumTermEnabled: false,
    });
  };

  const handleMaximumTermValueChange = (
    numericValue: number,
    setFieldValue: (field: string, value: string | number) => void,
  ) => {
    setFieldValue("maximumTermValue", numericValue);

    onChange({
      quotaCapValue: 0,
      maximumTermValue: numericValue,
      quotaCapEnabled: false,
      maximumTermEnabled: true,
    });
  };

  const handleMaximumTermToggleChange = (
    isChecked: boolean,
    setFieldValue: (field: string, value: string | number | boolean) => void,
    values: ITermSelectionValuesMain,
  ) => {
    setFieldValue("toggles.quotaCapToggle", !isChecked);
    setFieldValue("toggles.maximumTermToggle", isChecked);

    if (!isChecked) {
      setFieldValue("maximumTermValue", "");
    } else {
      setFieldValue("quotaCapValue", "");
    }

    const termNumeric = isChecked ? Number(values.maximumTermValue) : 0;

    onChange({
      quotaCapValue: 0,
      maximumTermValue: termNumeric,
      quotaCapEnabled: !isChecked,
      maximumTermEnabled: isChecked,
    });
  };

  const borrower = dataProspect?.borrowers[0];

  useEffect(() => {
    const fetchCapacityAnalysis = async () => {
      if (!borrower) {
        return;
      }
      const data: IPaymentCapacity = {
        clientIdentificationNumber: borrower.borrowerIdentificationNumber,
        dividends: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            borrowerProperties.dividends,
          ) || "0",
        ),
        financialIncome: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            borrowerProperties.financialIncome,
          ) || "0",
        ),
        leases: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            borrowerProperties.leases,
          ) || "0",
        ),
        otherNonSalaryEmoluments: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            borrowerProperties.otherNonSalaryEmoluments,
          ) || "0",
        ),
        pensionAllowances: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            borrowerProperties.pensionAllowances,
          ) || "0",
        ),
        periodicSalary: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            borrowerProperties.periodicSalary,
          ) || "0",
        ),
        personalBusinessUtilities: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            borrowerProperties.personalBusinessUtilities,
          ) || "0",
        ),
        professionalFees: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            borrowerProperties.professionalFees,
          ) || "0",
        ),
        livingExpenseToIncomeRatio: 0,
      };

      try {
        const paymentCapacity = await getBorrowerPaymentCapacityById(
          businessUnitPublicCode,
          businessManagerCode,
          data,
          eventData.token,
        );
        setPaymentCapacityData(paymentCapacity ?? null);
      } catch (error) {
        showErrorModalHandler(error as IError);
      }
    };

    fetchCapacityAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TermSelectionUI
      isMobile={isMobile}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleValidationsForm={handleValidationsForm}
      handleQuotaCapToggleChange={handleQuotaCapToggleChange}
      handleQuotaCapValueChange={handleQuotaCapValueChange}
      handleMaximumTermToggleChange={handleMaximumTermToggleChange}
      handleMaximumTermValueChange={handleMaximumTermValueChange}
      lang={lang}
    />
  );
}
