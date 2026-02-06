import { environment } from "@config/environment";

import { IPatchOfRequirements } from "../types";
import { mapRequirementsEntity } from "./mappers";

const patchOfRequirements = async (
  creditRequest: IPatchOfRequirements,
  businessUnitPublicCode: string,
  businessManagerCode: string,
  token: string,
  xUserName: string,
): Promise<IPatchOfRequirements | undefined> => {
  const requestUrl = `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_PERSISTENCE_PROCESS_SERVICE}/requirements-packages`;

  try {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "X-Action": "UpdatePackageOfRequirements",
        "X-Business-Unit": businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
        "X-Process-Manager": businessManagerCode,
        "X-User-Name": xUserName,
        Authorization: token,
      },
      body: JSON.stringify(mapRequirementsEntity(creditRequest)),
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
      const errorMessage = `Error al crear requisito . Status: ${
        res.status
      }, Data: ${JSON.stringify(data)}`;
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    console.error("Failed to create requirement:", error);
    throw error;
  }
};

export { patchOfRequirements };
