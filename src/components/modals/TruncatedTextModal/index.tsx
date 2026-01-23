import { useState } from "react";
import { Text, useMediaQuery } from "@inubekit/inubekit";

import { useEnum } from "@hooks/useEnum";

import { BaseModal } from "../baseModal";
import { StyledContainer } from "./styles";
import { dataTruncatedTextEnum } from "./config";
import { TextAppearance, TextSize, TextType, TextWeight } from "./types";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  appearance?: TextAppearance;
  type?: TextType;
  size?: TextSize;
  weight?: TextWeight;
  transformFn?: (transform: string) => string;
}

export const TruncatedText = ({
  text = "",
  maxLength = 50,
  appearance,
  type,
  size,
  weight,
  transformFn,
}: TruncatedTextProps) => {
  const { lang } = useEnum();

  const [showModal, setShowModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 700px)");

  const isTruncated = text.length > maxLength;

  const displayText = transformFn ? transformFn(text) : text;

  const finalContent = isTruncated
    ? displayText.slice(0, maxLength) + "..."
    : displayText;

  const handleOpen = (event: React.MouseEvent) => {
    if (isTruncated) {
      event.stopPropagation();
      setShowModal(true);
    }
  };

  const handleClose = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setShowModal(false);
  };

  return (
    <StyledContainer onClick={handleOpen} $isTruncated={isTruncated}>
      <Text appearance={appearance} type={type} size={size} weight={weight}>
        {finalContent}
      </Text>

      {showModal && (
        <BaseModal
          title={dataTruncatedTextEnum.info.i18n[lang]}
          nextButton="Cerrar"
          handleNext={handleClose}
          handleClose={handleClose}
          width={isMobile ? "290px" : "450px"}
        >
          <Text type="title" size="medium">
            {displayText}
          </Text>
        </BaseModal>
      )}
    </StyledContainer>
  );
};