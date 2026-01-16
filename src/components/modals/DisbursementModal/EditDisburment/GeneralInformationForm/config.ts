/* export const dataGeneralInformationForm = {
  message:
    "El número de identificación ingresado no puede coincidir con el del titular del crédito.",
};
 */
export const dataGeneralInformationFormEnum = {
  identityMismatch: {
    id: "identityMismatch",
    code: "GeneralInformation_identityMismatch",
    description: "Mensaje de error cuando el número de identificación coincide con el del titular",
    i18n: {
      en: "The entered identification number cannot match the credit holder's identification number.",
      es: "El número de identificación ingresado no puede coincidir con el del titular del crédito.",
    },
  },
} as const;