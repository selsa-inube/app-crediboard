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
export const emptyNoveltiesConfig: EmptyNoveltiesConfig = {
  image: {
    src: userImage,
    alt: "Usuario sin novedades",
  },
  messages: {
    primary: "No tienes novedades sin leer",
    secondary: "¡Todo está al día!",
  },
  novelties: {
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet tristique augue. Duis id metus ligula. Quisque sed iaculis ex. Vivamus non imperdiet orci. Nulla placerat congue nunc quis vestibulum. Nam ac arcu interdum, euismod metus at, congue felis. Sed maximus eros et elit malesuada porttitor. Phasellus est ipsum, facilisis luctus malesuada eu, gravida eget eros.",
    actionText: "Ir a esta solicitud",
    actionIcon: <MdChevronRight />,
  },
};
