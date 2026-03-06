import { Button, Icon, Stack, Text, useMediaQuery } from "@inubekit/inubekit";
import { MdCheckCircle, MdArrowBack, MdArrowForward } from "react-icons/md";
import { Fieldset } from "@components/data/Fieldset";
import { EnumType } from "@hooks/useEnum";
import { useNavigate } from "react-router-dom";

import { EComponentAppearance } from "./types";
import { decisionModalMessages } from "./config";
import { BaseModal } from "../baseModal";

interface IDecisionModal {
  lang: EnumType;
  creditRequestCode: string;
  onCloseModal: () => void;
  refresh: () => void;
  onClick?: () => void;
  subtitle?: string;
  loading?: boolean;
}
const DecisionModalRedirect = (props: IDecisionModal) => {
  const {
    loading = false,
    onClick,
    onCloseModal,
    creditRequestCode,
    lang = "es",
    refresh,
  } = props;

  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width: 880px)");

  return (
    <BaseModal
      width={isMobile ? "335px" : "500px"}
      internalWidth={isMobile ? "335px" : "452px"}
      gap="24px"
      backButton=""
      nextButton=""
      title=""
      handleBack={onCloseModal}
      handleNext={onClick ?? (() => void 0)}
      isLoading={loading}
      withoutHeader
      initialDivider={false}
      hiddenBottom={true}
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
          {decisionModalMessages.decisionSuccess.title.i18n[lang]}
        </Text>
        <Text size="large" appearance={EComponentAppearance.GRAY}>
          {decisionModalMessages.decisionSuccess.description.i18n[lang].replace(
            "{{creditRequestCode}}",
            creditRequestCode,
          )}
        </Text>

        <Fieldset>
          <Stack direction="column" gap="12px">
            <Text type="label" size="large" weight="bold">
              {decisionModalMessages.returnOption.titleCard.i18n[lang]}
            </Text>
            <Text size="medium" appearance={EComponentAppearance.GRAY}>
              {decisionModalMessages.returnOption.descriptionCard.i18n[
                lang
              ].replace("{{creditRequestCode}}", creditRequestCode)}
            </Text>
            <Stack justifyContent="flex-end">
              <Button
                onClick={() => navigate("/")}
                iconBefore={<MdArrowBack />}
                variant="outlined"
              >
                {decisionModalMessages.returnOption.button.i18n[lang]}
              </Button>
            </Stack>
          </Stack>
        </Fieldset>

        <Fieldset>
          <Stack direction="column" gap="12px">
            <Text type="label" size="large" weight="bold">
              {decisionModalMessages.continueOption.titleCard.i18n[lang]}
            </Text>
            <Text size="medium" appearance={EComponentAppearance.GRAY}>
              {decisionModalMessages.continueOption.descriptionCard.i18n[
                lang
              ].replace("{{creditRequestCode}}", creditRequestCode)}
            </Text>
            <Stack justifyContent="flex-end">
              <Button
                onClick={() => refresh()}
                iconBefore={<MdArrowForward />}
                variant="outlined"
              >
                {decisionModalMessages.continueOption.button.i18n[lang]}
              </Button>
            </Stack>
          </Stack>
        </Fieldset>
      </Stack>
    </BaseModal>
  );
};

export { DecisionModalRedirect };
