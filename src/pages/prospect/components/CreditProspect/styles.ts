import styled from "styled-components";

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;
export const StyledTextareaNoResize = styled.div`
  textarea {
    resize: none;
  }
`;
