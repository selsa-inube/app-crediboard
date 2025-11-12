import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { ILinesOfCreditByMoneyDestination } from "../types";

const getLinesOfCreditByMoneyDestination = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  moneyDestinationAbbreviatedName: string,
  clientIdentificationNumber: string,
): Promise<ILinesOfCreditByMoneyDestination | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return [
  {
    abbreviateName: "Libre destino",
    amortizationType: ["CUOTA_FIJA", "ABONOS_CAPITAL"],
    description: "Libre destino",
    maxAmount: 20000000,
    maxEffectiveInterestRate: 1.049,
    maxTerm: 120,
    minAmount: 1000000,
    minEffectiveInterestRate: 0.95,
    minTerm: 6,
  },
  {
    abbreviateName: "Hogar",
    amortizationType: ["Vehiculo"],
    description: "Crédito de vehículo",
    maxAmount: 50000000,
    maxEffectiveInterestRate: 1.2,
    maxTerm: 60,
    minAmount: 5000000,
    minEffectiveInterestRate: 0.85,
    minTerm: 12,
  },
  {
    abbreviateName: "Vivienda",
    amortizationType: ["CUOTA_FIJA", "ABONOS_CAPITAL", "CUOTA_VARIABLE"],
    description: "Crédito hipotecario",
    maxAmount: 200000000,
    maxEffectiveInterestRate: 1.15,
    maxTerm: 240,
    minAmount: 20000000,
    minEffectiveInterestRate: 0.75,
    minTerm: 60,
  },
];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetLinesOfCreditByMoneyDestination",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_QUERY_PROCESS_SERVICE}/lines-of-credit/${moneyDestinationAbbreviatedName}/${clientIdentificationNumber}`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return null;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Ha ocurrido un error: ",
          status: res.status,
          data,
        };
      }

      return data as ILinesOfCreditByMoneyDestination;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          `Todos los intentos fallaron. No se pudo obtener las líneas de crédito para el destino de dinero ${moneyDestinationAbbreviatedName}.`,
        );
      }
    }
  }

  return null;
};

export { getLinesOfCreditByMoneyDestination };
