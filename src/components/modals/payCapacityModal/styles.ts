import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

export const StyledTable = styled.div`
  max-height: 270px;
  overflow-y: auto;
  overflow-x: hidden;

  th,
  td {
    word-break: break-word;
    text-align: center;
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
