import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledHorizontalDivider = styled.hr`
  margin: 0px;
  width: 2px;
  border: none;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N200 || inube.palette.neutral.N200};
`;

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;
