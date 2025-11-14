import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledContainerFilters {
  theme: typeof inube;
}

interface IHiddenFiltersMenu {
  theme: typeof inube;
  $isMobile: boolean;
}

const StyledContainerFilters = styled.div<IStyledContainerFilters>`
  display: flex;
  width: 100%;
  align-items: center;
  flex-grow: 1;
  gap: 4px;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N20 ?? inube.palette.neutral.N20};
  border-radius: 6px;
  padding: 8px;
  border: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N40 ?? inube.palette.neutral.N40};
  position: relative;
  & > div > div > div > figure {
    cursor: pointer;
  }
`;

const MoreFiltersWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledHiddenFiltersMenu = styled.div<IHiddenFiltersMenu>`
  position: absolute;
  top: calc(100% + 8px);
  right: ${({ $isMobile }) => ($isMobile ? "-75px" : "5px")};
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 ?? inube.palette.neutral.N0};
  border-radius: 8px;
  box-shadow: 0px 2px 6px 1px
    ${({ theme }) => theme?.palette?.neutral?.N50 ?? inube.palette.neutral.N50};
  padding: "8px";
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: "8px";
  min-width: 175px;
`;

const HiddenFilterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
`;

export {
  StyledContainerFilters,
  MoreFiltersWrapper,
  StyledHiddenFiltersMenu,
  HiddenFilterItem,
};
