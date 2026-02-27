import {
  Date,
  Divider,
  Icon,
  Stack,
  Text,
  useMediaQuery,
  IIconAppearance,
} from "@inubekit/inubekit";
import { ReactNode } from "react";

import { EComponentAppearance } from "./types";

import { BaseModal } from "../baseModal";

interface IDecisionModal {
  actionText: string;
  portalId: string;
  description: string | ReactNode;
  title: string;
  onCloseModal: () => void;
  onClick?: () => void;
  subtitle?: string;
  withCancelButton?: boolean;
  moreDetails?: string;
  sizeIcon?: string;
  appearanceButton?: EComponentAppearance;
  icon?: React.JSX.Element;
  isDisabledButton?: boolean;
  withDate?: boolean;
  statusDate?: "pending" | "invalid" | undefined;
  loading?: boolean;
  withIcon?: boolean;
  appearance?: IIconAppearance;
  valueDate?: string;
  messageDate?: string;
  changeZIndex?: boolean;
  valueZIndex?: number;
  onBlurDate?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const DecisionModal = (props: IDecisionModal) => {
  const {
    actionText,
    icon = <></>,
    withIcon = false,
    description,
    loading = false,
    sizeIcon = "60px",
    portalId = "portal",
    title,
    appearance = EComponentAppearance.PRIMARY,
    appearanceButton = EComponentAppearance.PRIMARY,
    withCancelButton = true,
    moreDetails,
    withDate,
    onDateChange,
    statusDate,
    valueDate,
    messageDate,
    isDisabledButton = false,
    changeZIndex,
    subtitle,
    valueZIndex,
    onBlurDate,
    onClick,
    onCloseModal,
  } = props;

  const isMobile = useMediaQuery("");

  return (
    <BaseModal
      portalId={portalId}
      width={isMobile ? "335px" : "450px"}
      isMobile={isMobile}
      labelActionButton={actionText}
      labelCloseButton="Cancelar"
      labelCloseModal="Cerrar"
      title={title}
      withCancelButton={withCancelButton}
      onCloseModal={onCloseModal}
      onClick={onClick ?? (() => void 0)}
      loading={loading}
      disabledActionButton={isDisabledButton}
      appearanceButton={appearanceButton}
      changeZIndex={changeZIndex}
      valueZIndex={valueZIndex}
    >
      <>
        {withIcon && (
          <Stack width="100%" alignItems="center" justifyContent="center">
            <Icon icon={icon} appearance={appearance} size={sizeIcon} />
          </Stack>
        )}
        {subtitle && (
          <Text appearance={EComponentAppearance.DARK} size="large">
            {subtitle}
          </Text>
        )}

        <Text
          appearance={
            moreDetails ? EComponentAppearance.GRAY : EComponentAppearance.DARK
          }
          type="body"
          size="medium"
        >
          {description}
        </Text>

        {withDate && (
          <Date
            id="date"
            name="date"
            onChange={onDateChange}
            status={statusDate}
            value={valueDate}
            size="compact"
            message={messageDate}
            fullwidth
            onBlur={onBlurDate}
          />
        )}

        {moreDetails && (
          <Stack direction="column" gap={"20px"}>
            <Divider dashed />
            <Text size="medium" appearance={EComponentAppearance.DARK}>
              {moreDetails}
            </Text>
          </Stack>
        )}
      </>
    </BaseModal>
  );
};

export { DecisionModal };
