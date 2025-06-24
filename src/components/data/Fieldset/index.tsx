import { useState } from "react";
import { MdAdd, MdOutlineInfo } from "react-icons/md";
import { Stack, Text, useMediaQuery, Button, Icon } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";

import { StyledContainerFieldset, StyledPrint } from "./styles";
import { titlesModal } from "./config";

interface IOptionsButton {
  title: string;
  onClick?: () => void;
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
    disabledButton,
    hasTable = false,
    hasOverflow = false,
    isClickable = false,
    selectedState = false,
    hasError = false,
    alignContent,
  } = props;

  const isMobile = useMediaQuery("(max-width:880px)");

  const [isSelected, setIsSelected] = useState(selectedState || false);
  const [infoModal, setInfoModal] = useState(false);

  const handleOnClick = () => {
    if (isClickable) {
      setIsSelected(!isSelected);
      if (onSelectionChange) {
        onSelectionChange();
      }
    }
  };

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
            <StyledPrint>
              <Button
                iconBefore={<MdAdd />}
                spacing="compact"
                disabled={!disabledButton}
                onClick={activeButton.onClick}
              >
                {activeButton.title}
              </Button>
              {!disabledButton && (
                <Icon
                  icon={<MdOutlineInfo />}
                  appearance="primary"
                  size="16px"
                  cursorHover
                  onClick={() => setInfoModal(true)}
                />
              )}
            </StyledPrint>
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
