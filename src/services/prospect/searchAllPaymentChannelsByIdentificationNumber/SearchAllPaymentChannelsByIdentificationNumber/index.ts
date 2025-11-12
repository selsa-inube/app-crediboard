import {
  environment,
  fetchTimeoutServices,
  maxRetriesServices,
} from "@config/environment";

import {
  IPaymentDatesChannel,
  IResponsePaymentDatesChannel,
} from "./types";

export const GetSearchAllPaymentChannels = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  paymentChannel: IPaymentDatesChannel,
): Promise<IResponsePaymentDatesChannel[] | undefined> => {
  const maxRetries = maxRetriesServices;
  const fetchTimeout = fetchTimeoutServices;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return [
  {
    abbreviatedName: "Nomina",
    paymentChannel: "Transferencia digital",
    regularCycles: [
      {
        cycleName: "QUINCENAL",
        detailOfPaymentDate: [
          "2025-01-15T00:00:00Z",
          "2025-01-30T00:00:00Z",
          "2025-02-14T00:00:00Z",
        ],
      },
      {
        cycleName: "MENSUAL",
        detailOfPaymentDate: [
          "2025-01-31T00:00:00Z",
          "2025-02-28T00:00:00Z",
          "2025-03-31T00:00:00Z",
        ],
      },
      {
        cycleName: "SEMANAL",
        detailOfPaymentDate: [
          "2025-01-08T00:00:00Z",
          "2025-01-15T00:00:00Z",
          "2025-01-22T00:00:00Z",
        ],
      },
    ],
  },

];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

      const options: RequestInit = {
        method: "POST",
        headers: {
          "X-Action": "SearchAllPaymentChannelsByIdentificationNumber",
          "X-Business-Unit": businessUnitPublicCode,
          "Content-type": "application/json; charset=UTF-8",
          "X-Process-Manager": businessManagerCode,
        },
        body: JSON.stringify(paymentChannel),
        signal: controller.signal,
      };

      const res = await fetch(
        `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_PERSISTENCE_PROCESS_SERVICE}/payment-channels`,
        options,
      );

      clearTimeout(timeoutId);

      if (res.status === 204) {
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw {
          message: "Error al actualizar documentos requeridos  ",
          status: res.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(
          "Todos los intentos fallaron. No se pudo actualizar documentos requeridos.",
        );
      }
    }
  }
};
