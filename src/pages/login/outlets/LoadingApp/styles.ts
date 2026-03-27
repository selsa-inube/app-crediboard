import { inube } from "@inubekit/inubekit";
import { styled } from "styled-components";
import bgImage from "@assets/images/background-unsplash.png";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: -8px;
  padding: 0;
  max-width: 1440px;
  width: 1440px;
  align-items: center;
  height: 100vh;
  box-sizing: border-box;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme?.palette?.neutral?.N100 || inube.palette.neutral.N100};
  box-shadow:
    0px 1px 3px 1px
      ${({ theme }) =>
        theme?.palette?.neutral?.N100 || inube.palette.neutral.N100},
    0px 1px 2px 0px
      ${({ theme }) =>
        theme?.palette?.neutral?.N20 || inube.palette.neutral.N20};
`;
export const StyledHeader = styled.div`
  width: 100%;
`;

export const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  position: relative;
  gap: 16px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${bgImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.3;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;
export const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 48px;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};

  & > a {
    height: 40px;
    justify-content: end;
    padding-right: 16px;
  }

  & > a > img {
    max-height: 32px;
  }
`;
