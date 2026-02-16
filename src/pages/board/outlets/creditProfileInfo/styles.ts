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

export const StyledPrint = styled.div`
  @media print {
    @page {
      size: A3 landscape;
    }
    * {
      zoom: 0.95;
    }
  }
`;

export const StyledNoPrint = styled.div`
  @media print {
    display: none;
  }
`;

interface IStyledGrid {
  $isMobile?: boolean;
  $isTablet?: boolean;
}
export const StyledGridPrint = styled.div<IStyledGrid>`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: ${({ $isTablet }) => ($isTablet ? "20px 40px" : "20px")};

  & > div {
    flex: ${({ $isMobile, $isTablet }) => {
      if ($isMobile) return "1 1 100%";
      if ($isTablet) return "1 1 calc(50% - 10px)";
      return "1 1 calc(33.333% - 14px)";
    }};
    min-width: 0;
    max-width: none;
  }
`;

export const StylePrintListMobile = styled.div`
  @media print {
    display: none;
  }
`;

export const StyledPrintListMobileShow = styled.div`
  display: none;

  @media print {
    display: block;
    width: 2000px;
  }
`;

export const StyledLi = styled.li`
  &::marker {
    color: #5e6c84;
    font-size: 14px;
  }
`;
