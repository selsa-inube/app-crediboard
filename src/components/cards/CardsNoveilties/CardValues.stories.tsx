import { Meta, StoryObj } from "@storybook/react";
import { MdChevronRight } from "react-icons/md";

import userNovelties from "@assets/images/user.Novelties.jpg";

import { CardNoveilties, ICardNoveilties } from "./index";

export default {
  title: "Components/cards/CardNoveilties",
  component: CardNoveilties,
} as Meta<typeof CardNoveilties>;

export const Default: StoryObj<ICardNoveilties> = {
  args: {
    userImage: userNovelties,
    userImageAlt: "User profile",
    userName: "Julie Andrews Stein",
    dateTime: "02/Jun/2024 - 12:23 p. m.",
    referenceCode: "SC-545454678",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet tristique augue. Duis id metus ligula. Quisque sed iaculis ex. Vivamus non imperdiet orci. Nulla placerat congue nunc quis vestibulum. Nam ac arcu interdum, euismod metus at, congue felis. Sed maximus eros et elit malesuada porttitor. Phasellus est ipsum, facilisis luctus malesuada eu, gravida eget eros.",
    actionText: "Ir a esta solicitud",
    actionIcon: <MdChevronRight />,
    onActionClick: () => alert("Click en la acción!"),
  },
};
