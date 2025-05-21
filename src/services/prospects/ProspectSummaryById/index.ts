import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { IProspectSummaryById } from "./types";

const getSearchProspectSummaryById = async (
  businessUnitPublicCode: string,
  prospectCode: string
): Promise<IProspectSummaryById> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetProspectSummaryById",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_IPROSPECT_QUERY_PROCESS_SERVICE}/prospects/${prospectCode}`,
        options
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay tarea disponible.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al obtener ProspectSummaryById.",
          status: res.status,
          data,
        };
      }

      if (Array.isArray(data)) {
        return data[0] as IProspectSummaryById;
      }

      return data;
    } catch (error) {
      console.error(`Intento ${attempt} fallido:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo obtener la tarea."
        );
      }
    }
  }

  throw new Error("No se pudo obtener la tarea después de varios intentos.");
};

export { getSearchProspectSummaryById };
