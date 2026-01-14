import { createPortal } from "react-dom";
import { MdClear } from "react-icons/md";

import {
  Stack,
  Icon,
  Text,
  Divider,
  Button,
  Blanket,
} from "@inubekit/inubekit";

import { validationMessages } from "@validations/validationMessages";
import { useEnum } from "@hooks/useEnum";

import { StyledContainer, StyledContainerClose } from "./styles";
import { dataBaseModalEnum } from "./config";
import { Appearance, Variant } from "./types";

export interface IBaseModalProps {
  title: string | React.ReactNode;
  children: JSX.Element | JSX.Element[];
  handleNext?: () => void;
  handleBack?: () => void;
  handleClose?: () => void;
  width?: string;
  height?: string;
  disabledNext?: boolean;
  disabledBack?: boolean;
  iconBeforeNext?: React.JSX.Element;
  iconAfterNext?: React.JSX.Element;
  iconBeforeback?: React.JSX.Element;
  iconAfterback?: React.JSX.Element;
  apparenceNext?: Appearance;
  variantNext?: Variant;
  nextButton?: string;
  backButton?: string;
  initialDivider?: boolean;
  finalDivider?: boolean;
  portalId?: string;
  $height?: string;
  isSendingData?: boolean
  internalWidth?: string
  marginTop?: string;
  marginBottom?: string;
}

export function BaseModal(props: IBaseModalProps) {
  const {
    handleNext,
    title,
    nextButton,
    children,
    handleBack,
    handleClose,
    width = "",
    height = "",
    disabledNext = false,
    disabledBack = false,
    iconBeforeNext,
    iconAfterNext,
    iconBeforeback,
    iconAfterback,
    apparenceNext = "primary",
    variantNext = "filled",
    backButton = "",
    initialDivider = true,
    finalDivider = false,
    portalId = "portal",
    $height,
    isSendingData,
    internalWidth,
    marginBottom,
    marginTop
  } = props;

  const language = useEnum().lang;

  const node = document.getElementById(portalId ?? "portal");
  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }
  if (node) {
    node.style.position = "relative";
    node.style.zIndex = "3";
  }

  return createPortal(
    <Blanket>
      <StyledContainer
        $height={$height}
        $width={width}
        $margin={
            `${marginTop || 0} 0 ${marginBottom || 0} 0`
          }
      >
        <Stack
          direction="column"
          padding="24px"
          gap="24px"
          width={internalWidth || "auto"}
          height={height}
        >
          <Stack justifyContent="space-between" alignItems="center">
            <Text size="small" type="headline">
              {title}
            </Text>
            <StyledContainerClose onClick={handleClose || handleBack}>
              <Stack alignItems="center" gap="8px">
                <Text type="body" size="large">
                  {dataBaseModalEnum.close.i18n[language]}
                </Text>
                <Icon
                  icon={<MdClear />}
                  size="24px"
                  cursorHover
                  appearance="dark"
                />
              </Stack>
            </StyledContainerClose>
          </Stack>
          {initialDivider && <Divider />}
          <Stack direction="column">{children}</Stack>
          {finalDivider && <Divider />}
          <Stack justifyContent="end" gap="20px">
            {backButton && (
              <Button
                onClick={handleBack || handleClose}
                disabled={disabledBack}
                variant="outlined"
                appearance="gray"
                iconAfter={iconAfterback}
                iconBefore={iconBeforeback}
              >
                {backButton}
              </Button>
            )}
            {nextButton && (
              <Button
                onClick={handleNext}
                disabled={disabledNext}
                iconAfter={iconAfterNext}
                iconBefore={iconBeforeNext}
                appearance={apparenceNext}
                variant={variantNext}
                loading={isSendingData}
              >
                {nextButton}
              </Button>
            )}
          </Stack>
        </Stack>
      </StyledContainer>
    </Blanket>,
    node
  );
}
