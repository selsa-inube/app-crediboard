import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { ICreditRequest } from "@services/creditRequest/query/types";
import { mapCreditRequestToEntities } from "./mapper";

export const getCreditRequestInProgress = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  page: number,
  userAccount: string,
  searchParam?: { filter?: string; text?: string }
): Promise<ICreditRequest[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: "50",
      });

      if (searchParam?.filter) {
        const customParams = new URLSearchParams(searchParam.filter);
        for (const [key, value] of customParams.entries()) {
          queryParams.set(key, value);
        }
      } else if (searchParam?.text) {
        queryParams.set("textInSearch", searchParam.text);
      }
      queryParams.set("sort", "desc.isPinned,asc.creditRequestDateOfCreation");

      const finalUrl = `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_QUERY_PROCESS_SERVICE}/credit-requests?${queryParams.toString()}`;
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllCreditRequestsInProgress",
          "X-Business-Unit": businessUnitPublicCode,
          "X-User-Name": userAccount,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        signal: controller.signal,
      };

      const res = await fetch(decodeURIComponent(finalUrl), options);

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener los ",
          status: res.status,
          data,
        };
      }

      const normalizedCredit = Array.isArray(data)
        ? mapCreditRequestToEntities(data)
        : [];

      return normalizedCredit;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los procesos de consulta."
        );
      }
    }
  }

  return [];
};
