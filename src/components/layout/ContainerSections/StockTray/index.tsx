import { useState } from "react";
import { MdOutlineChevronLeft, MdMenu, MdOutlineInfo } from "react-icons/md";
import { Stack, Icon, Button } from "@inubekit/inubekit";

import { ICrediboardData } from "@context/AppContext/types";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { privilegeCrediboard } from "@config/privilege";

import { configButtonsEnum } from "../config";
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
  lang: "es" | "en";
  eventData?: ICrediboardData;
  isMobile?: boolean;
  actionButtons?: IActionButtons;
}

export const StockTray = (props: IStockTrayProps) => {
  const { navigation, isMobile, actionButtons, lang } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  const { disabledButton: canReject } = useValidateUseCase({
    useCase: getUseCaseValue("canReject"),
  });
  const { disabledButton: canCancel } = useValidateUseCase({
    useCase: getUseCaseValue("canCancel"),
  });

  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
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
        <StyledPrint>
          <Icon
            icon={<MdMenu />}
            appearance="dark"
            size="32px"
            spacing="narrow"
            onClick={actionButtons?.menuIcon}
          />
        </StyledPrint>
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
                  {configButtonsEnum.buttons.buttonReject.label.i18n[lang]}
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
                  {configButtonsEnum.buttons.buttonCancel.label.i18n[lang]}
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
                  onClick={actionButtons?.buttons.buttonPrint.OnClick}
                >
                  {configButtonsEnum.buttons.buttonPrint.label.i18n[lang]}
                </Button>
              </Stack>
            </Stack>
            <StyledHorizontalDivider />
            <Stack gap="16px">
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  variant="outlined"
                  disabled={editCreditApplication}
                  onClick={actionButtons?.buttonsOutlined?.buttonAttach.OnClick}
                >
                  {
                    configButtonsEnum.buttonsOutlined.buttonAttach.label.i18n[
                      lang
                    ]
                  }
                </Button>
                {editCreditApplication && (
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
                  onClick={
                    actionButtons?.buttonsOutlined.buttonViewAttachments.OnClick
                  }
                >
                  {
                    configButtonsEnum.buttonsOutlined.buttonViewAttachments
                      .label.i18n[lang]
                  }
                </Button>
              </Stack>
              <StyledHorizontalDivider />
              <Stack gap="2px" alignItems="center">
                <Button
                  spacing="compact"
                  variant="outlined"
                  onClick={
                    actionButtons?.buttonsOutlined.buttonWarranty.OnClick
                  }
                >
                  {
                    configButtonsEnum.buttonsOutlined.buttonWarranty.label.i18n[
                      lang
                    ]
                  }
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </StyledPrint>
      )}
      {isModalOpen && (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrediboard.title}
          subtitle={privilegeCrediboard.subtitle}
          description={privilegeCrediboard.description}
          nextButtonText={privilegeCrediboard.nextButtonText}
          isMobile={isMobile}
        />
      )}
    </Stack>
  );
};
