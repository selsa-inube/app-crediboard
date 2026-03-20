import { useState, useEffect, ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import { inube } from "@inubekit/inubekit";

import { tokensWithReference } from "@tokens";

import { ThemeContext, ThemeName } from "./themeContext";

import { ITheme } from "./types";

interface IThemeProviderWrapper {
  children: ReactNode;
}

const ThemeProviderWrapper = ({ children }: IThemeProviderWrapper) => {
  const savedTheme =
    (localStorage.getItem("themeName") as ThemeName) || "feselsa";
  const [themeName, setThemeName] = useState<ThemeName>(savedTheme);

  useEffect(() => {
    localStorage.setItem("themeName", themeName);
  }, [themeName]);

  const theme = {
    ...inube,
    ...tokensWithReference[themeName],
  } as ITheme;

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeProviderWrapper };
