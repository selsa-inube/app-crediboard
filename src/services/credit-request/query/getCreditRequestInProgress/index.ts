import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { ICreditRequest } from "@services/types";
import { mapCreditRequestToEntities } from "./mapper";

export const getCreditRequestInProgress = async (
  businessUnitPublicCode: string,
  maxDataBoardServices: number,
  userAccount: string,
  searchParam?: { filter?: string; text?: string }
): Promise<ICreditRequest[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;
  const maxDataBoard = maxDataBoardServices;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const queryParams = new URLSearchParams({
        page: "1",
        per_page: maxDataBoard.toString(),
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

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "SearchAllCreditRequestsInProgress",
          "X-Business-Unit": businessUnitPublicCode,
          "X-User-Name": userAccount,
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };

      const res = await fetch(
        decodeURIComponent(
          `${environment.ICOREBANKING_API_URL_QUERY}/credit-requests?${queryParams.toString()}`
        ),
        options
      );

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
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudieron obtener los procesos de consulta."
        );
      }
    }
  }

  return [];
};
