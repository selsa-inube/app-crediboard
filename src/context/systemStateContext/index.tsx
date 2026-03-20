import { createContext } from "react";

interface ISystemStateContext {
  showModalError: boolean;
  setShowModalError: React.Dispatch<React.SetStateAction<boolean>>;
  messageError: string;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
}

export const SystemStateContext = createContext<ISystemStateContext>(
  {} as ISystemStateContext,
);
