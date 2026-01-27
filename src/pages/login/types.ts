import { ICrediboardData } from "@context/AppContext/types";
import { EnumType } from "@hooks/useEnum";

interface IUser {
  id: string;
  username: string;
  code: string;
  userID: string;
  position: string;
  active: boolean;
  email: string;
  phone: string;
  clients: number[];
}
interface ILoginUI {
  lang: EnumType;
  eventData: ICrediboardData;
  screenMobile: boolean;
  screenDesktop: boolean;
}

export type { IUser, ILoginUI };
