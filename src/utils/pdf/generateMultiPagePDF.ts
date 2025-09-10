import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateMultiPagePDF = (
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const originalElement = containerRef.current;
  if (!originalElement) {
    return Promise.resolve();
  };

  const clonedElement = originalElement.cloneNode(true) as HTMLElement;

  const printContainer = document.createElement("div");
  
  printContainer.style.position = 'absolute';
  printContainer.style.left = '-9999px';
  printContainer.style.top = '0px';

  clonedElement.classList.add('force-desktop-layout');
  
  printContainer.appendChild(clonedElement);
  document.body.appendChild(printContainer);

  const IMAGE_QUALITY = 1;
  let pdfPromise;

  try {
    pdfPromise = html2canvas(clonedElement, {
      scale: 2,
      backgroundColor: '#ffffff',
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', IMAGE_QUALITY);
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = { left: 20, right: 20, top: 20, bottom: 20 };
      const contentWidth = pdfWidth - margin.left - margin.right;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin.left, margin.top, contentWidth, contentHeight);
      
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
    });

  } finally {
    const cleanup = () => document.body.removeChild(printContainer);
    
    if (pdfPromise) {
      pdfPromise.finally(cleanup);
    } else {
      cleanup();
    }
  }
  
  return pdfPromise || Promise.resolve();
};