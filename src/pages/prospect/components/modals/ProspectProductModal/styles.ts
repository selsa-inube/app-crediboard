import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
  showIncrementField?: boolean;
  $width?: string;
}

export const ScrollableContainer = styled.div<IStyledModal>`
  width: ${({ $smallScreen, $width }) =>
    $smallScreen ? $width || "270px" : "auto"};
  padding: 10px;
  display: flex;
  z-index: 1;
  position: relative;
  overflow-y: auto;
  height: 520px;

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
