import { environment } from "@config/environment";
import { IPatchOfRequirements } from "@services/types";
import { mapRequirementsEntity } from "./mappers";

const patchOfRequirements = async (
  creditRequest: IPatchOfRequirements,
  businessUnitPublicCode: string
): Promise<IPatchOfRequirements | undefined> => {
  const requestUrl = `${environment.ICOREBANKING_API_URL_PERSISTENCE}/packages-of-requirements-to-manage`;

  try {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "X-Action": "UpdatePackageOfRequirementsToManage",
        "X-Business-Unit": businessUnitPublicCode,
        "Content-type": "application/json; charset=UTF-8",
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
