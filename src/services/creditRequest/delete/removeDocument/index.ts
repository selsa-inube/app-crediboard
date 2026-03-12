import { environment } from "@config/environment";
import { IRemoveDocument } from "@services/creditRequest/command/types";

const removeDocument = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  payload: IRemoveDocument,
  token: string,
  userName: string,
): Promise<IRemoveDocument | undefined> => {
  const requestUrl = `${environment.VITE_ICOREBANKING_VI_CREDIBOARD_PERSISTENCE_PROCESS_SERVICE}/credit-requests`;

  try {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "X-Action": "RemoveDocument",
        "X-Business-Unit": businessUnitPublicCode,
        "X-User-Name": userName,
        "Content-type": "application/json; charset=UTF-8",
        "X-Process-Manager": businessManagerCode,
        Authorization: token,
      },
      body: JSON.stringify(payload),
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

export { removeDocument };
