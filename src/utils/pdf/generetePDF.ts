import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = (
  elementPrint: React.RefObject<HTMLDivElement>,
  customTitle = "",
  titlePDF = "document",
  margins = { top: 40, bottom: 20, left: 20, right: 20 }
) => {
  if (elementPrint.current === null) return;

  return html2canvas(elementPrint.current)
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const contentWidth = pdfWidth - margins.left - margins.right;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      const titleFontSize = 16;
      const titlePosition = margins.top;

      pdf.setFontSize(titleFontSize);
      pdf.text(customTitle, margins.left, titlePosition);

      const imagePosition = titlePosition + 10;
      
      pdf.addImage(
        imgData,
        "PNG",
        margins.left,
        imagePosition,
        contentWidth,
        contentHeight
      );

      pdf.save(`${titlePDF}.pdf`);
    })
    .catch((error) => {
      console.error("Error al generar el PDF:", error);
    });
};
