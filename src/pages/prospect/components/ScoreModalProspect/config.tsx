/* export const prospectScore = {
  save: "Guardar",
  close: "Cerrar",
  notFount: (
    <>
      Después de una cuidadosa búsqueda, <strong>no</strong> encontramos ningún
      score de crédito.
    </>
  ),
}; */

export const prospectScore = {
  save: {
    code: "Prospect_score_save",
    description: "Save button text",
    i18n: {
      en: "Save",
      es: "Guardar",
    },
  },
  close: {
    code: "Prospect_score_close",
    description: "Close button text",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  notFount: {
    code: "Prospect_score_not_found",
    description: "Message displayed when no credit score is found",
    i18n: {
      es: (
        <>
          Después de una cuidadosa búsqueda, <strong>no</strong> encontramos
          ningún score de crédito.
        </>
      ),
      en: (
        <>
          After a careful search, we found <strong>no</strong> credit score.
        </>
      ),
    },
  },
};

export const riskScoreChanges = {
  title: {
    code: "Risk_score_changes_saved_title",
    description: "Changes saved title",
    i18n: {
      en: "Changes saved",
      es: "Cambios guardados",
    },
  },
  justification: {
    code: "Risk_score_changes_saved_description",
    description: "Risk score changes saved description",
    i18n: {
      en: "The risk score changes have been saved",
      es: "Los cambios del score de riesgo fueron guardados",
    },
  },
};

export const creditScoreChanges = {
  title: {
    code: "Credit_score_changes_saved_title",
    description: "Changes saved title",
    i18n: {
      en: "Changes saved",
      es: "Cambios guardados",
    },
  },
  description: {
    code: "Credit_score_changes_saved_description",
    description: "Credit score changes saved description",
    i18n: {
      en: "The credit score changes have been saved",
      es: "Los cambios del score de crédito fueron guardados",
    },
  },
};

export const urlMock = "https://www.test.co/";
