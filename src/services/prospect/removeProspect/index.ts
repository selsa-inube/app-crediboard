import {
    environment,
    fetchTimeoutServices,
    maxRetriesServices,
} from "@config/environment";

import { IProspectId } from "../types";

export const removeProspect = async (
    businessUnitPublicCode: string,
    businessManagerCode: string,
    prospectId: string,
): Promise<IProspectId | null> => {
    const maxRetries = maxRetriesServices;
    const fetchTimeout = fetchTimeoutServices;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const body = {
                removeProspectsRequest: [
                    {
                        prospectId
                    }
                ]
            }
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
            const options: RequestInit = {
                method: "DELETE",
                headers: {
                    "X-Action": "RemoveProspect",
                    "X-Business-Unit": businessUnitPublicCode,
                    "Content-type": "application/json; charset=UTF-8",
                    "X-Process-Manager": businessManagerCode,
                },
                signal: controller.signal,
                body: JSON.stringify(body),
            };

            const res = await fetch(
                `${environment.VITE_IPROSPECT_PERSISTENCE_PROCESS_SERVICE}/prospects`,
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
                    "Todos los intentos fallaron. No se pudo obtener el prospect",
                );
            }
        }
    }

    return null;
};
