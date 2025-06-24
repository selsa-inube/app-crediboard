import { environment } from "@config/environment";
import { mapChangeTracesToReadByIdEntity } from "./mappers";
import { IPatchChangeTracesToReadById } from "./types";

const patchChangeTracesToReadById = async (
  creditRequestId: string,
  businessUnitPublicCode: string
): Promise<IPatchChangeTracesToReadById | undefined> => {
  const requestUrl = `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-requests`;

  try {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "X-Action": "ChangeTracesToReadById",
        "X-Business-Unit": businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(mapChangeTracesToReadByIdEntity(creditRequestId)),
    };

    const res = await fetch(requestUrl, options);

    if (res.status === 204) {
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch (error) {
      throw new Error("Failed to parse response JSON");
    }

    if (!res.ok) {
      const errorMessage = `Error al hacer el ChangeTracesToReadById. Status: ${
        res.status
      }, Data: ${JSON.stringify(data)}`;
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error("Failed to ChangeTracesToReadById:", error);
    throw error;
  }
};

export { patchChangeTracesToReadById };
