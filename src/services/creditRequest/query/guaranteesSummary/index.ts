import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IGuaranteesSummary } from "../types";

export const getGuaranteesSummary = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequestId: string,
  token: string,
): Promise<IGuaranteesSummary | null> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetGuaranteesSummary",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: token,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_QUERY_PROCESS_SERVICE}/credit-requests/guarantees-summary/${creditRequestId}`,
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

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        if (typeof error === "object" && error !== null) {
          throw {
            ...(error as object),
            message: (error as Error).message,
          };
        }
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener las garantias.",
        );
      }
    }
  }

  return null;
};
