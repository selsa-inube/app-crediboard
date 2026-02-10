export const dataGuaranteesEnum = {
  required: {
    code: "DataGuarantees_required",
    description: "Label for required guarantees",
    i18n: {
      en: "Required:",
      es: "Requeridas:",
    },
  },
  offered: {
    code: "DataGuarantees_offered",
    description: "Label for offered guarantees",
    i18n: {
      en: "Offered:",
      es: "Ofrecidas:",
    },
  },
  active: {
    code: "DataGuarantees_active",
    description: "Label for active guarantees",
    i18n: {
      en: "Active:",
      es: "Vigentes:",
    },
  },
};

export const guaranteesLabelsEnum = {
  title: {
    code: "Guarantees_title",
    description: "Main title for the guarantees card",
    i18n: {
      en: "Guarantees",
      es: "Garantías",
    },
  },
  notFound: {
    title: {
      code: "Guarantees_notFound_title",
      description: "Title when guarantees data is not found",
      i18n: {
        en: "Data not found",
        es: "Datos no encontrados",
      },
    },
    description: {
      code: "Guarantees_notFound_description",
      description:
        "Message explaining that guarantees data couldn't be fetched",
      i18n: {
        en: "We couldn't get the requested data.",
        es: "No pudimos obtener los datos solicitados.",
      },
    },
    retry: {
      code: "Guarantees_notFound_retry",
      description: "Label for the retry button",
      i18n: {
        en: "Retry",
        es: "Reintentar",
      },
    },
  },
};

export const guaranteesDataEnum = {
  bond: {
    code: "Bond",
    description: "Bond",
    i18n: {
      en: "Bond",
      es: "Fianza",
    },
  },
  coborrower: {
    code: "Coborrower",
    description: "Coborrower",
    i18n: {
      en: "Coborrower",
      es: "Codeudor",
    },
  },
  mortgage: {
    code: "Mortgage",
    description: "Mortgage",
    i18n: {
      en: "Mortgage",
      es: "Hipoteca",
    },
  },
  pledge: {
    code: "Pledge",
    description: "Pledge",
    i18n: {
      en: "Pledge",
      es: "Prenda",
    },
  },
  none: {
    code: "None",
    description: "None",
    i18n: {
      en: "None",
      es: "Ninguna",
    },
  },
  bondOrCoborrower: {
    code: "BondOrCoborrower",
    description: "Bond or Coborrower",
    i18n: {
      en: "Bond or Coborrower",
      es: "Fianza o Codeudor",
    },
  },
  bondMortgage: {
    code: "Bond,Mortgage",
    description: "Bond and Mortgage",
    i18n: {
      en: "Bond and Mortgage",
      es: "Fianza e Hipoteca",
    },
  },
  bondPledge: {
    code: "Bond,Pledge",
    description: "Bond and Pledge",
    i18n: {
      en: "Bond and Pledge",
      es: "Fianza y Prenda",
    },
  },
  coborrowerMortgage: {
    code: "Coborrower,Mortgage",
    description: "Coborrower and Mortgage",
    i18n: {
      en: "Coborrower and Mortgage",
      es: "Codeudor e Hipoteca",
    },
  },
  coborrowerPledge: {
    code: "Coborrower,Pledge",
    description: "Coborrower and Pledge",
    i18n: {
      en: "Coborrower and Pledge",
      es: "Codeudor y Prenda",
    },
  },
  bondOrCoborrowerMortgage: {
    code: "BondOrCoborrower,Mortgage",
    description: "Bond or Coborrower and Mortgage",
    i18n: {
      en: "Bond or Coborrower and Mortgage",
      es: "Fianza o Codeudor e Hipoteca",
    },
  },
  bondOrCoborrowerPledge: {
    code: "BondOrCoborrower,Pledge",
    description: "Bond or Coborrower and Pledge",
    i18n: {
      en: "Bond or Coborrower and Pledge",
      es: "Fianza o Codeudor y Prenda",
    },
  },
};

export const getGuaranteeTranslation = (
  code: string,
  lang: "en" | "es" = "es",
): string => {
  const normalizedCode = code.trim();
  const guaranteeEntry = Object.values(guaranteesDataEnum).find(
    (item) => item.code.toLowerCase() === normalizedCode.toLowerCase(),
  );
  return guaranteeEntry?.i18n[lang] || code;
};

export const getGuaranteesTranslations = (
  codes: string[],
  lang: "en" | "es" = "es",
): string[] => {
  return codes.map((code) => getGuaranteeTranslation(code, lang));
};
