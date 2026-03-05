import { IProperty } from "@pages/prospect/components/TableObligationsFinancial/types";
import { FormikValues } from "formik";

const currencyFormat = (
  price: number,
  withCurrencySymbol = true,
  returnZero = false,
): string => {
  if (price === 0 && returnZero) return "0";
  if (price === 0) {
    if (withCurrencySymbol) return "";
    return "";
  }

  const value = Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Math.trunc(Math.ceil(price)));

  return withCurrencySymbol ? value : value.replace(/\$/g, "");
};

const parseCurrencyString = (currencyString: string): number => {
  if (!currencyString) return 0;

  const cleanedString = currencyString
    .replace(/[^0-9,]/g, "")
    .replace(",", ".");
  const parsedValue = parseFloat(cleanedString);

  return isNaN(parsedValue) ? 0 : parsedValue;
};

const validateCurrencyField = (
  fieldName: string,
  formik: FormikValues,
  withCurrencySymbol = true,
  optionNameForm: string | undefined,
) => {
  const value = optionNameForm
    ? formik.values[optionNameForm]?.[fieldName]
    : formik.values[fieldName];

  return typeof value === "number"
    ? currencyFormat(value, withCurrencySymbol)
    : value;
};

export const validateCurrencyFieldTruncate = (
  fieldName: string,
  formik: FormikValues,
  withCurrencySymbol = true,
  optionNameForm: string | undefined,
) => {
  const value = optionNameForm
    ? Math.trunc(formik.values[optionNameForm]?.[fieldName])
    : Math.trunc(formik.values[fieldName]);

  return typeof value === "number"
    ? currencyFormat(value, withCurrencySymbol)
    : value;
};

const handleChangeWithCurrency = (
  formik: FormikValues,
  e: React.ChangeEvent<HTMLInputElement>,
  optionNameForm?: string | "",
) => {
  const parsedValue = parseCurrencyString(e.target.value);
  const formattedValue = isNaN(parsedValue) ? "" : parsedValue;

  const fieldName = optionNameForm
    ? `${optionNameForm}.${e.target.name}`
    : e.target.name;

  formik.setFieldValue(fieldName, formattedValue);
};

const getTotalFinancialObligations = (properties: IProperty[]) => {
  return properties
    .filter((prop) => prop.propertyName === "FinancialObligation")
    .reduce((total, prop) => {
      const values = Array.isArray(prop.propertyValue)
        ? prop.propertyValue
        : prop.propertyValue.split(",").map((v: string) => v.trim());

      const amount = Number(values[2] || 0);

      return total + amount;
    }, 0);
};

export {
  currencyFormat,
  handleChangeWithCurrency,
  parseCurrencyString,
  validateCurrencyField,
  getTotalFinancialObligations,
};
