import styled from "styled-components";
import { SectionOrientation } from "@components/layout/BoardSection/types";
import { inube } from "@inubekit/inubekit";

interface IStyledBoardContainer {
  $orientation: SectionOrientation;
  $isMobile: boolean;
}

interface IStyledInputsContainer {
  $isMobile: boolean;
}

interface IStyledSearch {
  $isMobile: boolean;
  $isExpanded: boolean;
}

const StyledInputsContainer = styled.div<IStyledInputsContainer>`
  display: block;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ $isMobile }) => ($isMobile ? "12px" : "32px")};
  padding-right: ${({ $isMobile }) => ($isMobile ? "16px" : "12px")};
  padding-bottom: 16px;
  padding-left: ${({ $isMobile }) => ($isMobile ? "16px" : "12px")};
  gap: 40px;
  box-shadow: ${({ $isMobile }) => !$isMobile && "0px 6px 3px -5px #00000040"};
`;

const getWidth = ($isMobile: boolean, $isExpanded: boolean) => {
  if ($isMobile) {
    return $isExpanded ? "480px" : "50px";
  }
  return "480px";
};

const StyledSearch = styled.div<IStyledSearch>`
  cursor: pointer;
  width: ${({ $isMobile, $isExpanded }) => getWidth($isMobile, $isExpanded)};

  & > div > div > div {
    padding-left: ${({ $isMobile }) => ($isMobile ? "9px" : "16px")};
  }
`;

const StyledBoardContainer = styled.div<IStyledBoardContainer>`
  display: flex;
  flex-direction: ${({ $orientation }) =>
    $orientation === "horizontal" ? "column" : "row"};
  padding-top: ${({ $isMobile }) => ($isMobile ? "0px" : "32px")};
  padding-right: ${({ $isMobile }) => ($isMobile ? "16px" : "8px")};
  padding-bottom: 16px;
  padding-left: ${({ $isMobile }) => ($isMobile ? "16px" : "8px")};
  overflow: auto;
`;

export const StyledContainerToCenter = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  align-items: center;
`;

export const StyledRequestsContainer = styled.div<IStyledInputsContainer>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 688px;

  ${({ $isMobile, theme }) =>
    !$isMobile &&
    `
      padding: 12px ;
      gap:  16px ;
      border-radius: 8px;
      border: 1px solid ${theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    `}
`;

interface IStyledError {
  $isMobile: boolean;
}

const StyledError = styled.div<IStyledError>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  gap: 4px;
  opacity: ${({ $isMobile }) => ($isMobile ? "1" : "0.8")};
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

export {
  StyledInputsContainer,
  StyledBoardContainer,
  StyledError,
  StyledSearch,
};
