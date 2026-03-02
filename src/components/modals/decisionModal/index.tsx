import {
  Button,
  Divider,
  Icon,
  Stack,
  Text,
  useMediaQuery,
  IIconAppearance,
} from "@inubekit/inubekit";
import { ReactNode } from "react";
import { MdCheckCircle, MdArrowBack, MdArrowForward } from "react-icons/md";
import { Fieldset } from "@components/data/Fieldset";

import { EComponentAppearance } from "./types";
import { decisionModalMessages } from "./config";
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
    description,
    loading = false,
    sizeIcon = "60px",
    portalId = "portal",
    title,
    appearance = EComponentAppearance.PRIMARY,
    moreDetails,
    withDate,
    onDateChange,
    statusDate,
    valueDate,
    messageDate,
    subtitle,
    onBlurDate,
    onClick,
    onCloseModal,
  } = props;

  const isMobile = false;

  return (
    <BaseModal
      portalId={portalId}
      width={isMobile ? "335px" : "500px"}
      internalWidth={isMobile ? "335px" : "452px"}
      gap="24px"
      backButton="Cancel"
      nextButton="Cerrar"
      title={title}
      handleBack={onCloseModal}
      handleNext={onClick ?? (() => void 0)}
      isLoading={loading}
      withoutHeader
      initialDivider={false}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap="24px"
      >
        <Icon
          icon={<MdCheckCircle />}
          appearance={EComponentAppearance.SUCCESS}
          size="50px"
        />
        <Text type="title" size="large" weight="bold">
          {"lineInitiatedLabels.title"}
        </Text>
        <Text size="large" appearance={EComponentAppearance.GRAY}>
          {"lineInitiatedLabels.subtitle"}
        </Text>

        <Fieldset

        /*         width="452px"
        height="auto"
        direction="column"
        backgroundColor={EComponentAppearance.LIGHT}
        borderRadius={tokens.spacing.s100}
        borderColor={EComponentAppearance.DARK}
        padding={tokens.spacing.s200}
        gap={tokens.spacing.s150} */
        /* boxSizing="border-box" */
        >
          <Stack direction="column" gap="12px">
            <Text type="label" size="large" weight="bold">
              {"lineInitiatedLabels.titleFirstBox"}
            </Text>
            <Text size="medium" appearance={EComponentAppearance.GRAY}>
              {"lineInitiatedLabels.descriptionFirst"}
            </Text>
            <Stack justifyContent="flex-end">
              <Button
                onClick={() => void 0}
                iconBefore={<MdArrowBack />}
                variant="outlined"
              >
                {"lineInitiatedLabels.goBackButton"}
              </Button>
            </Stack>
          </Stack>
        </Fieldset>
        <Fieldset
        /*         width="452px"
          height="auto"
          direction="column"
          backgroundColor={EComponentAppearance.LIGHT}
          borderRadius={tokens.spacing.s100}
          borderColor={EComponentAppearance.DARK}
          padding={tokens.spacing.s200}
          gap={tokens.spacing.s150}
          boxSizing="border-box" */
        >
          <Stack direction="column" gap="12px">
            <Text type="label" size="large" weight="bold">
              {"lineInitiatedLabels.titleSecondBox"}
            </Text>
            <Text size="medium" appearance={EComponentAppearance.GRAY}>
              {"lineInitiatedLabels.descriptionSecond"}
            </Text>
            <Stack justifyContent="flex-end">
              <Button
                onClick={() => void 0}
                iconBefore={<MdArrowForward />}
                variant="outlined"
              >
                {"lineInitiatedLabels.continueButton"}
              </Button>
            </Stack>
          </Stack>
        </Fieldset>
      </Stack>
    </BaseModal>
  );
};

export { DecisionModal };
