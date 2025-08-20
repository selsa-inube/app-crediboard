import { environment } from "@config/environment";
import { IDeleteCreditRequest } from "../types";

import { mapRolesDeleteCreditRequestToApi } from "./mappers";

const deleteCreditRequests = async (
  creditRequest: IDeleteCreditRequest,
  businessUnitPublicCode: string
): Promise<IDeleteCreditRequest | undefined> => {
  const requestUrl = `${environment.ICOREBANKING_API_URL_PERSISTENCE}/credit-requests`;

  try {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "X-Action": "RemoveCreditRequest",
        "X-Business-Unit": businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(mapRolesDeleteCreditRequestToApi(creditRequest)),
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
      const errorMessage = `Error al eliminar: ${
        res.status
      }, Data: ${JSON.stringify(data)}`;
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error("Failed to delete:", error);
    throw error;
  }
};

export { deleteCreditRequests };
