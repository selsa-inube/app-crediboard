import userImage from "@assets/images/userErrorNovelties.png";
export interface EmptyNoveltiesConfig {
  image: {
    src: string;
    alt: string;
  };
  messages: {
    primary: string;
    secondary: string;
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
};
