import styled from "styled-components";

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;

export const StyledPrintCardProspect = styled.div`
  @media print {
    zoom: 1;
      height: auto;       
      max-height: none;   
      overflow: visible;  
      display: block; 
      align-items: start;
  }
`
export const StyledTextareaNoResize = styled.div`
  textarea {
    resize: none;
  }
`;
