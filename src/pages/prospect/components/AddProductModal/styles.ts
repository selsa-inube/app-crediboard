import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
  $width?: string;
  $height?: string;
}

export const ScrollableContainer = styled.div<IStyledModal>`
  width: ${({ $width }) => ($width ? $width : "auto")};
  min-height: ${({ $height }) => ($height ? $height : "auto")};
  max-height: ${({ $height }) => ($height ? $height : "auto")};
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  position: relative;

  & > * {
    position: relative;
    z-index: 1;
  }

  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
    border-radius: 8px;
  }
`;

export const ModalContentWrapper = styled.div`
  min-height: calc(100vh - 290px);
  overflow: visible;
  display: flex;
  flex-direction: column;
`;