import styled from "styled-components";
import { DefaultTheme } from "styled-components";
import { inube } from "@inubekit/inubekit";


interface IStyledDivider {
  theme?: DefaultTheme;
}

interface IStyledUl {
  $isTablet?: boolean;
}
export const StyledDivider = styled.hr<IStyledDivider>`
  margin: 0;
  width: 100%;
  border: none;
  border-top: 2px solid;
  border-top-color: ${({ theme }) =>
    theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
`;

export const StyledContainerToCenter = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1520px;
  margin: auto;
  margin-top: 0px;
  width: 100%;
`;

export const StyledUl = styled.ul<IStyledUl>`
  display: flex;
  justify-content: space-between;
  width: ${({ $isTablet }) => ($isTablet ? "auto" : "35%")};
  padding: 0;
  margin: 0;
  flex-direction: ${({ $isTablet }) => ($isTablet ? "column" : "row")};
  align-items: center;
  gap: 4px;
`;

export const StyledLi = styled.li`
  &::marker {
    color: #5e6c84;
    font-size: 14px;
  }
`;
