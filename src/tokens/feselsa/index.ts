import { inube } from "@inubekit/inubekit";
const feselsa = {
  icon: {
    primary: {
      content: {
        color: {
          regular: inube.palette.blue.B400,
          disabled: inube.palette.neutral.N70,
          hover: inube.palette.blue.B300,
        },
      },
      background: {
        color: {
          regular: inube.palette.blue.B400,
          disabled: inube.palette.neutral.N20,
          hover: inube.palette.blue.B300,
        },
      },
      contrast: {
        color: {
          regular: inube.palette.neutral.N10,
          disabled: inube.palette.neutral.N70,
          hover: inube.palette.neutral.N10,
        },
      },
    },
  },
  button: {
    primary: {
      content: {
        color: {
          regular: inube.palette.blue.B400,
          disabled: inube.palette.neutral.N20,
          hover: inube.palette.blue.B300,
        },
      },
      border: {
        color: {
          regular: inube.palette.blue.B400,
          disabled: inube.palette.neutral.N70,
          hover: inube.palette.blue.B300,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
  },
  assisted: {
    title: {
      appearance: "dark",
    },
    description: {
      appearance: "gray",
    },
    track: {
      color: inube.palette.neutral.N30,
    },
    bar: {
      color: inube.palette.blue.B400,
    },
    background: {
      color: inube.palette.neutral.N10,
    },
    button: {
      appearance: "primary",
    },
    step: {
      color: inube.palette.blue.B400,
    },
  },
  text: {
    primary: {
      regular: inube.palette.green.G400,
      hover: inube.palette.green.G300,
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
    dark: {
      regular: inube.palette.neutral.N900,
      hover: inube.palette.neutral.N500,
      disabled: inube.palette.neutral.N70,
    },
    gray: {
      regular: inube.palette.neutral.N300,
      hover: inube.palette.neutral.N100,
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
  },
  input: {
    border: {
      color: {
        regular: inube.palette.neutral.N40,
        disabled: inube.palette.neutral.N40,
        focus: inube.palette.blue.B300,
        invalid: inube.palette.red.R400,
      },
    },
    background: {
      color: {
        regular: inube.palette.neutral.N0,
        disabled: inube.palette.neutral.N10,
      },
    },
    content: {
      appearance: inube.palette.neutral.N900,
      // color: {
      //   regular: inube.palette.neutral.N900,
      //   disabled: inube.palette.neutral.N200,
      // },
    },
    placeholder: {
      appearance: inube.palette.neutral.N300,
      // color: {
      //   regular: inube.palette.neutral.N300,
      // },
    },
    message: {
      appearance: inube.palette.red.R400,
      // color: {
      //   regular: inube.palette.red.R400,
      // },
    },
    required: {
      appearance: inube.palette.red.R400,
      // color: {
      //   regular: inube.palette.red.R400,
      //   disabled: inube.palette.neutral.N70,
      // },
    },
    option: {
      appearance: {
        regular: inube.palette.neutral.N0,
        expanded: inube.palette.neutral.N0,
      },
      background: {
        expanded: inube.palette.neutral.N0,
        selected: inube.palette.neutral.N30,
        color: {
          regular: inube.palette.red.R400,
          disabled: inube.palette.neutral.N70,
        },
      },
    },
  },
  label: {
    large: {
      font: "Lato",
      lineHeight: "20px",
      size: "14px",
      tracking: "0",
      weight: "500",
    },
    medium: {
      font: "Lato",
      lineHeight: "16px",
      size: "12px",
      tracking: "0",
      weight: "500",
    },
    small: {
      font: "Lato",
      lineHeight: "16px",
      size: "11px",
      tracking: "0",
      weight: "500",
    },
    content: {
      appearance: {
        regular: "dark",
        disabled: "dark",
        focus: "primary",
        invalid: "danger",
      },
    },
  },
  tabs: {
    content: {
      appearance: {
        selected: "primary",
      },
    },
  },
};

export { feselsa };
