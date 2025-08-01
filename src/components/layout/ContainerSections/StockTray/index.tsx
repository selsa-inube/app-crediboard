import { useState } from "react";
import { MdOutlineChevronLeft, MdMenu, MdOutlineInfo } from "react-icons/md";
import { Stack, Icon, Button, Text } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { ICrediboardData } from "@context/AppContext/types";
import { useValidateUseCase } from "@hooks/useValidateUseCase";
import { EPayrollAgreement } from "@services/enum/crediboard";

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
  const { navigation, isMobile, actionButtons } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const { disabledButton: canViewAttachments } = useValidateUseCase({
    useCase: EPayrollAgreement.canViewAttachments,
  });
  const { disabledButton: canReject } = useValidateUseCase({
    useCase: EPayrollAgreement.canReject,
  });
  const { disabledButton: canCancel } = useValidateUseCase({
    useCase: EPayrollAgreement.canCancel,
  });
  const { disabledButton: canPrint } = useValidateUseCase({
    useCase: EPayrollAgreement.canPrint,
  });
  const { disabledButton: canAttach } = useValidateUseCase({
    useCase: EPayrollAgreement.canAttach,
  });
  const { disabledButton: canManageGuarantees } = useValidateUseCase({
    useCase: EPayrollAgreement.canManageGuarantees,
  });

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
                  disabled={canReject}
                  onClick={actionButtons?.buttons?.buttonReject?.OnClick}
                >
                  {configButtons.buttons.buttonReject.label}
                </Button>
                {canReject && (
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
                  disabled={canCancel}
                  onClick={actionButtons?.buttons?.buttonCancel.OnClick}
                >
                  {configButtons.buttons.buttonCancel.label}
                </Button>
                {canCancel && (
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
                  disabled={canPrint}
                  onClick={actionButtons?.buttons.buttonPrint.OnClick}
                >
                  {configButtons.buttons.buttonPrint.label}
                </Button>
                {canPrint && (
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
                  disabled={canAttach}
                  onClick={actionButtons?.buttonsOutlined?.buttonAttach.OnClick}
                >
                  {configButtons.buttonsOutlined.buttonAttach.label}
                </Button>
                {canAttach && (
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
                  disabled={canViewAttachments}
                  onClick={
                    actionButtons?.buttonsOutlined.buttonViewAttachments.OnClick
                  }
                >
                  {configButtons.buttonsOutlined.buttonViewAttachments.label}
                </Button>
                {canViewAttachments && (
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
                  disabled={canManageGuarantees}
                  onClick={
                    actionButtons?.buttonsOutlined.buttonWarranty.OnClick
                  }
                >
                  {configButtons.buttonsOutlined.buttonWarranty.label}
                </Button>
                {canManageGuarantees && (
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
