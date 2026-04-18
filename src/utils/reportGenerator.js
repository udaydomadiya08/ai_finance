import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const generatePDFReport = async (elementId, companyName) => {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element, {
    backgroundColor: "#0a0c10",
    scale: 2,
  });
  
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save(`AlphaVision_Report_${companyName.replace(/\s+/g, '_')}.pdf`);
};
