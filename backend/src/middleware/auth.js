const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

module.exports = async function(req,res,next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if(!user) return res.status(401).json({ error:'Invalid token user' });
    req.user = user;
    next();
  }catch(err){
    return res.status(401).json({ error: 'Invalid token' });
  }
}
