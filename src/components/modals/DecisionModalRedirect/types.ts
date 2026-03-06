import { IIconAppearance } from "@inubekit/inubekit";
import { ReactNode } from "react";

export interface IDecisionEntry {
  justification: string;
}

export enum EComponentAppearance {
  DANGER = "danger",
  DARK = "dark",
  GRAY = "gray",
  HELP = "help",
  LIGHT = "light",
  PRIMARY = "primary",
  SUCCESS = "success",
  WARNING = "warning",
}

export interface IDecisionModal {
  actionText: string;
  portalId: string;
  description: string | ReactNode;
  title: string;
  onCloseModal: () => void;
  onClick?: () => void;
  subtitle?: string;
  withCancelButton?: boolean;
  moreDetails?: string;
  sizeIcon?: string;
  appearanceButton?: EComponentAppearance;
  icon?: React.JSX.Element;
  isDisabledButton?: boolean;
  withDate?: boolean;
  statusDate?: "pending" | "invalid" | undefined;
  loading?: boolean;
  withIcon?: boolean;
  appearance?: IIconAppearance;
  valueDate?: string;
  messageDate?: string;
  changeZIndex?: boolean;
  valueZIndex?: number;
  onBlurDate?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
