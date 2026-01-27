import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IConsolidatedCredit } from "../types";

export const updateConsolidatedCredits = async (
  businessUnitPublicCode: string,
  creditRequestCode: string,
  payload: IConsolidatedCredit[],
  businessManagerCode: string,
): Promise<IConsolidatedCredit[] | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const body = JSON.stringify({
        creditRequestCode: creditRequestCode,
        consolidatedCredits: payload,
      });
      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "X-Action": "UpdateConsolidatedCredits",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-User-Name": businessManagerCode,
        },
        signal: controller.signal,
        body,
      };

      const res = await fetch(
        `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_PERSISTENCE_PROCESS_SERVICE}/credit-requests`,
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

      return data.consolidatedCredits;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudo actualizar la información de créditos consolidados.",
        );
      }
    }
  }

  return null;
};
