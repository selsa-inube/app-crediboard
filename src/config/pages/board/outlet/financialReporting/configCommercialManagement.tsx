import { Text } from "@inubekit/inubekit";

export const commercialManagementEnum = {
  titles: {
    obligation: {
      id: "obligation",
      code: "CommercialManagement_titles_obligation",
      description: "Título de la columna de obligaciones",
      i18n: { en: "Obligation", es: "Obligación" },
    },
    firstHome: {
      id: "firstHome",
      code: "CommercialManagement_titles_firstHome",
      description: "Título de compra de primera vivienda",
      i18n: { en: "First Home Purchase", es: "Compra primera Vivienda" },
    },
    freeInvestment: {
      id: "CommercialManagement_titles_freeInvestment",
      code: "freeInvestment",
      description: "Título de libre inversión",
      i18n: { en: "Free Investment", es: "Libre Inversión" },
    },
  },
  rows: {
    paymentMethod: {
      id: "paymentMethod",
      code: "CommercialManagement_rows_paymentMethod",
      description: "Etiqueta para medio de pago",
      i18n: { en: "Payment Method", es: "Medio de Pago" },
    },
    guaranteeType: {
      id: "guaranteeType",
      code: "CommercialManagement_rows_guaranteeType",
      description: "Etiqueta para tipo de garantía",
      i18n: { en: "Guarantee Type", es: "Tipo de Garantía" },
    },
    creditAmount: {
      id: "creditAmount",
      code: "CommercialManagement_rows_creditAmount",
      description: "Etiqueta para monto del crédito",
      i18n: { en: "Credit Amount", es: "Monto del Crédito" },
    },
    installmentsNumber: {
      id: "installmentsNumber",
      code: "CommercialManagement_rows_installmentsNumber",
      description: "Etiqueta para número de cuotas",
      i18n: { en: "Number of Installments", es: "Número de Cuotas" },
    },
    installmentValue: {
      id: "installmentValue",
      code: "CommercialManagement_rows_installmentValue",
      description: "Etiqueta para valor de la cuota",
      i18n: { en: "Installment Value", es: "Valor de la Cuota" },
    },
  },
  values: {
    payroll: { en: "Payroll", es: "Nómina" },
    mortgage: { en: "Mortgage", es: "Hipoteca" },
    noGuarantee: { en: "No Guarantee", es: "Sin Garantía" },
  },
};

export const getTitlesCommercialManagement = (lang: "es" | "en") => [
  {
    id: commercialManagementEnum.titles.obligation.id,
    titleName: "",
    priority: 1,
  },
  {
    id: commercialManagementEnum.titles.firstHome.id,
    titleName: commercialManagementEnum.titles.firstHome.i18n[lang],
    priority: 2,
  },
  {
    id: commercialManagementEnum.titles.freeInvestment.id,
    titleName: commercialManagementEnum.titles.freeInvestment.i18n[lang],
    priority: 3,
  },
];

export const getEntriesCommercialManagement = (lang: "es" | "en") => [
  {
    id: "1",
    [commercialManagementEnum.titles.obligation.id]: (
      <Text type="label" size="medium">
        {commercialManagementEnum.rows.paymentMethod.i18n[lang]}
      </Text>
    ),
    [commercialManagementEnum.titles.firstHome.id]: commercialManagementEnum.values.payroll[lang],
    [commercialManagementEnum.titles.freeInvestment.id]: commercialManagementEnum.values.payroll[lang],
  },
  {
    id: "2",
    [commercialManagementEnum.titles.obligation.id]: (
      <Text type="label" size="medium">
        {commercialManagementEnum.rows.guaranteeType.i18n[lang]}
      </Text>
    ),
    [commercialManagementEnum.titles.firstHome.id]: commercialManagementEnum.values.mortgage[lang],
    [commercialManagementEnum.titles.freeInvestment.id]: commercialManagementEnum.values.noGuarantee[lang],
  },
  {
    id: "3",
    [commercialManagementEnum.titles.obligation.id]: (
      <Text type="label" size="medium">
        {commercialManagementEnum.rows.creditAmount.i18n[lang]}
      </Text>
    ),
    [commercialManagementEnum.titles.firstHome.id]: "$50.000.000",
    [commercialManagementEnum.titles.freeInvestment.id]: "$5.250.000",
  },
  {
    id: "4",
    [commercialManagementEnum.titles.obligation.id]: (
      <Text type="label" size="medium">
        {commercialManagementEnum.rows.installmentsNumber.i18n[lang]}
      </Text>
    ),
    [commercialManagementEnum.titles.firstHome.id]: "24",
    [commercialManagementEnum.titles.freeInvestment.id]: "24",
  },
  {
    id: "5",
    [commercialManagementEnum.titles.obligation.id]: (
      <Text type="label" size="medium">
        {commercialManagementEnum.rows.installmentValue.i18n[lang]}
      </Text>
    ),
    [commercialManagementEnum.titles.firstHome.id]: "$1.120.000",
    [commercialManagementEnum.titles.freeInvestment.id]: "$200.000",
  },
];