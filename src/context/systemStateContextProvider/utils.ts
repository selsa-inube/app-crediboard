import React from "react";

export interface IError {
  message?: string;
  status?: number;
  data?: {
    description?: string;
    code?: string;
  };
}

export const manageShowError = (
  error: IError,
  setMessageError: (value: React.SetStateAction<string>) => void,
  setShowModalError: (value: React.SetStateAction<boolean>) => void,
): void => {
  const err = error as {
    message?: string;
    status?: number;
    data?: { description?: string; code?: string };
  };

  const code = err?.data?.code ? `[${err.data.code}] ` : "";
  const description =
    code + (err?.message || "") + (err?.data?.description || "");

  setMessageError(description);
  setShowModalError(true);
};
