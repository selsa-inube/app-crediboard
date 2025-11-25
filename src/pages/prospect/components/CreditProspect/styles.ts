import styled from "styled-components";

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;

export const StyledPrintCardProspect = styled.div`
  @media print {
    zoom: 1;
      height: auto !important;       
      max-height: none !important;   
      overflow: visible !important;  
      display: block !important; 
      align-items: start !important;
  }
`
export const StyledTextareaNoResize = styled.div`
  textarea {
    resize: none;
  }
`;
