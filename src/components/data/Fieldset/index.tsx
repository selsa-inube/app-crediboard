import { useState } from "react";
import { MdAdd, MdOutlineMoreVert } from "react-icons/md";
import { Stack, Text, useMediaQuery, Button, Icon } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { MenuProspect } from "@components/navigation/MenuProspect";

import {
  StyledContainerFieldset,
  StyledMenuContainer,
  StyledMenuDropdown,
  StyledPrint,
} from "./styles";
import { titlesModal } from "./config";

interface IOptionsButton {
  title: string;
  titleHuman: string;
  onClick?: () => void;
  onClickHuman?: () => void;
}

interface IFieldsetProps {
  onSelectionChange?: () => void;
  children: JSX.Element | JSX.Element[];
  title?: string;
  aspectRatio?: string;
  heightFieldset?: string;
  descriptionTitle?: string;
  activeButton?: IOptionsButton;
  disabledButton?: boolean;
  hasTable?: boolean;
  hasOverflow?: boolean;
  isMobile?: boolean;
  isClickable?: boolean;
  selectedState?: boolean;
  hasError?: boolean;
  alignContent?: string;
  borderColor?: string;
}

export const Fieldset = (props: IFieldsetProps) => {
  const {
    onSelectionChange,
    children,
    title,
    aspectRatio,
    heightFieldset,
    descriptionTitle,
    activeButton,
    hasTable = false,
    hasOverflow = false,
    isClickable = false,
    selectedState = false,
    hasError = false,
    borderColor = "normal",
    alignContent,
  } = props;

  const isMobile = useMediaQuery("(max-width:880px)");

  const [isSelected, setIsSelected] = useState(selectedState || false);
  const [infoModal, setInfoModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const handleOnClick = () => {
    if (isClickable) {
      setIsSelected(!isSelected);
      if (onSelectionChange) {
        onSelectionChange();
      }
    }
  };
  const menuOptions = (): {
    title: string;
    onClick: () => void;
    visible: boolean;
    icon: JSX.Element;
  }[] => [
    {
      icon: <MdAdd />,
      title: activeButton?.title || "",
      onClick: () => {
        activeButton?.onClick?.();
        setShowMenu(false);
      },
      visible: true,
    },
    {
      icon: <MdAdd />,
      title: activeButton?.titleHuman || "",
      onClick: () => {
        activeButton?.onClickHuman?.();
        setShowMenu(false);
      },
      visible: true,
    },
  ];

  return (
    <Stack
      direction="column"
      gap="8px"
      width="-webkit-fill-available"
      height={!isMobile ? heightFieldset : "auto"}
    >
      <Stack justifyContent={activeButton && "space-between"}>
        <Stack gap={isMobile ? "12px" : "8px"}>
          <Text
            type="title"
            appearance="gray"
            size={isMobile ? "medium" : "large"}
          >
            {title}
          </Text>
          {descriptionTitle && (
            <Text type="title" ellipsis size={isMobile ? "medium" : "large"}>
              {descriptionTitle}
            </Text>
          )}
        </Stack>
        {activeButton && (
          <Stack>
            {isMobile ? (
              <StyledMenuContainer>
                <Icon
                  icon={<MdOutlineMoreVert />}
                  appearance="primary"
                  size="24px"
                  cursorHover
                  onClick={() => setShowMenu((prev) => !prev)}
                />

                {showMenu && activeButton && (
                  <StyledMenuDropdown>
                    <MenuProspect
                      options={menuOptions()}
                      onMouseLeave={() => setShowMenu(false)}
                    />
                  </StyledMenuDropdown>
                )}
              </StyledMenuContainer>
            ) : (
              <StyledPrint>
                <Button
                  iconBefore={<MdAdd />}
                  spacing="compact"
                  onClick={activeButton.onClick}
                  variant="outlined"
                >
                  {activeButton.title}
                </Button>
                <Button
                  iconBefore={<MdAdd />}
                  spacing="compact"
                  onClick={activeButton.onClickHuman}
                  variant="outlined"
                >
                  {activeButton.titleHuman}
                </Button>
              </StyledPrint>
            )}
          </Stack>
        )}
      </Stack>
      <StyledContainerFieldset
        $aspectRatio={aspectRatio}
        $isMobile={isMobile}
        $hasOverflow={hasOverflow}
        $hasTable={hasTable}
        onClick={handleOnClick}
        $isSelected={selectedState ?? isSelected}
        $height={isMobile ? "auto" : heightFieldset}
        $isClickable={isClickable}
        $hasError={hasError}
        $alignContent={alignContent}
        $borderColor={borderColor}
      >
        {children}
      </StyledContainerFieldset>
      {infoModal && (
        <>
          <BaseModal
            title={titlesModal.title}
            nextButton={titlesModal.textButtonNext}
            handleNext={() => setInfoModal(false)}
            handleClose={() => setInfoModal(false)}
            width={isMobile ? "290px" : "400px"}
          >
            <Stack gap="16px" direction="column">
              <Text weight="bold" size="large">
                {titlesModal.subTitle}
              </Text>
              <Text weight="normal" size="medium" appearance="gray">
                {titlesModal.description}
              </Text>
            </Stack>
          </BaseModal>
        </>
      )}
    </Stack>
  );
};
