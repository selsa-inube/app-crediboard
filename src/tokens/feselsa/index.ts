import { feselsaPalette } from "./color/palette/palette";
import { typography } from "./typography/typography";

const feselsa = {
  typography,
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
  blanket: {
    background: {
      color: feselsaPalette.neutralAlpha.n100a,
    },
  },
  breadcrumbs: {
    content: {
      active: "dark",
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
  countdownBar: {
    primary: {
      background: {
        color: feselsaPalette.blue.b400,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    success: {
      background: {
        color: feselsaPalette.green.g400,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    warning: {
      background: {
        color: feselsaPalette.yellow.y400,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    danger: {
      background: {
        color: feselsaPalette.red.r400,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    help: {
      background: {
        color: feselsaPalette.purple.p400,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    dark: {
      background: {
        color: feselsaPalette.neutral.n900,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    gray: {
      background: {
        color: feselsaPalette.neutral.n200,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    light: {
      background: {
        color: feselsaPalette.neutral.n10,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n50,
      },
    },
  },
  divider: {
    stroke: {
      color: feselsaPalette.neutral.n40,
    },
  },
  fieldset: {
    legend: {
      color: feselsaPalette.neutral.n200,
    },
    border: {
      color: feselsaPalette.neutral.n40,
    },
  },
  fullscreenNav: {
    background: {
      color: feselsaPalette.neutral.n10,
    },
    divider: {
      color: feselsaPalette.neutral.n40,
    },
    title: {
      appearance: "gray",
    },
    subtitle: {
      appearance: {
        regular: "gray",
        expanded: "primary",
      },
      background: {
        expanded: feselsaPalette.neutral.n30,
      },
    },
    link: {
      appearance: {
        regular: "dark",
        selected: "primary",
      },
      background: {
        selected: feselsaPalette.neutral.n30,
        hover: feselsaPalette.neutral.n30,
      },
    },
    copyright: {
      appearance: "gray",
    },
    burger: {
      appearance: "dark",
    },
  },
  header: {
    background: {
      color: feselsaPalette.neutral.n0,
    },
    content: {
      appearance: "gray",
    },
  },
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
    success: {
      content: {
        color: {
          regular: feselsaPalette.green.g400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.green.g300,
        },
      },
      background: {
        color: {
          regular: feselsaPalette.green.g400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.green.g300,
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
    warning: {
      content: {
        color: {
          regular: feselsaPalette.yellow.y400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.yellow.y300,
        },
      },
      background: {
        color: {
          regular: feselsaPalette.yellow.y400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.yellow.y300,
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
    danger: {
      content: {
        color: {
          regular: feselsaPalette.red.r400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.red.r300,
        },
      },
      background: {
        color: {
          regular: feselsaPalette.red.r400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.red.r300,
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
    help: {
      content: {
        color: {
          regular: feselsaPalette.purple.p400,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.purple.p300,
        },
      },
      background: {
        color: {
          regular: feselsaPalette.purple.p400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.purple.p300,
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
    dark: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n900,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n500,
        },
      },
      background: {
        color: {
          regular: feselsaPalette.neutral.n900,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.neutral.n500,
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
    gray: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n300,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n100,
        },
      },
      background: {
        color: {
          regular: feselsaPalette.neutral.n20,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.neutral.n30,
        },
      },
      contrast: {
        color: {
          regular: feselsaPalette.neutral.n900,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n900,
        },
      },
    },
    light: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n10,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n0,
        },
      },
      background: {
        color: {
          regular: feselsaPalette.neutral.n10,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.neutral.n0,
        },
      },
      contrast: {
        color: {
          regular: feselsaPalette.neutral.n900,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n900,
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
  link: {
    content: {
      color: {
        regular: feselsaPalette.blue.b400,
        hover: feselsaPalette.blue.b300,
      },
    },
  },
  menu: {
    avatar: {
      appearance: "primary",
    },
    username: {
      appearance: "dark",
    },
    client: {
      appearance: "gray",
    },
    heading: {
      appearance: "gray",
    },
    item: {
      content: "dark",
      background: {
        hover: feselsaPalette.neutral.n20,
        disabled: feselsaPalette.neutral.n20,
      },
    },
    background: {
      color: feselsaPalette.neutral.n0,
    },
    divider: {
      color: feselsaPalette.neutral.n40,
    },
  },
  nav: {
    background: {
      color: feselsaPalette.neutral.n10,
    },
    divider: {
      color: feselsaPalette.neutral.n40,
    },
    title: {
      appearance: "gray",
    },
    subtitle: {
      appearance: {
        regular: "gray",
        expanded: "primary",
      },
      background: {
        expanded: feselsaPalette.neutral.n30,
      },
    },
    link: {
      appearance: {
        regular: "dark",
        selected: "primary",
      },
      background: {
        selected: feselsaPalette.neutral.n30,
        hover: feselsaPalette.neutral.n30,
      },
    },
    copyright: {
      appearance: "gray",
    },
  },
  flag: {
    primary: {
      background: {
        color: feselsaPalette.blue.b50,
      },
      countdownBar: {
        appearance: "primary",
      },
      icon: {
        appearance: "primary",
      },
      content: {
        appearance: "dark",
      },
    },
    success: {
      background: {
        color: feselsaPalette.green.g50,
      },
      countdownBar: {
        appearance: "success",
      },
      icon: {
        appearance: "success",
      },
      content: {
        appearance: "dark",
      },
    },
    warning: {
      background: {
        color: feselsaPalette.yellow.y50,
      },
      countdownBar: {
        appearance: "warning",
      },
      icon: {
        appearance: "warning",
      },
      content: {
        appearance: "dark",
      },
    },
    danger: {
      background: {
        color: feselsaPalette.red.r50,
      },
      countdownBar: {
        appearance: "danger",
      },
      icon: {
        appearance: "danger",
      },
      content: {
        appearance: "dark",
      },
    },
    help: {
      background: {
        color: feselsaPalette.purple.p50,
      },
      countdownBar: {
        appearance: "help",
      },
      icon: {
        appearance: "help",
      },
      content: {
        appearance: "dark",
      },
    },
    dark: {
      background: {
        color: feselsaPalette.neutral.n30,
      },
      countdownBar: {
        appearance: "dark",
      },
      icon: {
        appearance: "dark",
      },
      content: {
        appearance: "dark",
      },
    },
    gray: {
      background: {
        color: feselsaPalette.neutral.n10,
      },
      countdownBar: {
        appearance: "gray",
      },
      icon: {
        appearance: "gray",
      },
      content: {
        appearance: "dark",
      },
    },
    light: {
      background: {
        color: feselsaPalette.neutral.n0,
      },
      countdownBar: {
        appearance: "dark",
      },
      icon: {
        appearance: "dark",
      },
      content: {
        appearance: "dark",
      },
    },
  },
  skeleton: {
    background: {
      color: feselsaPalette.neutral.n30,
    },
    animation: {
      color: feselsaPalette.neutral.n10,
    },
  },
  spinner: {
    primary: {
      solid: {
        spin: {
          color: feselsaPalette.blue.b400,
        },
        track: {
          color: feselsaPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: feselsaPalette.blue.b400,
        },
        track: {
          color: feselsaPalette.neutralAlpha.n0a,
        },
      },
    },
    success: {
      solid: {
        spin: {
          color: feselsaPalette.green.g400,
        },
        track: {
          color: feselsaPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: feselsaPalette.green.g400,
        },
        track: {
          color: feselsaPalette.neutralAlpha.n0a,
        },
      },
    },
    warning: {
      solid: {
        spin: {
          color: feselsaPalette.yellow.y400,
        },
        track: {
          color: feselsaPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: feselsaPalette.yellow.y400,
        },
        track: {
          color: feselsaPalette.neutralAlpha.n0a,
        },
      },
    },
    danger: {
      solid: {
        spin: {
          color: feselsaPalette.red.r400,
        },
        track: {
          color: feselsaPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: feselsaPalette.red.r400,
        },
        track: {
          color: feselsaPalette.neutralAlpha.n0a,
        },
      },
    },
    help: {
      solid: {
        spin: {
          color: feselsaPalette.purple.p400,
        },
        track: {
          color: feselsaPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: feselsaPalette.purple.p400,
        },
        track: {
          color: feselsaPalette.neutralAlpha.n0a,
        },
      },
    },
    dark: {
      solid: {
        spin: {
          color: feselsaPalette.neutral.n900,
        },
        track: {
          color: feselsaPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: feselsaPalette.neutral.n900,
        },
        track: {
          color: feselsaPalette.neutralAlpha.n0a,
        },
      },
    },
    gray: {
      solid: {
        spin: {
          color: feselsaPalette.neutral.n100,
        },
        track: {
          color: feselsaPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: feselsaPalette.neutral.n100,
        },
        track: {
          color: feselsaPalette.neutralAlpha.n0a,
        },
      },
    },
    light: {
      solid: {
        spin: {
          color: feselsaPalette.neutral.n10,
        },
        track: {
          color: feselsaPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: feselsaPalette.neutral.n10,
        },
        track: {
          color: feselsaPalette.neutralAlpha.n0a,
        },
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
  tag: {
    primary: {
      background: {
        color: feselsaPalette.blue.b50,
      },
      border: {
        color: feselsaPalette.blue.b400,
      },
      content: {
        appearance: "primary",
      },
    },
    success: {
      background: {
        color: feselsaPalette.green.g50,
      },
      border: {
        color: feselsaPalette.green.g400,
      },
      content: {
        appearance: "success",
      },
    },
    warning: {
      background: {
        color: feselsaPalette.yellow.y50,
      },
      border: {
        color: feselsaPalette.yellow.y400,
      },
      content: {
        appearance: "warning",
      },
    },
    danger: {
      background: {
        color: feselsaPalette.red.r50,
      },
      border: {
        color: feselsaPalette.red.r400,
      },
      content: {
        appearance: "danger",
      },
    },
    help: {
      background: {
        color: feselsaPalette.purple.p50,
      },
      border: {
        color: feselsaPalette.purple.p400,
      },
      content: {
        appearance: "help",
      },
    },
    dark: {
      background: {
        color: feselsaPalette.neutral.n30,
      },
      border: {
        color: feselsaPalette.neutral.n900,
      },
      content: {
        appearance: "dark",
      },
    },
    gray: {
      background: {
        color: feselsaPalette.neutral.n10,
      },
      border: {
        color: feselsaPalette.neutral.n200,
      },
      content: {
        appearance: "gray",
      },
    },
    light: {
      background: {
        color: feselsaPalette.neutralAlpha.n0a,
      },
      border: {
        color: feselsaPalette.neutral.n10,
      },
      content: {
        appearance: "light",
      },
    },
  },
  table: {
    border: {
      color: feselsaPalette.neutral.n40,
    },
    heading: {
      background: {
        regular: feselsaPalette.neutral.n0,
      },
      color: {
        regular: feselsaPalette.neutral.n900,
      },
    },
    action: {
      background: {
        action: feselsaPalette.neutral.n30,
      },
      color: {
        action: feselsaPalette.neutral.n900,
      },
    },
    row: {
      background: {
        regular: feselsaPalette.neutral.n0,
        zebra: feselsaPalette.neutral.n30,
      },
      color: {
        regular: feselsaPalette.neutral.n900,
        zebra: feselsaPalette.neutral.n900,
      },
    },
    cell: {
      color: {
        primary: feselsaPalette.blue.b400,
        success: feselsaPalette.green.g400,
        warning: feselsaPalette.yellow.y400,
        danger: feselsaPalette.red.r400,
        help: feselsaPalette.purple.p400,
        dark: feselsaPalette.neutral.n900,
        gray: feselsaPalette.neutral.n300,
        light: feselsaPalette.neutral.n900,
      },
      background: {
        primary: feselsaPalette.blue.b50,
        success: feselsaPalette.green.g50,
        warning: feselsaPalette.yellow.y50,
        danger: feselsaPalette.red.r50,
        help: feselsaPalette.purple.p50,
        dark: feselsaPalette.neutral.n30,
        gray: feselsaPalette.neutral.n20,
        light: feselsaPalette.neutral.n0,
      },
    },
    pagination: {
      appearance: "gray",
    },
    caption: {
      appearance: "gray",
    },
  },
  text: {
    primary: {
      content: {
        color: {
          regular: feselsaPalette.blue.b400,
          disabled: feselsaPalette.neutral.n200,
          hover: feselsaPalette.blue.b300,
        },
      },
    },
    success: {
      content: {
        color: {
          regular: feselsaPalette.green.g400,
          disabled: feselsaPalette.neutral.n200,
          hover: feselsaPalette.green.g300,
        },
      },
    },
    warning: {
      content: {
        color: {
          regular: feselsaPalette.yellow.y400,
          disabled: feselsaPalette.neutral.n200,
          hover: feselsaPalette.yellow.y300,
        },
      },
    },
    danger: {
      content: {
        color: {
          regular: feselsaPalette.red.r400,
          disabled: feselsaPalette.neutral.n200,
          hover: feselsaPalette.red.r300,
        },
      },
    },
    help: {
      content: {
        color: {
          regular: feselsaPalette.purple.p400,
          disabled: feselsaPalette.neutral.n200,
          hover: feselsaPalette.purple.p300,
        },
      },
    },
    dark: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n900,
          disabled: feselsaPalette.neutral.n200,
          hover: feselsaPalette.neutral.n500,
        },
      },
    },
    gray: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n300,
          disabled: feselsaPalette.neutral.n200,
          hover: feselsaPalette.neutral.n100,
        },
      },
    },
    light: {
      content: {
        color: {
          regular: feselsaPalette.neutral.n10,
          disabled: feselsaPalette.neutral.n200,
          hover: feselsaPalette.neutral.n0,
        },
      },
    },
  },
  toggle: {
    on: {
      background: {
        color: {
          regular: feselsaPalette.green.g400,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.green.g300,
        },
      },
      "toggle-background": {
        color: {
          regular: feselsaPalette.neutral.n0,
          disabled: feselsaPalette.neutral.n0,
          hover: feselsaPalette.neutral.n0,
        },
      },
      "toggle-border": {
        color: {
          regular: feselsaPalette.neutralAlpha.n0a,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutralAlpha.n0a,
        },
      },
      icon: {
        appearance: "light",
      },
    },
    off: {
      background: {
        color: {
          regular: feselsaPalette.neutral.n20,
          disabled: feselsaPalette.neutral.n20,
          hover: feselsaPalette.neutral.n10,
        },
      },
      "toggle-background": {
        color: {
          regular: feselsaPalette.neutral.n0,
          disabled: feselsaPalette.neutral.n0,
          hover: feselsaPalette.neutral.n0,
        },
      },
      "toggle-border": {
        color: {
          regular: feselsaPalette.neutral.n70,
          disabled: feselsaPalette.neutral.n70,
          hover: feselsaPalette.neutral.n70,
        },
      },
      icon: {
        appearance: "gray",
      },
    },
  },
  box: {
    border: {
      color: feselsaPalette.neutral.n40,
    },
  },
  progressBar: {
    primary: {
      background: {
        color: feselsaPalette.blue.b400,
      },
      animation: {
        color: feselsaPalette.blue.b200,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    success: {
      background: {
        color: feselsaPalette.green.g400,
      },
      animation: {
        color: feselsaPalette.green.g200,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    warning: {
      background: {
        color: feselsaPalette.yellow.y400,
      },
      animation: {
        color: feselsaPalette.yellow.y200,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    danger: {
      background: {
        color: feselsaPalette.red.r400,
      },
      animation: {
        color: feselsaPalette.red.r200,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    help: {
      background: {
        color: feselsaPalette.purple.p400,
      },
      animation: {
        color: feselsaPalette.purple.p200,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    dark: {
      background: {
        color: feselsaPalette.neutral.n900,
      },
      animation: {
        color: feselsaPalette.neutral.n500,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    gray: {
      background: {
        color: feselsaPalette.neutral.n200,
      },
      animation: {
        color: feselsaPalette.neutral.n80,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n10,
      },
    },
    light: {
      background: {
        color: feselsaPalette.neutral.n10,
      },
      animation: {
        color: feselsaPalette.neutral.n0,
      },
      border: {
        color: feselsaPalette.neutral.n40,
      },
      track: {
        color: feselsaPalette.neutral.n50,
      },
    },
  },
  progressCard: {
    step: {
      color: feselsaPalette.green.g400,
    },
    border: {
      color: feselsaPalette.neutral.n40,
    },
    title: {
      appearance: "dark",
    },
    countStep: {
      appearance: "dark",
    },
    percentStep: {
      appearance: "gray",
    },
    progressBar: {
      appearance: "success",
    },
  },
  sectionMessage: {
    primary: {
      background: {
        color: feselsaPalette.green.g50,
      },
      countdownBar: {
        appearance: "primary",
      },
      icon: {
        appearance: "primary",
      },
      content: {
        appearance: "dark",
      },
    },
    success: {
      background: {
        color: feselsaPalette.green.g50,
      },
      countdownBar: {
        appearance: "success",
      },
      icon: {
        appearance: "success",
      },
      content: {
        appearance: "dark",
      },
    },
    warning: {
      background: {
        color: feselsaPalette.yellow.y50,
      },
      countdownBar: {
        appearance: "warning",
      },
      icon: {
        appearance: "warning",
      },
      content: {
        appearance: "dark",
      },
    },
    danger: {
      background: {
        color: feselsaPalette.red.r50,
      },
      countdownBar: {
        appearance: "danger",
      },
      icon: {
        appearance: "danger",
      },
      content: {
        appearance: "dark",
      },
    },
    help: {
      background: {
        color: feselsaPalette.purple.p50,
      },
      countdownBar: {
        appearance: "help",
      },
      icon: {
        appearance: "help",
      },
      content: {
        appearance: "dark",
      },
    },
    dark: {
      background: {
        color: feselsaPalette.neutral.n30,
      },
      countdownBar: {
        appearance: "dark",
      },
      icon: {
        appearance: "dark",
      },
      content: {
        appearance: "dark",
      },
    },
    gray: {
      background: {
        color: feselsaPalette.neutral.n10,
      },
      countdownBar: {
        appearance: "gray",
      },
      icon: {
        appearance: "gray",
      },
      content: {
        appearance: "dark",
      },
    },
    light: {
      background: {
        color: feselsaPalette.neutral.n0,
      },
      countdownBar: {
        appearance: "dark",
      },
      icon: {
        appearance: "dark",
      },
      content: {
        appearance: "dark",
      },
    },
  },
  attachArea: {
    icon: {
      appearance: {
        active: "gray",
        hover: "primary",
      },
    },
    text: {
      appearance: {
        active: "gray",
        hover: "dark",
      },
    },
    button: {
      appearance: "primary",
    },
    border: {
      color: {
        active: feselsaPalette.neutral.n40,
        hover: feselsaPalette.blue.b400,
      },
    },
    background: {
      color: {
        active: feselsaPalette.neutralAlpha.n0a,
        hover: feselsaPalette.blue.b50,
      },
    },
  },
  checkbox: {
    border: {
      color: {
        active: feselsaPalette.neutral.n80,
        indeterminate: feselsaPalette.neutralAlpha.n0a,
        checked: feselsaPalette.neutralAlpha.n0a,
        invalid: feselsaPalette.red.r400,
        disabled: feselsaPalette.neutral.n40,
      },
    },
    background: {
      color: {
        active: feselsaPalette.neutral.n0,
        indeterminate: feselsaPalette.blue.b400,
        checked: feselsaPalette.blue.b400,
        invalid: feselsaPalette.blue.b400,
        disabled: feselsaPalette.neutral.n20,
      },
    },
    vector: {
      color: {
        indeterminate: feselsaPalette.neutral.n0,
        checked: feselsaPalette.neutral.n0,
        invalid: feselsaPalette.neutral.n0,
        disabled: feselsaPalette.neutral.n60,
      },
    },
    outline: {
      color: {
        hover: feselsaPalette.blue.b300,
      },
    },
  },
  radiofield: {
    border: {
      color: {
        active: feselsaPalette.neutral.n80,
        checked: feselsaPalette.neutralAlpha.n0a,
        invalid: feselsaPalette.red.r400,
        disabled: feselsaPalette.neutral.n40,
      },
    },
    background: {
      color: {
        active: feselsaPalette.neutral.n0,
        checked: feselsaPalette.blue.b400,
        invalid: feselsaPalette.blue.b400,
        disabled: feselsaPalette.neutral.n20,
      },
    },
    foreground: {
      color: {
        checked: feselsaPalette.neutral.n0,
        invalid: feselsaPalette.neutral.n0,
        disabled: feselsaPalette.neutral.n60,
      },
    },
    outline: {
      color: {
        hover: feselsaPalette.blue.b300,
      },
    },
  },
  message: {
    primary: {
      background: {
        color: feselsaPalette.blue.b50,
      },
      icon: {
        appearance: "primary",
      },
      title: {
        appearance: "dark",
      },
      content: {
        appearance: "gray",
      },
      action: {
        appearance: {
          primary: "primary",
          secondary: "gray",
        },
      },
    },
    success: {
      background: {
        color: feselsaPalette.green.g50,
      },
      icon: {
        appearance: "success",
      },
      title: {
        appearance: "dark",
      },
      content: {
        appearance: "gray",
      },
      action: {
        appearance: {
          primary: "success",
          secondary: "gray",
        },
      },
    },
    warning: {
      background: {
        color: feselsaPalette.yellow.y50,
      },
      icon: {
        appearance: "warning",
      },
      title: {
        appearance: "dark",
      },
      content: {
        appearance: "gray",
      },
      action: {
        appearance: {
          primary: "warning",
          secondary: "gray",
        },
      },
    },
    danger: {
      background: {
        color: feselsaPalette.red.r50,
      },
      icon: {
        appearance: "danger",
      },
      title: {
        appearance: "dark",
      },
      content: {
        appearance: "gray",
      },
      action: {
        appearance: {
          primary: "danger",
          secondary: "gray",
        },
      },
    },
    help: {
      background: {
        color: feselsaPalette.purple.p50,
      },
      icon: {
        appearance: "help",
      },
      title: {
        appearance: "dark",
      },
      content: {
        appearance: "gray",
      },
      action: {
        appearance: {
          primary: "help",
          secondary: "gray",
        },
      },
    },
    dark: {
      background: {
        color: feselsaPalette.neutral.n30,
      },
      icon: {
        appearance: "dark",
      },
      title: {
        appearance: "dark",
      },
      content: {
        appearance: "gray",
      },
      action: {
        appearance: {
          primary: "dark",
          secondary: "gray",
        },
      },
    },
    gray: {
      background: {
        color: feselsaPalette.neutral.n10,
      },
      icon: {
        appearance: "gray",
      },
      title: {
        appearance: "dark",
      },
      content: {
        appearance: "gray",
      },
      action: {
        appearance: {
          primary: "dark",
          secondary: "gray",
        },
      },
    },
    light: {
      background: {
        color: feselsaPalette.neutral.n0,
      },
      icon: {
        appearance: "dark",
      },
      title: {
        appearance: "dark",
      },
      content: {
        appearance: "gray",
      },
      action: {
        appearance: {
          primary: "dark",
          secondary: "gray",
        },
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
