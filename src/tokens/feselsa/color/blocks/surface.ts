import { inube } from "@inubekit/inubekit";

const surface = {
  primary: {
    regular: inube.palette.green.G400,
    hover: inube.palette.green.G300,
    clear: inube.palette.green.G50,
    disabled: inube.palette.neutral.N20,
  },
  danger: {
    regular: inube.palette.red.R400,
    hover: inube.palette.red.R300,
    clear: inube.palette.red.R50,
    disabled: inube.palette.neutral.N20,
  },
  warning: {
    regular: inube.palette.yellow.Y400,
    hover: inube.palette.yellow.Y300,
    clear: inube.palette.yellow.Y50,
    disabled: inube.palette.neutral.N20,
  },
  success: {
    regular: inube.palette.green.G400,
    hover: inube.palette.green.G300,
    clear: inube.palette.green.G50,
    disabled: inube.palette.neutral.N20,
  },
  information: {
    regular: inube.palette.blue.B400,
    hover: inube.palette.blue.B300,
    clear: inube.palette.blue.B50,
    disabled: inube.palette.neutral.N20,
  },
  help: {
    regular: inube.palette.purple.P400,
    hover: inube.palette.purple.P300,
    clear: inube.palette.purple.P50,
    disabled: inube.palette.neutral.N20,
  },
  nav: {
    regular: inube.palette.neutral.N10,
  },
  navlink: {
    regular: inube.palette.neutralAlpha.N0A,
    selected: inube.palette.neutral.N30,
    hover: inube.palette.neutral.N30,
  },
  blanket: {
    regular: inube.palette.neutralAlpha.N100A,
  },
  dark: {
    regular: inube.palette.neutral.N900,
    hover: inube.palette.neutral.N500,
    clear: inube.palette.neutral.N30,
    disabled: inube.palette.neutral.N20,
  },
  gray: {
    regular: inube.palette.neutral.N30,
    hover: inube.palette.neutral.N20,
    clear: inube.palette.neutral.N10,
    disabled: inube.palette.neutral.N20,
  },
  light: {
    regular: inube.palette.neutral.N10,
    hover: inube.palette.neutral.N0,
    clear: inube.palette.neutral.N0,
    disabled: inube.palette.neutral.N20,
  },
};

export { surface };
