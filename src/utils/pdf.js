const PDFDocument = require('pdfkit');
const { formatDate, instance, formats, now } = require('./datetime');
const logger = require('./logger');

function generatePayslipPdf(payslip) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(20).text('Payslip', { align: 'center' });
    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Processed at: ${formatDate(instance(payslip.created_at), formats.FMT_DATE_TIME_DMY)}`);
    doc.moveDown();

    doc.fontSize(14).text('Salary Breakdown');
    doc
      .fontSize(12)
      .text(`Base Salary: Rp ${payslip.base_salary.toLocaleString('id-ID')}`)
      .text(`Days Present: ${payslip.total_attendance_days}`)
      .text(`Prorated Salary: Rp ${payslip.prorated_salary.toLocaleString('id-ID')}`);
    doc.moveDown();

    // Overtime Info
    doc.fontSize(14).text('Overtime');
    doc
      .fontSize(12)
      .text(`Overtime (minutes): ${payslip.overtime_minutes}`)
      .text(`Overtime Pay: Rp ${payslip.overtime_pay.toLocaleString('id-ID')}`);
    doc.moveDown();

    // Reimbursements
    doc.fontSize(14).text('Reimbursements');
    doc
      .fontSize(12)
      .text(`Total Reimbursements: Rp ${payslip.reimbursement_total.toLocaleString('id-ID')}`);
    doc.moveDown();

    // Total Take Home
    doc.fontSize(14).text(`Take-Home Pay: Rp ${payslip.take_home_pay.toLocaleString('id-ID')}`, {
      underline: true,
    });

    doc.end();
  });
}

function generateTableHeader(doc) {
  doc.fontSize(14).text('Details', { underline: true });
  doc.moveDown(0.5);

  const tableHeaderY = doc.y;
  doc.fontSize(12);
  doc.text('Name', 50, tableHeaderY, { width: 300 });
  doc.text('Take-Home Pay', 350, tableHeaderY, { width: 200, align: 'right' });

  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
}

function generatePayslipSummaryPdf({ periodId, summary, totalTakeHomePay }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(20).text('Payroll Summary', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Periode ID: ${periodId}`);
    doc.text(`Generated on: ${formatDate(now())}`);
    doc.moveDown();

    generateTableHeader(doc);

    summary.forEach((user) => {
      const rowHeight = 20;

      if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        generateTableHeader(doc);
      }

      const y = doc.y;
      const name = user.name || 'N/A';
      const pay = user.take_home_pay || 0;
      const payString = `Rp ${pay.toLocaleString('id-ID')}`;

      doc.text(name, 50, y, { width: 300, align: 'left' });
      doc.text(payString, 350, y, { width: 200, align: 'right' });
      doc.moveDown();
    });

    doc.moveDown(1);
    doc
      .fontSize(14)
      .text(`Total Payout (All Employees): Rp ${totalTakeHomePay.toLocaleString('id-ID')}`, {
        underline: true,
      });

    doc.end();
  });
}

module.exports = { generatePayslipPdf, generatePayslipSummaryPdf };
