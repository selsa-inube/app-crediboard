import styled from "styled-components";
import { Link } from "react-router-dom";
import { inube } from "@inubekit/inubekit";

interface IStyledContainer {
  $canUnpin?: boolean;
  $isPinned?: boolean;
}

export const StyledLink = styled(Link)`
  display: flex;
  text-decoration: none;
  flex-direction: column;
  padding: 8px;
  justify-content: space-between;
  height: 100%;
`;

export const StyledSummaryCard = styled.div`
  break-after: avoid;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 260px;
  height: 270px;
  border-radius: 8px;
  outline: 1px solid
    ${({ theme }) =>
      theme?.palette?.neutral?.N200 || inube.palette.neutral.N200};
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
`;

export const StyledDivider = styled.hr`
  margin: 0;
  width: 100%;
  border: none;
  border-top: 2px solid;
  border-top-color: ${({ theme }) =>
    theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
`;

export const StyledPinWrapper = styled.div<IStyledContainer>`
  opacity: ${(props) => (!props.$canUnpin && props.$isPinned ? 0.5 : 1)};
  cursor: ${(props) =>
    !props.$canUnpin && props.$isPinned ? "not-allowed" : "pointer"};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
