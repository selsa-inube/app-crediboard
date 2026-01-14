import { useState } from "react";
import { MdAdd, MdOutlineInfo, MdOutlineMoreVert } from "react-icons/md";
import { Stack, Text, useMediaQuery, Button, Icon } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { MenuProspect } from "@components/navigation/MenuProspect";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { useEnum } from "@hooks/useEnum";

import {
  StyledContainerFieldset,
  StyledMenuContainer,
  StyledMenuDropdown,
  StyledPrint,
} from "./styles";
import { titlesModalEnum } from "./config";

interface IOptionsButton {
  title: string;
  titleSistemValidation: string;
  onClick?: () => void;
  onClickSistemValidation?: () => void;
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
    borderColor = "none",
    alignContent,
  } = props;

  const [isSelected, setIsSelected] = useState(selectedState || false);
  const [infoModal, setInfoModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const language = useEnum().lang;
  const isMobile = useMediaQuery("(max-width:880px)");
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
      title: activeButton?.titleSistemValidation || "",
      onClick: () => {
        activeButton?.onClickSistemValidation?.();
        setShowMenu(false);
      },
      visible: true,
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });
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
                  disabled={editCreditApplication}
                >
                  {activeButton.title}
                </Button>
                <Button
                  iconBefore={<MdAdd />}
                  spacing="compact"
                  onClick={activeButton.onClickSistemValidation}
                  variant="outlined"
                  disabled={editCreditApplication}
                >
                  {activeButton.titleSistemValidation}
                </Button>
                <Stack alignItems="center">
                  {editCreditApplication ? (
                    <Icon
                      icon={<MdOutlineInfo />}
                      appearance="primary"
                      size="16px"
                      cursorHover
                      onClick={handleInfo}
                    />
                  ) : (
                    <></>
                  )}
                </Stack>
              </StyledPrint>
            )}
            {isModalOpen ? (
              <InfoModal
                onClose={handleInfoModalClose}
                title={titlesModalEnum.title.i18n[language]}
                subtitle={titlesModalEnum.subTitle.i18n[language]}
                description={titlesModalEnum.description.i18n[language]}
                nextButtonText={titlesModalEnum.textButtonNext.i18n[language]}
                isMobile={isMobile}
              />
            ) : (
              <></>
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
            title={titlesModalEnum.title.i18n[language]}
            nextButton={titlesModalEnum.textButtonNext.i18n[language]}
            handleNext={() => setInfoModal(false)}
            handleClose={() => setInfoModal(false)}
            width={isMobile ? "290px" : "400px"}
          >
            <Stack gap="16px" direction="column">
              <Text weight="bold" size="large">
                {titlesModalEnum.subTitle.i18n[language]}
              </Text>
              <Text weight="normal" size="medium" appearance="gray">
                {titlesModalEnum.description.i18n[language]}
              </Text>
            </Stack>
          </BaseModal>
        </>
      )}
    </Stack>
  );
};
