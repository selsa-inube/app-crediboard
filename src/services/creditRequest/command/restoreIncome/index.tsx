import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import { IRestoreIncome, IRestoreIncomeResponse } from "../types";

export const RestoreIncomeInformationByBorrowerId = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  payload: IRestoreIncome,
  token: string,
  xUserName: string,
): Promise<IRestoreIncomeResponse | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "X-Action": "RestoreIncomeInformationByBorrowerId",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
          "X-User-Name": xUserName,
          Authorization: token,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_PERSISTENCE_PROCESS_SERVICE}/credit-requests`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
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
          "Todos los intentos fallaron. No se pudo restaurar las fuentes de ingresos.",
        );
      }
    }
  }
};
