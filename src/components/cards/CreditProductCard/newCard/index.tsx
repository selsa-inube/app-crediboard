import { MdOutlineAdd, MdOutlineInfo } from "react-icons/md";
import { useState } from "react";
import { Stack, Icon, Text, useMediaQuery } from "@inubekit/inubekit";

import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { privilegeCrediboard } from "@config/privilege";

import { dataNewCard } from "./config";
import { StyledCreditProductCard } from "../styles";

interface INewCreditProductCardProps {
  onClick: () => void;
}

export function NewCreditProductCard(props: INewCreditProductCardProps) {
  const { onClick } = props;
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:880px)");
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <Stack gap="6px">
      <StyledCreditProductCard
        onClick={onClick}
        $new={true}
        $disabled={editCreditApplication}
      >
        <Stack direction="column" alignItems="center" margin="auto">
          <Icon icon={<MdOutlineAdd />} appearance="gray" size="45px" />
          <Text type="body" size="large" appearance="gray">
            {dataNewCard.add}
          </Text>
        </Stack>
      </StyledCreditProductCard>
      <Stack alignItems="end">
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
}
