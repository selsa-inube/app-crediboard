import { MdOutlineAdd } from "react-icons/md";
import { useState } from "react";
import { Stack, Icon, Text, useMediaQuery } from "@inubekit/inubekit";

import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { EnumType } from "@hooks/useEnum";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { privilegeCrediboard } from "@pages/board/outlets/financialReporting/CommercialManagement/config/config";

import { dataNewCard } from "./config";
import { StyledCreditProductCard } from "../styles";

interface INewCreditProductCardProps {
  lang: EnumType;
  onClick: () => void;
}

export function NewCreditProductCard(props: INewCreditProductCardProps) {
  const { lang, onClick } = props;
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
        onClick={() => (editCreditApplication ? handleInfo() : onClick())}
        $new={true}
        $showIcons={true}
      >
        <Stack direction="column" alignItems="center" margin="auto">
          <Icon icon={<MdOutlineAdd />} appearance="gray" size="45px" />
          <Text type="body" size="large" appearance="gray">
            {dataNewCard.add.i18n[lang]}
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
  );
}
