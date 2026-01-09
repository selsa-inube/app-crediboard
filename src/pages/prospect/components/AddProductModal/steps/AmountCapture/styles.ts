import styled from "styled-components";

interface IStyledAmountCapture {
    isMobile: boolean
}

export const StyledAmountCapture = styled.div<IStyledAmountCapture>`
    width: ${({ isMobile }) => !isMobile ? "auto" : "290px"};
`