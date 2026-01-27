import { environment } from "@config/environment";
import { ICreditRequests } from "../types";
import { mapCreditRequestsEntity } from "./mappers";

const patchChangeUsersByCreditRequest = async (
  creditRequest: ICreditRequests,
  businessUnitPublicCode: string,
  businessManagerCode: string,
  userAccount: string,
  token: string,
): Promise<ICreditRequests | undefined> => {
  const requestUrl = `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_PERSISTENCE_PROCESS_SERVICE}/credit-requests`;

  try {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "X-Action": "ChangeUsersByCreditRequest",
        "X-Business-Unit": businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
        "X-User-Name": userAccount,
        "X-Process-Manager": businessManagerCode,
        Authorization: token,
      },
      body: JSON.stringify(mapCreditRequestsEntity(creditRequest)),
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
      const errorMessage = `Error al crear el rol. Status: ${
        res.status
      }, Data: ${JSON.stringify(data)}`;
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error("Failed to add roles:", error);
    throw error;
  }
};

export { patchChangeUsersByCreditRequest };
