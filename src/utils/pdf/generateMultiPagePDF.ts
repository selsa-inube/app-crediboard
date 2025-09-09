import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateMultiPagePDF = (
  containerRef: React.RefObject<HTMLDivElement>,
  titlePDF = "document"
) => {
  const elementToPrint = containerRef.current;
  if (!elementToPrint) {
    return Promise.resolve();
  };

  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margin = { top: 40, bottom: 40, left: 20, right: 20 };
  const contentWidth = pdfWidth - margin.left - margin.right;
  let currentY = margin.top; 

  const IMAGE_QUALITY = 0.75;

  const headerElement = elementToPrint.querySelector<HTMLElement>(".pdf-header");
  const cardElements = Array.from(elementToPrint.querySelectorAll<HTMLElement>(".pdf-card"));

  const headerPromise = headerElement
    ? html2canvas(headerElement, { scale: 2 })
    : Promise.resolve(null);

  return headerPromise
    .then((canvas) => {
      if (canvas) {
        const imgData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
        const imgHeight = (canvas.height * contentWidth) / canvas.width;
        pdf.addImage(imgData, "JPEG", margin.left, currentY, contentWidth, imgHeight);
        currentY += imgHeight + 20;
      }

      return cardElements.reduce((promiseChain, card) => {
        return promiseChain.then(() => {
          return html2canvas(card, { scale: 3 }).then((cardCanvas) => {
            const imgData = cardCanvas.toDataURL("image/jpeg", IMAGE_QUALITY);
            const cardHeight = (cardCanvas.height * contentWidth) / cardCanvas.width;

            if (currentY + cardHeight > pdfHeight - margin.bottom) {
              pdf.addPage();
              currentY = margin.top;
            }

            pdf.addImage(imgData, "JPEG", margin.left, currentY, contentWidth, cardHeight);
            currentY += cardHeight + 15;
          });
        });
      }, Promise.resolve());
    })
    .then(() => {
      pdf.save(`${titlePDF}.pdf`);
    })
    .catch((error) => {
      console.error("Error durante la generación del PDF:", error);
      throw error;
    });
};