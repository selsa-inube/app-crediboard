import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledContainer = styled.div`
  width: 160px;
  border-radius: 8px;
  padding: 12px 12px;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};
  box-shadow: 0px 1px 3px 1px
    ${({ theme }) =>
      theme?.palette?.neutralAlpha?.N200A || inube.palette.neutralAlpha.N200A};
  box-shadow: 0px 1px 2px 0px
    ${({ theme }) =>
      theme?.palette?.neutralAlpha?.N200A || inube.palette.neutralAlpha.N200A};
  ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  border: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
`;
