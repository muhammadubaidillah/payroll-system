function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'unauthorized', error_message: 'Forbidden: Admins only' });
  }

  next();
}

function isEmployee(req, res, next) {
  if (req.user.role !== 'employee') {
    return res
      .status(403)
      .json({ error: 'unauthorized', error_message: 'Forbidden: Employees only' });
  }

  next();
}

module.exports = {
  isAdmin,
  isEmployee,
};
