import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportEnvelopeToPdf(
  elementId: string,
  filename: string = 'amplop-raport.pdf',
  widthMm: number = 297,
  heightMm: number = 210
) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element amplop tidak ditemukan');
  }

  // Clone or capture element at 300 DPI equivalent scale (scale: 3)
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  const orientation = widthMm >= heightMm ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation: orientation as 'landscape' | 'portrait',
    unit: 'mm',
    format: [widthMm, heightMm],
    compress: true,
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm, undefined, 'FAST');
  pdf.save(filename);
}

export async function exportEnvelopeToImage(
  elementId: string,
  filename: string = 'amplop-raport.png'
) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element amplop tidak ditemukan');
  }

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
