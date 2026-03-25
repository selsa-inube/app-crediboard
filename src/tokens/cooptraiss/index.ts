import { cooptraissPalette } from "./color/palette/palette";
import { typography } from "./typography/typography";

const cooptraiss = {
  typography,
  assisted: {
    title: {
      appearance: "dark",
    },
    description: {
      appearance: "gray",
    },
    track: {
      color: cooptraissPalette.neutral.n30,
    },
    bar: {
      color: cooptraissPalette.green.g400,
    },
    background: {
      color: cooptraissPalette.neutral.n10,
    },
    button: {
      appearance: "primary",
    },
    step: {
      color: cooptraissPalette.green.g400,
    },
  },
  blanket: {
    background: {
      color: cooptraissPalette.neutralAlpha.n100a,
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
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.green.g300,
        },
      },
      border: {
        color: {
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.green.g300,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    success: {
      content: {
        color: {
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.green.g300,
        },
      },
      border: {
        color: {
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.green.g300,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    warning: {
      content: {
        color: {
          regular: cooptraissPalette.yellow.y400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.yellow.y300,
        },
      },
      border: {
        color: {
          regular: cooptraissPalette.yellow.y400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.yellow.y300,
        },
      },
      contrast: {
        appearance: "dark",
      },
    },
    danger: {
      content: {
        color: {
          regular: cooptraissPalette.red.r400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.red.r300,
        },
      },
      border: {
        color: {
          regular: cooptraissPalette.red.r400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.red.r300,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    help: {
      content: {
        color: {
          regular: cooptraissPalette.purple.p400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.purple.p300,
        },
      },
      border: {
        color: {
          regular: cooptraissPalette.purple.p400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.purple.p300,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    dark: {
      content: {
        color: {
          regular: cooptraissPalette.neutral.n900,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.neutral.n500,
        },
      },
      border: {
        color: {
          regular: cooptraissPalette.neutral.n900,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n500,
        },
      },
      contrast: {
        appearance: "light",
      },
    },
    gray: {
      content: {
        color: {
          regular: cooptraissPalette.neutral.n20,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.neutral.n30,
        },
      },
      border: {
        color: {
          regular: cooptraissPalette.neutral.n200,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n90,
        },
      },
      contrast: {
        appearance: "gray",
      },
    },
    light: {
      content: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.neutral.n0,
        },
      },
      border: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n0,
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
        color: "inube.cooptraissPalette.green.g400",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    success: {
      background: {
        color: "inube.cooptraissPalette.green.g400",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    warning: {
      background: {
        color: "inube.cooptraissPalette.yellow.y400",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    danger: {
      background: {
        color: "inube.cooptraissPalette.red.r400",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    help: {
      background: {
        color: "inube.cooptraissPalette.purple.p400",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    dark: {
      background: {
        color: "inube.cooptraissPalette.neutral.n900",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    gray: {
      background: {
        color: "inube.cooptraissPalette.neutral.n200",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    light: {
      background: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n50",
      },
    },
  },
  divider: {
    stroke: {
      color: cooptraissPalette.neutral.n40,
    },
  },
  fieldset: {
    legend: {
      color: cooptraissPalette.neutral.n200,
    },
    border: {
      color: cooptraissPalette.neutral.n40,
    },
  },
  fullscreenNav: {
    background: {
      color: cooptraissPalette.neutral.n10,
    },
    divider: {
      color: cooptraissPalette.neutral.n40,
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
        expanded: cooptraissPalette.neutral.n30,
      },
    },
    link: {
      appearance: {
        regular: "dark",
        selected: "primary",
      },
      background: {
        selected: cooptraissPalette.neutral.n30,
        hover: cooptraissPalette.neutral.n30,
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
      color: cooptraissPalette.neutral.n0,
    },
    content: {
      appearance: "gray",
    },
  },
  icon: {
    primary: {
      content: {
        color: {
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.green.g300,
        },
      },
      background: {
        color: {
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.green.g300,
        },
      },
      contrast: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n10,
        },
      },
    },
    success: {
      content: {
        color: {
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.green.g300,
        },
      },
      background: {
        color: {
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.green.g300,
        },
      },
      contrast: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n10,
        },
      },
    },
    warning: {
      content: {
        color: {
          regular: cooptraissPalette.yellow.y400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.yellow.y300,
        },
      },
      background: {
        color: {
          regular: cooptraissPalette.yellow.y400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.yellow.y300,
        },
      },
      contrast: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n10,
        },
      },
    },
    danger: {
      content: {
        color: {
          regular: cooptraissPalette.red.r400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.red.r300,
        },
      },
      background: {
        color: {
          regular: cooptraissPalette.red.r400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.red.r300,
        },
      },
      contrast: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n10,
        },
      },
    },
    help: {
      content: {
        color: {
          regular: cooptraissPalette.purple.p400,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.purple.p300,
        },
      },
      background: {
        color: {
          regular: cooptraissPalette.purple.p400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.purple.p300,
        },
      },
      contrast: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n10,
        },
      },
    },
    dark: {
      content: {
        color: {
          regular: cooptraissPalette.neutral.n900,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n500,
        },
      },
      background: {
        color: {
          regular: cooptraissPalette.neutral.n900,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.neutral.n500,
        },
      },
      contrast: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n10,
        },
      },
    },
    gray: {
      content: {
        color: {
          regular: cooptraissPalette.neutral.n300,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n100,
        },
      },
      background: {
        color: {
          regular: cooptraissPalette.neutral.n20,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.neutral.n30,
        },
      },
      contrast: {
        color: {
          regular: cooptraissPalette.neutral.n900,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n900,
        },
      },
    },
    light: {
      content: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n0,
        },
      },
      background: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.neutral.n0,
        },
      },
      contrast: {
        color: {
          regular: cooptraissPalette.neutral.n900,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n900,
        },
      },
    },
  },
  input: {
    border: {
      color: {
        regular: cooptraissPalette.neutral.n40,
        disabled: cooptraissPalette.neutral.n40,
        focus: cooptraissPalette.blue.b300,
        invalid: cooptraissPalette.red.r400,
      },
    },
    background: {
      color: {
        regular: cooptraissPalette.neutral.n0,
        disabled: cooptraissPalette.neutral.n10,
      },
    },
    content: {
      color: {
        regular: cooptraissPalette.neutral.n900,
        disabled: cooptraissPalette.neutral.n200,
      },
    },
    placeholder: {
      color: {
        regular: cooptraissPalette.neutral.n300,
      },
    },
    message: {
      color: {
        regular: cooptraissPalette.red.r400,
      },
    },
    required: {
      color: {
        regular: cooptraissPalette.red.r400,
        disabled: cooptraissPalette.neutral.n70,
      },
    },
    optionList: {
      appearance: {
        regular: "dark",
        expanded: "primary",
      },
      background: {
        expanded: cooptraissPalette.neutral.n0,
        selected: cooptraissPalette.neutral.n30,
      },
    },
  },
  link: {
    content: {
      color: {
        regular: cooptraissPalette.blue.b400,
        hover: cooptraissPalette.blue.b300,
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
        hover: cooptraissPalette.neutral.n20,
        disabled: cooptraissPalette.neutral.n20,
      },
    },
    background: {
      color: cooptraissPalette.neutral.n0,
    },
    divider: {
      color: cooptraissPalette.neutral.n40,
    },
  },
  nav: {
    background: {
      color: cooptraissPalette.neutral.n10,
    },
    divider: {
      color: cooptraissPalette.neutral.n40,
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
        expanded: cooptraissPalette.neutral.n30,
      },
    },
    link: {
      appearance: {
        regular: "dark",
        selected: "primary",
      },
      background: {
        selected: cooptraissPalette.neutral.n30,
        hover: cooptraissPalette.neutral.n30,
      },
    },
    copyright: {
      appearance: "gray",
    },
  },
  flag: {
    primary: {
      background: {
        color: cooptraissPalette.blue.b50,
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
        color: cooptraissPalette.green.g50,
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
        color: cooptraissPalette.yellow.y50,
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
        color: cooptraissPalette.red.r50,
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
        color: cooptraissPalette.purple.p50,
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
        color: cooptraissPalette.neutral.n30,
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
        color: cooptraissPalette.neutral.n10,
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
        color: cooptraissPalette.neutral.n0,
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
      color: cooptraissPalette.neutral.n30,
    },
    animation: {
      color: cooptraissPalette.neutral.n10,
    },
  },
  spinner: {
    primary: {
      solid: {
        spin: {
          color: cooptraissPalette.green.g400,
        },
        track: {
          color: cooptraissPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: cooptraissPalette.green.g400,
        },
        track: {
          color: cooptraissPalette.neutralAlpha.n0a,
        },
      },
    },
    success: {
      solid: {
        spin: {
          color: cooptraissPalette.green.g400,
        },
        track: {
          color: cooptraissPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: cooptraissPalette.green.g400,
        },
        track: {
          color: cooptraissPalette.neutralAlpha.n0a,
        },
      },
    },
    warning: {
      solid: {
        spin: {
          color: cooptraissPalette.yellow.y400,
        },
        track: {
          color: cooptraissPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: cooptraissPalette.yellow.y400,
        },
        track: {
          color: cooptraissPalette.neutralAlpha.n0a,
        },
      },
    },
    danger: {
      solid: {
        spin: {
          color: cooptraissPalette.red.r400,
        },
        track: {
          color: cooptraissPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: cooptraissPalette.red.r400,
        },
        track: {
          color: cooptraissPalette.neutralAlpha.n0a,
        },
      },
    },
    help: {
      solid: {
        spin: {
          color: cooptraissPalette.purple.p400,
        },
        track: {
          color: cooptraissPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: cooptraissPalette.purple.p400,
        },
        track: {
          color: cooptraissPalette.neutralAlpha.n0a,
        },
      },
    },
    dark: {
      solid: {
        spin: {
          color: cooptraissPalette.neutral.n900,
        },
        track: {
          color: cooptraissPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: cooptraissPalette.neutral.n900,
        },
        track: {
          color: cooptraissPalette.neutralAlpha.n0a,
        },
      },
    },
    gray: {
      solid: {
        spin: {
          color: cooptraissPalette.neutral.n100,
        },
        track: {
          color: cooptraissPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: cooptraissPalette.neutral.n100,
        },
        track: {
          color: cooptraissPalette.neutralAlpha.n0a,
        },
      },
    },
    light: {
      solid: {
        spin: {
          color: cooptraissPalette.neutral.n10,
        },
        track: {
          color: cooptraissPalette.neutral.n30,
        },
      },
      transparent: {
        spin: {
          color: cooptraissPalette.neutral.n10,
        },
        track: {
          color: cooptraissPalette.neutralAlpha.n0a,
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
        color: cooptraissPalette.blue.b50,
      },
      border: {
        color: cooptraissPalette.blue.b400,
      },
      content: {
        appearance: "primary",
      },
    },
    success: {
      background: {
        color: cooptraissPalette.green.g50,
      },
      border: {
        color: cooptraissPalette.green.g400,
      },
      content: {
        appearance: "success",
      },
    },
    warning: {
      background: {
        color: cooptraissPalette.yellow.y50,
      },
      border: {
        color: cooptraissPalette.yellow.y400,
      },
      content: {
        appearance: "warning",
      },
    },
    danger: {
      background: {
        color: cooptraissPalette.red.r50,
      },
      border: {
        color: cooptraissPalette.red.r400,
      },
      content: {
        appearance: "danger",
      },
    },
    help: {
      background: {
        color: cooptraissPalette.purple.p50,
      },
      border: {
        color: cooptraissPalette.purple.p400,
      },
      content: {
        appearance: "help",
      },
    },
    dark: {
      background: {
        color: cooptraissPalette.neutral.n30,
      },
      border: {
        color: cooptraissPalette.neutral.n900,
      },
      content: {
        appearance: "dark",
      },
    },
    gray: {
      background: {
        color: cooptraissPalette.neutral.n10,
      },
      border: {
        color: cooptraissPalette.neutral.n200,
      },
      content: {
        appearance: "gray",
      },
    },
    light: {
      background: {
        color: cooptraissPalette.neutralAlpha.n0a,
      },
      border: {
        color: cooptraissPalette.neutral.n10,
      },
      content: {
        appearance: "light",
      },
    },
  },
  table: {
    border: {
      color: cooptraissPalette.neutral.n40,
    },
    heading: {
      background: cooptraissPalette.neutral.n0,
      color: cooptraissPalette.neutral.n900,
    },
    action: {
      background: {
        action: cooptraissPalette.neutral.n30,
      },
      color: {
        action: cooptraissPalette.neutral.n900,
      },
    },
    row: {
      background: {
        regular: cooptraissPalette.neutral.n0,
        zebra: cooptraissPalette.neutral.n30,
      },
      color: {
        regular: cooptraissPalette.neutral.n900,
        zebra: cooptraissPalette.neutral.n900,
      },
    },
    cell: {
      color: {
        primary: cooptraissPalette.blue.b400,
        success: cooptraissPalette.green.g400,
        warning: cooptraissPalette.yellow.y400,
        danger: cooptraissPalette.red.r400,
        help: cooptraissPalette.purple.p400,
        dark: cooptraissPalette.neutral.n900,
        gray: cooptraissPalette.neutral.n300,
        light: cooptraissPalette.neutral.n900,
      },
      background: {
        primary: cooptraissPalette.blue.b50,
        success: cooptraissPalette.green.g50,
        warning: cooptraissPalette.yellow.y50,
        danger: cooptraissPalette.red.r50,
        help: cooptraissPalette.purple.p50,
        dark: cooptraissPalette.neutral.n30,
        gray: cooptraissPalette.neutral.n20,
        light: cooptraissPalette.neutral.n0,
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
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n200,
          hover: cooptraissPalette.green.g300,
        },
      },
    },
    success: {
      content: {
        color: {
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n200,
          hover: cooptraissPalette.green.g300,
        },
      },
    },
    warning: {
      content: {
        color: {
          regular: cooptraissPalette.yellow.y400,
          disabled: cooptraissPalette.neutral.n200,
          hover: cooptraissPalette.yellow.y300,
        },
      },
    },
    danger: {
      content: {
        color: {
          regular: cooptraissPalette.red.r400,
          disabled: cooptraissPalette.neutral.n200,
          hover: cooptraissPalette.red.r300,
        },
      },
    },
    help: {
      content: {
        color: {
          regular: cooptraissPalette.purple.p400,
          disabled: cooptraissPalette.neutral.n200,
          hover: cooptraissPalette.purple.p300,
        },
      },
    },
    dark: {
      content: {
        color: {
          regular: cooptraissPalette.neutral.n900,
          disabled: cooptraissPalette.neutral.n200,
          hover: cooptraissPalette.neutral.n500,
        },
      },
    },
    gray: {
      content: {
        color: {
          regular: cooptraissPalette.neutral.n200,
          disabled: cooptraissPalette.neutral.n200,
          hover: cooptraissPalette.neutral.n100,
        },
      },
    },
    light: {
      content: {
        color: {
          regular: cooptraissPalette.neutral.n10,
          disabled: cooptraissPalette.neutral.n200,
          hover: cooptraissPalette.neutral.n0,
        },
      },
    },
  },
  toggle: {
    on: {
      background: {
        color: {
          regular: cooptraissPalette.green.g400,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.green.g300,
        },
      },
      toggleBackground: {
        color: {
          regular: cooptraissPalette.neutral.n0,
          disabled: cooptraissPalette.neutral.n0,
          hover: cooptraissPalette.neutral.n0,
        },
      },
      toggleBorder: {
        color: {
          regular: cooptraissPalette.neutralAlpha.n0a,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutralAlpha.n0a,
        },
      },
      icon: {
        appearance: "light",
      },
    },
    off: {
      background: {
        color: {
          regular: cooptraissPalette.neutral.n20,
          disabled: cooptraissPalette.neutral.n20,
          hover: cooptraissPalette.neutral.n10,
        },
      },
      toggleBackground: {
        color: {
          regular: cooptraissPalette.neutral.n0,
          disabled: cooptraissPalette.neutral.n0,
          hover: cooptraissPalette.neutral.n0,
        },
      },
      toggleBorder: {
        color: {
          regular: cooptraissPalette.neutral.n70,
          disabled: cooptraissPalette.neutral.n70,
          hover: cooptraissPalette.neutral.n70,
        },
      },
      icon: {
        appearance: "gray",
      },
    },
  },
  box: {
    border: {
      color: cooptraissPalette.neutral.n40,
    },
  },
  progressBar: {
    primary: {
      background: {
        color: "inube.cooptraissPalette.green.g400",
      },
      animation: {
        color: "inube.cooptraissPalette.green.g200",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    success: {
      background: {
        color: "inube.cooptraissPalette.green.g400",
      },
      animation: {
        color: "inube.cooptraissPalette.green.g200",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    warning: {
      background: {
        color: "inube.cooptraissPalette.yellow.y400",
      },
      animation: {
        color: "inube.cooptraissPalette.yellow.y200",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    danger: {
      background: {
        color: "inube.cooptraissPalette.red.r400",
      },
      animation: {
        color: "inube.cooptraissPalette.red.r200",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    help: {
      background: {
        color: "inube.cooptraissPalette.purple.p400",
      },
      animation: {
        color: "inube.cooptraissPalette.purple.p200",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    dark: {
      background: {
        color: "inube.cooptraissPalette.neutral.n900",
      },
      animation: {
        color: "inube.cooptraissPalette.neutral.n500",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    gray: {
      background: {
        color: "inube.cooptraissPalette.neutral.n200",
      },
      animation: {
        color: "inube.cooptraissPalette.neutral.n80",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
    },
    light: {
      background: {
        color: "inube.cooptraissPalette.neutral.n10",
      },
      animation: {
        color: "inube.cooptraissPalette.neutral.n0",
      },
      border: {
        color: "inube.cooptraissPalette.neutral.n40",
      },
      track: {
        color: "inube.cooptraissPalette.neutral.n50",
      },
    },
  },
  progressCard: {
    step: {
      color: cooptraissPalette.green.g400,
    },
    border: {
      color: cooptraissPalette.neutral.n40,
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
        color: cooptraissPalette.green.g50,
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
        color: cooptraissPalette.green.g50,
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
        color: cooptraissPalette.yellow.y50,
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
        color: cooptraissPalette.red.r50,
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
        color: cooptraissPalette.purple.p50,
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
        color: cooptraissPalette.neutral.n30,
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
        color: cooptraissPalette.neutral.n10,
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
        color: cooptraissPalette.neutral.n0,
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
      button: {
        appearance: "primary",
      },
      border: {
        color: {
          active: "inube.cooptraissPalette.neutral.n40",
          hover: "inube.cooptraissPalette.green.g400",
        },
        background: {
          color: {
            active: "inube.cooptraissPalette.neutralAlpha.n0a",
            hover: "inube.cooptraissPalette.blue.b50",
          },
        },
      },
      background: {
        color: {
          active: "inube.cooptraissPalette.neutralAlpha.n0a",
          hover: "inube.cooptraissPalette.blue.b50",
        },
      },
    },
  },
  checkbox: {
    border: {
      color: {
        active: "inube.cooptraissPalette.neutral.n80",
        indeterminate: "inube.cooptraissPalette.neutralAlpha.n0a",
        checked: "inube.cooptraissPalette.neutralAlpha.n0a",
        invalid: "inube.cooptraissPalette.red.r400",
        disabled: "inube.cooptraissPalette.neutral.n40",
      },
    },
    background: {
      color: {
        active: "inube.cooptraissPalette.neutral.n0",
        indeterminate: "inube.cooptraissPalette.green.g400",
        checked: "inube.cooptraissPalette.green.g400",
        invalid: "inube.cooptraissPalette.green.g400",
        disabled: "inube.cooptraissPalette.neutral.n20",
      },
    },
    vector: {
      color: {
        indeterminate: "inube.cooptraissPalette.neutral.n0",
        checked: "inube.cooptraissPalette.neutral.n0",
        invalid: "inube.cooptraissPalette.neutral.n0",
        disabled: "inube.cooptraissPalette.neutral.n60",
      },
    },
    outline: {
      color: {
        hover: "inube.cooptraissPalette.green.g300",
      },
    },
  },
  radiofield: {
    border: {
      color: {
        active: "inube.cooptraissPalette.neutral.n80",
        checked: "inube.cooptraissPalette.neutralAlpha.n0a",
        invalid: "inube.cooptraissPalette.red.r400",
        disabled: "inube.cooptraissPalette.neutral.n40",
      },
    },
    background: {
      color: {
        active: "inube.cooptraissPalette.neutral.n0",
        checked: "inube.cooptraissPalette.green.g400",
        invalid: "inube.cooptraissPalette.green.g400",
        disabled: "inube.cooptraissPalette.neutral.n20",
      },
    },
    vector: {
      color: {
        checked: "inube.cooptraissPalette.neutral.n0",
        invalid: "inube.cooptraissPalette.neutral.n0",
        disabled: "inube.cooptraissPalette.neutral.n60",
      },
    },
    outline: {
      color: {
        hover: "inube.cooptraissPalette.green.g300",
      },
    },
  },
  message: {
    primary: {
      background: {
        color: cooptraissPalette.green.g50,
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
        color: cooptraissPalette.green.g50,
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
        color: cooptraissPalette.yellow.y50,
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
        color: cooptraissPalette.red.r50,
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
        color: cooptraissPalette.purple.p50,
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
        color: cooptraissPalette.neutral.n30,
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
        color: cooptraissPalette.neutral.n10,
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
        color: cooptraissPalette.neutral.n0,
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
  BoxContainer: {
    light: {
      border: {
        color: cooptraissPalette.neutral.n0,
      },
      background: {
        color: cooptraissPalette.neutral.n0,
      },
      boxShadow: {
        color: cooptraissPalette.neutral.n0,
      },
    },
    gray: {
      border: {
        color: cooptraissPalette.neutral.n10,
      },
      background: {
        color: cooptraissPalette.neutral.n10,
      },
      boxShadow: {
        color: cooptraissPalette.neutral.n10,
      },
    },
    dark: {
      border: {
        color: cooptraissPalette.neutral.n40,
      },
      background: {
        color: cooptraissPalette.neutral.n40,
      },
      boxShadow: {
        color: cooptraissPalette.neutral.n40,
      },
    },
    primary: {
      border: {
        color: cooptraissPalette.blue.b300,
      },
      background: {
        color: cooptraissPalette.blue.b300,
      },
      boxShadow: {
        color: cooptraissPalette.blue.b300,
      },
    },
    danger: {
      border: {
        color: cooptraissPalette.red.r400,
      },
      background: {
        color: cooptraissPalette.red.r50,
      },
      boxShadow: {
        color: cooptraissPalette.red.r50,
      },
    },
  },
  appCard: {
    boxShadow: {
      color: {
        regular: cooptraissPalette.neutral.n40,
      },
    },
    background: {
      color: {
        regular: cooptraissPalette.neutral.n0,
        hover: cooptraissPalette.neutral.n20,
      },
    },
  },
};

export { cooptraiss };
