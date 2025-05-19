import { FormikValues } from "formik";

const currencyFormat = (price: number, withCurrencySymbol = true): string => {
  if (price === 0) {
    if (withCurrencySymbol) return "$ 0";
    return "0";
  }

  const value = Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);

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
  optionNameForm: string | undefined
) => {
  const value = optionNameForm
    ? formik.values[optionNameForm]?.[fieldName]
    : formik.values[fieldName];

  return typeof value === "number"
    ? currencyFormat(value, withCurrencySymbol)
    : value;
};

const handleChangeWithCurrency = (
  formik: FormikValues,
  e: React.ChangeEvent<HTMLInputElement>,
  optionNameForm?: string
) => {
  const parsedValue = parseCurrencyString(e.target.value);
  const formattedValue = isNaN(parsedValue) ? "" : parsedValue;

  const fieldName = optionNameForm
    ? `${optionNameForm}.${e.target.name}`
    : e.target.name;

  formik.setFieldValue(fieldName, formattedValue);
};

const parseCunstomFormat = (amount: string) => {
  const amountParsed = parseFloat(amount);
  return amount === "0" || !amountParsed ? "$ 0" : currencyFormat(amountParsed);
};

const getMonthsElapsed = (dateString: string, decimal: number): number => {
  const startDate = new Date(dateString);
  const currentDate = new Date();

  const yearsDiff = currentDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = currentDate.getMonth() - startDate.getMonth();
  const daysDiff = currentDate.getDate() - startDate.getDate();

  let totalMonths = yearsDiff * 12 + monthsDiff;

  if (daysDiff > 0) {
    totalMonths += daysDiff / 30;
  }

  const years = Math.floor(totalMonths / 12);
  const months = (totalMonths % 12) / 12;

  return parseFloat((years + months).toFixed(decimal));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTotalFinancialObligations = (properties: any[]) => {
  return properties
    .filter((prop) => prop.property_name === "FinancialObligation")
    .reduce((total, prop) => {
      const values = Array.isArray(prop.property_value)
        ? prop.property_value
        : prop.property_value.split(",").map((v: string) => v.trim());

      const amount = Number(values[2] || 0);

      return total + amount;
    }, 0);
};

export {
  currencyFormat,
  parseCunstomFormat,
  handleChangeWithCurrency,
  parseCurrencyString,
  validateCurrencyField,
  getMonthsElapsed,
  getTotalFinancialObligations,
};
