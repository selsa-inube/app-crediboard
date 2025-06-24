import { useState } from "react";
import { MdOutlineChevronLeft, MdMenu, MdOutlineInfo } from "react-icons/md";
import { Stack, Icon, Button, Text } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { ICrediboardData } from "@context/AppContext/types";

import { configButtons, titlesModal } from "../config";
import { StyledHorizontalDivider, StyledPrint } from "./styled";

interface IActionButtons {
  buttons: {
    buttonReject: {
      OnClick: () => void;
    };
    buttonCancel: {
      OnClick: () => void;
    };
    buttonPrint: {
      OnClick: () => void;
    };
  };
  buttonsOutlined: {
    buttonAttach: {
      OnClick: () => void;
    };
    buttonViewAttachments: {
      OnClick: () => void;
    };
    buttonWarranty: {
      OnClick: () => void;
    };
  };
  menuIcon: () => void;
}

interface IStockTrayProps {
  navigation: () => void;
  eventData?: ICrediboardData;
  isMobile?: boolean;
  actionButtons?: IActionButtons;
}

export const StockTray = (props: IStockTrayProps) => {
  const { navigation, eventData, isMobile, actionButtons } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInfo = () => {
    setIsModalOpen(true);
  };

  return (
    <Stack
      justifyContent="space-between"
      alignItems="start"
      margin={isMobile ? "0px 0px 16px" : "0px 0px 16px"}
    >
      <StyledPrint>
        <Button
          spacing="compact"
          variant="outlined"
          iconBefore={<MdOutlineChevronLeft />}
          onClick={navigation}
        >
          Volver
        </Button>
      </StyledPrint>
      {isMobile && (
        <Icon
          icon={<MdMenu />}
          appearance="dark"
          size="32px"
          spacing="narrow"
          onClick={actionButtons?.menuIcon}
        />
      )}

      {!isMobile && (
        <StyledPrint>
          <Stack
            justifyContent="end"
            gap="16px"
            margin={!isMobile ? "0px 0px 16px 0px" : "0px"}
          >
            <Stack gap="16px">
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  disabled={
                    eventData?.user.staff.useCases.canReject ? false : true
                  }
                  onClick={actionButtons?.buttons?.buttonReject?.OnClick}
                >
                  {configButtons.buttons.buttonReject.label}
                </Button>
                {!eventData?.user.staff.useCases.canReject && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                )}
              </Stack>
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  disabled={
                    eventData?.user.staff.useCases.canCancel ? false : true
                  }
                  onClick={actionButtons?.buttons?.buttonCancel.OnClick}
                >
                  {configButtons.buttons.buttonCancel.label}
                </Button>
                {!eventData?.user.staff.useCases.canCancel && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                )}
              </Stack>
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  disabled={
                    eventData?.user.staff.useCases.canPrint ? false : true
                  }
                  onClick={actionButtons?.buttons.buttonPrint.OnClick}
                >
                  {configButtons.buttons.buttonPrint.label}
                </Button>
                {!eventData?.user.staff.useCases.canPrint && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                )}
              </Stack>
            </Stack>
            <StyledHorizontalDivider />
            <Stack gap="16px">
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  variant="outlined"
                  disabled={
                    eventData?.user.staff.useCases.canAttach ? false : true
                  }
                  onClick={actionButtons?.buttonsOutlined?.buttonAttach.OnClick}
                >
                  {configButtons.buttonsOutlined.buttonAttach.label}
                </Button>
                {!eventData?.user.staff.useCases.canAttach && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                )}
              </Stack>
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  variant="outlined"
                  disabled={
                    eventData?.user.staff.useCases.canViewAttachments
                      ? false
                      : true
                  }
                  onClick={
                    actionButtons?.buttonsOutlined.buttonViewAttachments.OnClick
                  }
                >
                  {configButtons.buttonsOutlined.buttonViewAttachments.label}
                </Button>
                {!eventData?.user.staff.useCases.canViewAttachments && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                )}
              </Stack>
              <StyledHorizontalDivider />
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  variant="outlined"
                  disabled={
                    eventData?.user.staff.useCases.canManageGuarantees
                      ? false
                      : true
                  }
                  onClick={
                    actionButtons?.buttonsOutlined.buttonWarranty.OnClick
                  }
                >
                  {configButtons.buttonsOutlined.buttonWarranty.label}
                </Button>
                {!eventData?.user.staff.useCases.canManageGuarantees && (
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="16px"
                    cursorHover
                    onClick={handleInfo}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        </StyledPrint>
      )}
      {isModalOpen && (
        <>
          <BaseModal
            title={titlesModal.title}
            nextButton={titlesModal.textButtonNext}
            handleNext={() => setIsModalOpen(false)}
            handleClose={() => setIsModalOpen(false)}
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
