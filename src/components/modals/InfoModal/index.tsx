import { MdClose } from "react-icons/md";
import { Stack, Icon } from "@inubekit/inubekit";

import check from "@assets/images/check.svg";
import close from "@assets/images/close.svg";
import remove from "@assets/images/remove.svg";
import info from "@assets/images/info.svg";
import { useEnum } from "@hooks/useEnum";

import { textsEnum, altTextsEnum } from "./config";
import { StyledContainer, StyledUl } from "./styles";
import { InfoItemComponent } from "./interface";

export interface InfoItem {
  icon: JSX.Element;
  text: string;
  appearance?:
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "help"
  | "dark"
  | "gray"
  | "light";
  shape?: "circle" | "rectangle";
}

interface InfoModalProps {
  onClose?: () => void;
  items?: InfoItem[];
}

export const InfoModal = ({ onClose, items = [] }: InfoModalProps) => {
  const language = useEnum().lang;

  const defaultItems: InfoItem[] = [
    {
      icon: <img src={check} alt={altTextsEnum.check.i18n[language]} width={16} height={16} />,
      text: textsEnum.infoModalCheck.i18n[language],
    },
    {
      icon: <img src={close} alt={altTextsEnum.close.i18n[language]} width={16} height={16} />,
      text: textsEnum.infoModalClose.i18n[language],
    },
    {
      icon: <img src={remove} alt={altTextsEnum.remove.i18n[language]} width={16} height={16} />,
      text: textsEnum.infoModalRemove.i18n[language],
    },
    {
      icon: <img src={info} alt={altTextsEnum.info.i18n[language]} width={16} height={16} />,
      text: textsEnum.infoModalInfo.i18n[language],
    },
  ];

  const mergeItems = (
    defaultItems: InfoItem[],
    customItems: InfoItem[]
  ): InfoItem[] => {
    const mergedItems = defaultItems
      .flatMap((defaultItem) => {
        const matchingCustomItems = customItems.filter(
          (item) => item.icon.type === defaultItem.icon.type
        );

        if (matchingCustomItems.length > 0) {
          return matchingCustomItems.map((customItem) => ({
            ...defaultItem,
            ...customItem,
          }));
        }
        return defaultItem;
      })
      .concat(
        customItems.filter(
          (item) =>
            !defaultItems.some(
              (defaultItem) => defaultItem.icon.type === item.icon.type
            )
        )
      );

    return mergedItems;
  };

  const mergedItems = mergeItems(defaultItems, items);
  return (
    <StyledContainer>
      <Stack padding="10px 20px">
        <Icon
          icon={<MdClose />}
          appearance="dark"
          size="24px"
          onClick={onClose}
        />
        <StyledUl>
          {mergedItems.map((item) => (
            <InfoItemComponent key={item.text} item={item} />
          ))}
        </StyledUl>
      </Stack>
    </StyledContainer>
  );
};
