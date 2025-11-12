import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledContainer {
  $height?: string;
}

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;

export const StyledContainer = styled.div<IStyledContainer>`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  border-radius: 8px;
  height: ${({ $height }) => $height || "auto"};
`;
