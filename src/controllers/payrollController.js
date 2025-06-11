const { isOverlap, createPeriod } = require('../services/payrollService');
const { formatDate, isAfter } = require('../utils/datetime');

async function addPayrollPeriod(req, res) {
  const { start_date: startDate, end_date: endDate } = req.body;

  if (isAfter(formatDate(startDate), formatDate(endDate))) {
    return res.status(400).json({
      error: 'invalid_period',
      error_description: 'start_date must be before end_date',
    });
  }

  const overlap = await isOverlap(startDate, endDate);

  if (overlap) {
    return res.status(400).json({
      error: 'overlap_period',
      error_description: 'Payroll period overlaps with existing period',
    });
  }

  const result = await createPeriod({
    start_date: startDate,
    end_date: endDate,
    created_by: req.user.id,
    created_ip: req.ip,
  });

  if (typeof result === 'object') {
    return res.status(200).json({ success: true, id: result.id });
  } else {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  addPayrollPeriod,
};
