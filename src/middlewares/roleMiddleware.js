function isAdmin(req, res, next) {
  if (res.locals.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
  }

  next();
}

function isEmployee(req, res, next) {
  if (res.locals.user.role !== 'employee') {
    return res.status(403).json({ success: false, message: 'Forbidden: Employees only' });
  }

  next();
}

module.exports = {
  isAdmin,
  isEmployee,
};
