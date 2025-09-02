import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";
import { ILaborStabilityByCustomerId } from "./types";

const getLaborStabilityByCustomerId = async (
  businessUnitPublicCode: string,
  customerIdentificationNumber: string
): Promise<ILaborStabilityByCustomerId[]> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "GET",
        headers: {
          "X-Action": "GetLaborStabilityByCustomerId",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
        },
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.ICOREBANKING_API_URL_QUERY}/credit-profiles/labor-stability/${customerIdentificationNumber}`,
        options
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        throw new Error("No hay tarea disponible.");
      }

      const data = await res.json();
      if (!res.ok) {
        throw {
          message: "Error al obtener la tarea.",
          status: res.status,
          data,
        };
      }

      if (Array.isArray(data)) {
        return data;
      } else {
        return [data];
      }
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

export { getLaborStabilityByCustomerId };
