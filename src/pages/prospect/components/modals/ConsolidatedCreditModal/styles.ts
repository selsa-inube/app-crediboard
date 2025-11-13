import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

export const ScrollableContainer = styled.div`
  height: 80%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 8px;
    background: ${({ theme }) =>
      theme?.palette?.neutral?.N100 || "rgba(235, 236, 240, 1)"};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
    border-radius: 8px;
  }
`;
