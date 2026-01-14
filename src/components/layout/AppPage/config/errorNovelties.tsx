import userImage from "@assets/images/userErrorNovelties.png";
import { MdChevronRight } from "react-icons/md";
export interface EmptyNoveltiesConfig {
  image: {
    src: string;
    alt: string;
  };
  messages: {
    primary: string;
    secondary: string;
  };
  novelties: {
    description: string;
    actionText: string;
    actionIcon: React.ReactNode;
  };
}

export const emptyNoveltiesConfigEnum = {
  image: {
    src: userImage,
    alt: {
      code: "EmptyNovelties_image_alt",
      description: "User without novelties",
      i18n: {
        en: "User without novelties",
        es: "Usuario sin novedades",
      },
    },
  },
  messages: {
    primary: {
      code: "EmptyNovelties_primary_message",
      description: "You have no unread novelties",
      i18n: {
        en: "You have no unread novelties",
        es: "No tienes novedades sin leer",
      },
    },
    secondary: {
      code: "EmptyNovelties_secondary_message",
      description: "Everything is up to date!",
      i18n: {
        en: "Everything is up to date!",
        es: "¡Todo está al día!",
      },
    },
  },
  novelties: {
    description: {
      code: "EmptyNovelties_description",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet tristique augue. Duis id metus ligula. Quisque sed iaculis ex. Vivamus non imperdiet orci. Nulla placerat congue nunc quis vestibulum. Nam ac arcu interdum, euismod metus at, congue felis. Sed maximus eros et elit malesuada porttitor. Phasellus est ipsum, facilisis luctus malesuada eu, gravida eget eros.",
      i18n: {
        en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet tristique augue. Duis id metus ligula. Quisque sed iaculis ex. Vivamus non imperdiet orci. Nulla placerat congue nunc quis vestibulum. Nam ac arcu interdum, euismod metus at, congue felis. Sed maximus eros et elit malesuada porttitor. Phasellus est ipsum, facilisis luctus malesuada eu, gravida eget eros.",
        es: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet tristique augue. Duis id metus ligula. Quisque sed iaculis ex. Vivamus non imperdiet orci. Nulla placerat congue nunc quis vestibulum. Nam ac arcu interdum, euismod metus at, congue felis. Sed maximus eros et elit malesuada porttitor. Phasellus est ipsum, facilisis luctus malesuada eu, gravida eget eros.",
      },
    },
    actionText: {
      code: "EmptyNovelties_action_text",
      description: "Go to this request",
      i18n: {
        en: "Go to this request",
        es: "Ir a esta solicitud",
      },
    },
    actionIcon: <MdChevronRight />,
  },
};

