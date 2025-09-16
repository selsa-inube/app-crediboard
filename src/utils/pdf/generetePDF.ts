import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (
  elementPrint: React.RefObject<HTMLDivElement>,
  titlePDF = "documento",
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>,
  getAsBlob = true
): Promise<Blob | void> => {
  const originalElement = elementPrint.current;

  if (!originalElement) {
    setShowErrorModal(true);
    return;
  }

  const offscreenContainer = document.createElement("div");
  offscreenContainer.style.position = "absolute";
  offscreenContainer.style.left = "-9999px";
  offscreenContainer.style.width = "1200px";

  const clonedElement = originalElement.cloneNode(true) as HTMLElement;
  offscreenContainer.appendChild(clonedElement);
  document.body.appendChild(offscreenContainer);

  try {
    const blocks = offscreenContainer.querySelectorAll<HTMLElement>(".pdf-block");

    if (blocks.length === 0) {
      setShowErrorModal(true);
      return;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pdfWidth - margin * 2;
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const canvas = await html2canvas(block, { 
        scale: 0.8,
        useCORS: false,
        logging: false 
      });
      const imgData = canvas.toDataURL("image/jpeg", 1);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        "JPEG",
        margin,
        margin,
        contentWidth,
        contentHeight
      );
    }
    
    if (getAsBlob) {
      return pdf.output("blob");
    } else {
      pdf.save(`${titlePDF}.pdf`);
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    setShowErrorModal(true);
    return Promise.reject(error);
  } finally {
    document.body.removeChild(offscreenContainer);
  }
};