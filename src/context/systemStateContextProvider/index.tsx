import { useState } from "react";

import { SystemStateContext } from "@context/systemStateContext";

interface ISystemState {
  children: React.ReactNode;
}

export const SystemStateProvider = (props: ISystemState) => {
  const { children } = props;

  const [showModalError, setShowModalError] = useState(false);
  const [messageError, setMessageError] = useState("");

  return (
    <SystemStateContext.Provider
      value={{
        showModalError,
        setShowModalError,
        messageError,
        setMessageError,
      }}
    >
      {children}
    </SystemStateContext.Provider>
  );
};
