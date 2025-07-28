import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
}
interface IStyledAttachContainer {
  $isDragging?: boolean;
  theme?: typeof inube;
}
interface IFileBox {
  $isScrollable?: boolean;
}
export const StyledModal = styled.div<IStyledModal>`
  display: flex;
  flex-direction: column;
  width: ${({ $smallScreen }) => ($smallScreen ? "290px" : "510px")};
  background-color: ${({ theme }) =>
    theme.palette?.neutral?.N0 || inube.palette.neutral.N0};
  padding: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  gap: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  border-radius: 8px;
`;

export const StyledFileBox = styled.div<IFileBox>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
  overflow: auto;
`;

export const StyledAttachContainer = styled.div<IStyledAttachContainer>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 188px;
  gap: 16px;
  border-radius: 8px;
  border: 2px dashed
    ${({ theme, $isDragging }) =>
      $isDragging
        ? theme?.palette?.blue?.B300 || inube.palette.blue.B300
        : theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  background-color: ${({ theme, $isDragging }) =>
    $isDragging
      ? theme?.palette?.blue?.B50 || inube.palette.blue.B50
      : theme?.palette?.neutral.N0 || theme?.palette?.neutral.N0};
  transition: border 0.3s ease;
`;
export const StyledContainerContent = styled.div<IStyledModal>`
  display: flex;
  flex-direction: column;
  padding-top: 4px;
  padding-right: 4px;
  padding-bottom: 4px;
  padding-left: 4px;
  max-height: 300px;
  overflow-y: auto;

  ${({ theme }) =>
    `
      &::-webkit-scrollbar {
        width: 8px; 
        border-radius: 8px;
      }
  
      &::-webkit-scrollbar-thumb {
        background-color: ${
          theme?.palette?.neutral?.N30 || inube.palette.neutral.N30
        };
        border-radius: 8px;
      }
    `}
`;

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;
