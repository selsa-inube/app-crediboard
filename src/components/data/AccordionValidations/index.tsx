import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Text, Icon, Divider } from "@inubekit/inubekit";

import { StyledContainer, StyledHead } from "./styles";
export interface IAccordionValidationsProps {
  title: string;
  isMobile: boolean;
  defaultOpen?: boolean;
  children?: JSX.Element | null;
  dashed?: boolean;
}
export const AccordionValidations = (props: IAccordionValidationsProps) => {
  const { title, defaultOpen = true, children, dashed, isMobile } = props;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <StyledContainer>
      <StyledHead onClick={handleToggleOpen}>
        <Text
          type="label"
          size={isMobile ? "medium" : "large"}
          appearance="dark"
          weight="bold"
        >
          {title}
        </Text>

        <Icon
          icon={isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          appearance="dark"
          spacing="compact"
          cursorHover={true}
          size="24px"
        />
      </StyledHead>

      {isOpen && (
        <>
          <Divider dashed={dashed} />
          {children}
        </>
      )}
    </StyledContainer>
  );
};
