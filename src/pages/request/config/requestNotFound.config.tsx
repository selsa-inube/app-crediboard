import itemNotFound from "@assets/images/ItemNotFound.png";

const requestNotFoundConfig = {
  image: itemNotFound,
  title: "¡Ups! La solicitud de crédito no fue encontrada...",
  description:
    "La solicitud de crédito que estás buscando no se encuentra disponible en estos momentos.",
  buttonDescription: "Volver",
  route: "/board",
};

export const requestNotFoundConfigEnum = {
  image: {
    code: "RequestNotFound_image",
    description: "Image displayed when the credit request is not found",
    i18n: {
      en: "itemNotFound",
      es: "itemNotFound",
    },
  },
  title: {
    code: "RequestNotFound_title",
    description: "Title displayed when the credit request is not found",
    i18n: {
      en: "Oops! The credit request was not found...",
      es: "¡Ups! La solicitud de crédito no fue encontrada...",
    },
  },
  description: {
    code: "RequestNotFound_description",
    description: "Description displayed when the credit request is not available",
    i18n: {
      en: "The credit request you are looking for is not available at the moment.",
      es: "La solicitud de crédito que estás buscando no se encuentra disponible en estos momentos.",
    },
  },
  buttonDescription: {
    code: "RequestNotFound_buttonDescription",
    description: "Text for the button to go back",
    i18n: {
      en: "Go back",
      es: "Volver",
    },
  },
  route: {
    code: "RequestNotFound_route",
    description: "Route to navigate when button is clicked",
    i18n: {
      en: "/board",
      es: "/board",
    },
  },
};

export { requestNotFoundConfig };
