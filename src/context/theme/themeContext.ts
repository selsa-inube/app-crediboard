import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { tokensWithReference } from "@tokens";

type ThemeName = keyof typeof tokensWithReference;

interface IThemeContextType {
  themeName: ThemeName;
  setThemeName: Dispatch<SetStateAction<ThemeName>>;
}

const ThemeContext = createContext<IThemeContextType>({
  themeName: "feselsa",
  setThemeName: () => {},
});

const useTheme = () => useContext(ThemeContext);

export { ThemeContext, useTheme };
export type { ThemeName, IThemeContextType };
