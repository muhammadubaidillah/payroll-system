const PDFDocument = require('pdfkit');
const { formatDate, instance, formats } = require('./datetime');

const generatePayslipPdf = (payslip) => {
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
};

module.exports = { generatePayslipPdf };
