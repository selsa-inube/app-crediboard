import { inube } from "@inubekit/inubekit";

const stroke = {
  primary: {
    regular: inube.palette.green.G400,
    hover: inube.palette.green.G300,
    focus: inube.palette.green.G300,
    disabled: inube.palette.neutral.N70,
  },
  danger: {
    regular: inube.palette.red.R400,
    hover: inube.palette.red.R300,
    disabled: inube.palette.neutral.N70,
  },
  warning: {
    regular: inube.palette.yellow.Y400,
    hover: inube.palette.yellow.Y300,
    disabled: inube.palette.neutral.N70,
  },
  success: {
    regular: inube.palette.green.G400,
    hover: inube.palette.green.G300,
    disabled: inube.palette.neutral.N70,
  },
  information: {
    regular: inube.palette.blue.B400,
    hover: inube.palette.blue.B300,
    disabled: inube.palette.neutral.N70,
  },
  help: {
    regular: inube.palette.purple.P400,
    hover: inube.palette.purple.P300,
    disabled: inube.palette.neutral.N70,
  },
  divider: {
    regular: inube.palette.neutral.N100,
  },
  spinner: {
    regular: inube.palette.neutral.N30,
    transparent: inube.palette.neutralAlpha.N0A,
  },
  dark: {
    regular: inube.palette.neutral.N900,
    hover: inube.palette.neutral.N500,
    disabled: inube.palette.neutral.N70,
  },
  gray: {
    regular: inube.palette.neutral.N100,
    hover: inube.palette.neutral.N90,
    disabled: inube.palette.neutral.N70,
  },
  light: {
    regular: inube.palette.neutral.N10,
    hover: inube.palette.neutral.N0,
    disabled: inube.palette.neutral.N70,
  },
  link: {
    regular: inube.palette.blue.B400,
    hover: inube.palette.blue.B300,
    disabled: inube.palette.neutral.N70,
  },
};

export { stroke };
