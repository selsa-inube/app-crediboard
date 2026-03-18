import "styled-components";
import { ITheme } from "./context/theme/types";

declare module "styled-components" {
  export interface DefaultTheme extends ITheme {}
}
