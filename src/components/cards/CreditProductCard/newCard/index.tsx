import { MdOutlineAdd } from "react-icons/md";
import { Stack, Icon, Text, useMediaQuery } from "@inubekit/inubekit";
import { useState } from "react";

import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { privilegeCrediboard } from "@config/privilege";

import { dataNewCardEnum } from "./config";
import { StyledCreditProductCard, StyledPrint } from "../styles";

interface INewCreditProductCardProps {
  onClick: () => void;
  language: "en" | "es";
}
export function NewCreditProductCard(props: INewCreditProductCardProps) {
  const { onClick, language = "es"} = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const isMobile = useMediaQuery("(max-width:880px)");
  return (
    <StyledPrint>
    <Stack gap="6px">
      <StyledCreditProductCard
        onClick={editCreditApplication ? handleInfo : onClick}
        $new={true}
      >
        <Stack direction="column" alignItems="center" margin="auto">
          <Icon icon={<MdOutlineAdd />} appearance="gray" size="45px" />
          <Text type="body" size="large" appearance="gray">
            {dataNewCardEnum.add.i18n[language]}
          </Text>
        </Stack>
      </StyledCreditProductCard>
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
    </StyledPrint>
  );
}
