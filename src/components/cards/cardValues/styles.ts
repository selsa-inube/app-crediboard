import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledCollapseIcon {
  $showIcon: boolean;
}

export const Container = styled.div<IStyledCollapseIcon>`
  align-items: center;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  border: 1px solid
    ${({ theme }) =>
      theme?.palette?.neutral?.N200 || inube.palette.neutral.N200};
  border-radius: 8px;
  display: flex;
  padding: 4px;
  width: ${({ $showIcon }) => ($showIcon ? "auto" : "100%")};
`;
export const IconWrapper = styled.div`
  align-items: center;
  border-left: 1px solid
    ${({ theme }) =>
      theme?.palette?.neutral?.N200 || inube.palette.neutral.N200};
  display: flex;
  padding: 0px 8px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-around;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
`;

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;
