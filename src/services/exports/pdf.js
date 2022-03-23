// Imports
import jsPdf from 'jspdf';
import 'jspdf-autotable';

/**
 * Export table to pdf
 *
 * @param {Object} data
 */
export default function pdfExport(data, to = "export") {
  /**
   * Data format
   * {
   *  title: String
   *  documentHeader: Object<{ image: String, name: String, date: String, aggregates: Object }>
   *  headers: Array<String>
   *  body: Array<Array<String>>
   * }
   */
  const time = (new Date()).getTime() / 1000;
  getDataUri(data, to || `${time}`);
}

/**
 * Generate PDF
 *
 * @param {Object} data
 * @param {String} to
 * @param {String} img
 */
function generatePDF(data, to, img = null) {
  const { title, documentHeader, headers, body } = data;
  const pdf = new jsPdf('landscape', 'pt');
  const hasAggregates = Object.getOwnPropertyNames(documentHeader.aggregates || {}).length > 0;

  pdf.autoTable([], body, { margin: { top: hasAggregates ? 250 : 220 }, });

  // Page header
  const width = pdf.internal.pageSize.width;
  const txtWidth = pdf.getTextWidth(documentHeader.date) > 70 ? pdf.getTextWidth(documentHeader.date) - 70 : 0;
  const drawHeader = (data) => {
    if (data.pageCount === 1) {
      // Image
      if (img)
        pdf.addImage(img, "JPEG", data.settings.margin.left + 20, 50, 60, 60);

      // Association name
      pdf.setFontSize(14);
      pdf.setTextColor(40);
      pdf.setFontStyle('normal');
      pdf.setFontType('bold');
      pdf.text(documentHeader.name, 40, img ? 130 : 80);

      pdf.setFontSize(12);
      pdf.setTextColor(40);
      pdf.setFontStyle('normal');
      pdf.setFontType('bold');
      pdf.text(width - 70 - Math.ceil(txtWidth), 80, 'Tontine.Plus');

      pdf.setFontSize(10);
      pdf.setTextColor(40);
      pdf.setFontStyle('normal');
      pdf.text(width - 70 - Math.ceil(txtWidth), 95, documentHeader.date);
    }
  };

  const options = {
    didDrawPage: drawHeader,
    margin: {
      top: 100
    },
    startY: pdf.autoTableEndPosY() + 20
  }

  // Title
  pdf.setFontType('bold');
  pdf.setLineWidth(30);
  pdf.setFontSize(15);
  pdf.text(pdf.splitTextToSize(title.toUpperCase(), 380), pdf.internal.pageSize.getWidth() / 2, 180, { align: 'center' });

  // Tables aggregates informations
  if (hasAggregates) {
    let statistics = [];
    Object.getOwnPropertyNames(documentHeader.aggregates).forEach(key => {
      statistics.push(`${key}: ${documentHeader.aggregates[key]}`);
    });
    pdf.setFontType('bold');
    pdf.setFontSize(12);
    pdf.text(statistics.join("      "), 40, 240);
  }


  // Table
  pdf.autoTable(
    headers,
    body,
    options
  );

  pdf.save(`${to || title}.pdf`);
}

/**
 * Gets the content of a image URL
 *
 * @param {Object} data
 * @param {String} to
 * @returns {String} Canvas content
 */
function getDataUri(data, to) {
  let image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = function () {
    let canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;

    // Set background in case png has a transparent background
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.getContext('2d').drawImage(this, 0, 0);

    generatePDF(data, to, canvas.toDataURL('image/jpeg'));
  }
  if (data.documentHeader.image)
    image.src = data.documentHeader.image
  else
    generatePDF(data, to)
}
