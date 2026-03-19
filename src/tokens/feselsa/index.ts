import { feselsaPalette } from "./color/palette/palette";
import { typography } from "./typography/typography";

const feselsa = {
  typography,
  icon: {
    primary: {
      content: {
        color: {
          regular: feselsaPalette.blue.b400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.blue.b300,
        },
      },
      background: {
        color: {
          regular: feselsaPalette.blue.b400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.blue.b300,
        },
      },
      contrast: {
        color: {
          regular: feselsaPalette.neutral.n10,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n10,
        },
      },
    },
  },
  button: {
    primary: {
      content: {
        color: {
          regular: feselsaPalette.blue.b400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.blue.b300,
        },
      },
      border: {
        color: {
          regular: feselsaPalette.blue.b400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.blue.b300,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    success: {
      content: {
        color: {
          regular: feselsaPalette.green.g400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.green.g300,
        },
      },
      border: {
        color: {
          regular: feselsaPalette.green.g400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.green.g300,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    warning: {
      content: {
        color: {
          regular: feselsaPalette.yellow.y400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.yellow.y300,
        },
      },
      border: {
        color: {
          regular: feselsaPalette.yellow.y400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.yellow.y300,
        },
      },
      contrast: {
        appearance: "dark",
      },
    },
    danger: {
      content: {
        color: {
          regular: feselsaPalette.red.r400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.red.r300,
        },
      },
      border: {
        color: {
          regular: feselsaPalette.red.r400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.red.r300,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    help: {
      content: {
        color: {
          regular: feselsaPalette.purple.p400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.purple.p300,
        },
      },
      border: {
        color: {
          regular: feselsaPalette.purple.p400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.purple.p300,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    dark: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n900,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.neutral.n500,
        },
      },
      border: {
        color: {
          regular: feselsaPalette.neutral.n900,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n500,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    gray: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n20,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.neutral.n30,
        },
      },
      border: {
        color: {
          regular: feselsaPalette.neutral.n200,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n90,
        },
      },
      contrast: {
        appearance: "gray",
      },
    },
    light: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n20,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.neutral.n0,
        },
      },
      border: {
        color: {
          regular: feselsaPalette.neutral.n20,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n0,
        },
      },
      contrast: {
        appearance: "dark",
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
      color: feselsaPalette.neutral.n30,
    },
    bar: {
      color: feselsaPalette.blue.b400,
    },
    background: {
      color: feselsaPalette.neutral.n10,
    },
    button: {
      appearance: "primary",
    },
    step: {
      color: feselsaPalette.blue.b400,
    },
  },
  text: {
    primary: {
      content: {
        color: {
          regular: feselsaPalette.green.g400,
          hover: feselsaPalette.green.g300,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
    danger: {
      content: {
        color: {
          regular: feselsaPalette.red.r400,
          hover: feselsaPalette.red.r300,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
    warning: {
      content: {
        color: {
          regular: feselsaPalette.yellow.y400,
          hover: feselsaPalette.yellow.y300,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
    success: {
      content: {
        color: {
          regular: feselsaPalette.green.g400,
          hover: feselsaPalette.green.g300,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
    information: {
      content: {
        color: {
          regular: feselsaPalette.blue.b400,
          hover: feselsaPalette.blue.b300,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
    help: {
      content: {
        color: {
          regular: feselsaPalette.purple.p400,
          hover: feselsaPalette.purple.p300,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
    dark: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n900,
          hover: feselsaPalette.neutral.n500,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
    gray: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n300,
          hover: feselsaPalette.neutral.n100,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
    light: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n10,
          hover: feselsaPalette.neutral.n0,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
    link: {
      content: {
        color: {
          regular: feselsaPalette.blue.b400,
          hover: feselsaPalette.blue.b300,
          disabled: feselsaPalette.neutral.n70,
        },
      },
    },
  },
  input: {
    border: {
      color: {
        regular: feselsaPalette.neutral.n40,
        disabled: feselsaPalette.neutral.n40,
        focus: feselsaPalette.blue.b300,
        invalid: feselsaPalette.red.r400,
      },
    },
    background: {
      color: {
        regular: feselsaPalette.neutral.n0,
        disabled: feselsaPalette.neutral.n10,
      },
    },
    content: {
      color: {
        regular: feselsaPalette.neutral.n900,
        disabled: feselsaPalette.neutral.n200,
      },
    },
    placeholder: {
      color: {
        regular: feselsaPalette.neutral.n300,
      },
    },
    message: {
      color: {
        regular: feselsaPalette.red.r400,
      },
    },
    required: {
      color: {
        regular: feselsaPalette.red.r400,
        disabled: feselsaPalette.neutral.n70,
      },
    },
    option: {
      appearance: {
        regular: "dark",
        hover: "primary",
      },
      background: {
        regular: feselsaPalette.neutral.n0,
        hover: feselsaPalette.neutral.n30,
      },
    },
  },
  label: {
    content: {
      color: {
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
  BoxContainer: {
    light: {
      border: {
        color: feselsaPalette.neutral.n0,
      },
      background: {
        color: feselsaPalette.neutral.n0,
      },
      boxShadow: {
        color: feselsaPalette.neutral.n0,
      },
    },
    gray: {
      border: {
        color: feselsaPalette.neutral.n10,
      },
      background: {
        color: feselsaPalette.neutral.n10,
      },
      boxShadow: {
        color: feselsaPalette.neutral.n10,
      },
    },
    dark: {
      border: {
        color: feselsaPalette.neutral.n40,
      },
      background: {
        color: feselsaPalette.neutral.n40,
      },
      boxShadow: {
        color: feselsaPalette.neutral.n40,
      },
    },
    primary: {
      border: {
        color: feselsaPalette.blue.b300,
      },
      background: {
        color: feselsaPalette.blue.b300,
      },
      boxShadow: {
        color: feselsaPalette.blue.b300,
      },
    },
    danger: {
      border: {
        color: feselsaPalette.red.r400,
      },
      background: {
        color: feselsaPalette.red.r50,
      },
      boxShadow: {
        color: feselsaPalette.red.r50,
      },
    },
  },
  appCard: {
    boxShadow: {
      color: {
        regular: feselsaPalette.neutral.n40,
      },
    },
    background: {
      color: {
        regular: feselsaPalette.neutral.n0,
        hover: feselsaPalette.neutral.n20,
      },
    },
  },
  
};

export { feselsa };
