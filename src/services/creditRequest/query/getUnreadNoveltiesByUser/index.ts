import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IUnreadNoveltiesByUser } from "./types";

const getUnreadNoveltiesByUser = async (
  userAccount: string,
  businessUnitPublicCode: string,
  businessManagerCode: string,
  token: string
): Promise<IUnreadNoveltiesByUser[]> => {
  if (!userAccount || !businessUnitPublicCode || !businessManagerCode) {
    throw new Error("Parámetros requeridos faltantes");
  }

  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetUnreadNoveltiesByUser",
          "X-User-Name": userAccount,
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          Authorization: token,
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_QUERY_PROCESS_SERVICE}/credit-requests`,
        options
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return [];
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw {
          message: "Error al obtener la tarea.",
          status: res.status,
          data,
        };
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        return data;
      } else {
        return [data];
      }
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        return [];
      }
    }
  }

  return [];
};

export { getUnreadNoveltiesByUser };
