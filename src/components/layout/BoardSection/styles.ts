import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { SectionBackground, SectionOrientation } from "./types";
interface IStyledBoardSection {
  $sectionBackground?: SectionBackground;
  $orientation?: SectionOrientation;
  $isTablet: boolean;
}
interface IStyledCollapseIcon {
  $collapse: boolean;
  $disabledCollapse: boolean;
}

export const StyledFilterIcon = styled.div<{ $disabled: boolean }>`
  display: inline-flex;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;
export const StyledBoardSection = styled.div<IStyledBoardSection>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 12px 12px;
  width: calc(100% - 24px);
  border-top: 1px solid;
  border-bottom: ${({ $orientation }) =>
    $orientation !== "horizontal" ? "1px solid" : "none"};
  border-color: ${({ theme }) =>
    theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
  background-color: ${({ theme, $sectionBackground }) =>
    $sectionBackground === "gray"
      ? theme?.palette?.neutral?.N30 || inube.palette.neutral.N30
      : theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};

  & > div:nth-child(1) {
    justify-content: space-between;
    margin-right: ${({ $isTablet }) => ($isTablet ? "20px" : "0px")};
  }
`;

export const StyledCollapseIcon = styled.div<IStyledCollapseIcon>`
  display: flex;
  transition: all 500ms ease;
  transform: ${({ $collapse }) =>
    $collapse ? "rotate(90deg)" : "rotate(0deg)"};
  cursor: ${({ $disabledCollapse }) =>
    $disabledCollapse ? "not-allowed" : "pointer"};
`;
