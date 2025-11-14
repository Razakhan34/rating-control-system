module.exports = (allowed = []) => (req,res,next) => {
  if(!Array.isArray(allowed)) allowed = [allowed];
  if(!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if(!allowed.includes(req.user.role)) return res.status(403).json({ error: 'Access denied' });
  next();
};
