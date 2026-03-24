import { useContext } from "react";

import { AppContext } from "@context/AppContext";

export interface IError {
  message?: string;
  status?: number;
  data?: {
    description?: string;
    code?: string;
  };
}

export const useErrorHandler = () => {
  const { setShowErrorModal, setMessageError } = useContext(AppContext);

  const showErrorModalHandler = (error: IError) => {
    const err = error as {
      message?: string;
      status?: number;
      data?: { description?: string; code?: string };
    };

    const code = err?.data?.code ? `[${err.data.code}]` : "";
    const description =
      code + (err?.message || "") + (err?.data?.description || "");

    setMessageError(description);
    setShowErrorModal(true);
  };

  return { showErrorModalHandler };
};
