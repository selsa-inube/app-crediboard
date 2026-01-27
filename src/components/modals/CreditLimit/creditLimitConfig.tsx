import { Stack, SkeletonLine } from "@inubekit/inubekit";

import { StyledList } from "./styles";

export const creditLimitTextsEnum = {
  close: {
    code: "CreditLimitTexts_close",
    description: "Close button text",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  maxPaymentCapacity: {
    code: "CreditLimitTexts_maxPaymentCapacity",
    description: "Maximum payment capacity for vacation credit",
    i18n: {
      en: "Max limit for Vacation Credit",
      es: "Tope máx. para Crédito vacacional",
    },
  },
  maxReciprocity: {
    code: "CreditLimitTexts_maxReciprocity",
    description: "Maximum amount according to reciprocity",
    i18n: {
      en: "Max amount according to reciprocity",
      es: "Monto máx. según reciprocidad",
    },
  },
  maxDebtFRC: {
    code: "CreditLimitTexts_maxDebtFRC",
    description: "Maximum amount according to payment capacity",
    i18n: {
      en: "Max amount according to payment capacity",
      es: "Monto máx. según capacidad de pago",
    },
  },
  maxIndebtedness: {
    code: "CreditLimitTexts_maxIndebtedness",
    description: "Maximum indebtedness by risk analysis",
    i18n: {
      en: "Max indebtedness by risk analysis",
      es: "Endeudamiento máx. x análisis de riesgo",
    },
  },
  maxAmount: {
    code: "CreditLimitTexts_maxAmount",
    description: "Maximum usable amount",
    i18n: {
      en: "Maximum usable amount",
      es: "Monto máximo utilizable",
    },
  },
  assignedLimit: {
    code: "CreditLimitTexts_assignedLimit",
    description: "Customized maximum amount by business unit",
    i18n: {
      en: "Customized max amount by B.U.",
      es: "Monto máx. personalizado por U.N.",
    },
  },
  maxUsableLimit: {
    code: "CreditLimitTexts_maxUsableLimit",
    description: "Maximum usable limit",
    i18n: {
      en: "Maximum usable limit",
      es: "Cupo máximo utilizable",
    },
  },
  maxMount: {
    code: "CreditLimitTexts_maxMount",
    description: "Maximum amount",
    i18n: {
      en: "Maximum amount",
      es: "Monto máximo",
    },
  },
  maxUsableQuote: {
    code: "CreditLimitTexts_maxUsableQuote",
    description: "Description of maximum usable limit calculation",
    i18n: {
      en: (
        <>
          The smallest of the above is your <strong>maximum</strong> usable quota.
        </>
      ),
      es: (
        <>
          El menor de los anteriores es su cupo <strong>máximo</strong> utilizable.
        </>
      ),
    },
  },
  currentPortfolio: {
    code: "CreditLimitTexts_currentPortfolio",
    description: "Current portfolio deduction",
    i18n: {
      en: "(-) Current portfolio",
      es: "(-) Cartera vigente",
    },
  },
  availableLimitWithoutGuarantee: {
    code: "CreditLimitTexts_availableLimitWithoutGuarantee",
    description: "Available limit without guarantee",
    i18n: {
      en: "Available limit without guarantee",
      es: "Cupo disponible sin garantía",
    },
  },
  errorTitle: {
    code: "CreditLimitTexts_errorTitle",
    description: "Error loading data title",
    i18n: {
      en: "Error loading data",
      es: "Error cargando datos",
    },
  },
  errorMessage: {
    code: "CreditLimitTexts_errorMessage",
    description: "Error loading data message",
    i18n: {
      en: "Could not load data. Please try again later.",
      es: "No se pudieron cargar los datos. Intenta nuevamente más tarde.",
    },
  },
};

export const renderSkeletons = () => (
  <StyledList>
    <Stack direction="column" gap="12px" height="160px">
      {Array.from({ length: 5 }).map(() => (
        <>
          <Stack justifyContent="space-between" alignItems="center">
            <SkeletonLine width="60%" height="24px" animated={true} />

            <Stack alignItems="center" gap="10px">
              <SkeletonLine width="80px" height="24px" animated={true} />
              <SkeletonLine width="16px" height="16px" animated={true} />
            </Stack>
          </Stack>
        </>
      ))}
    </Stack>
  </StyledList>
);
