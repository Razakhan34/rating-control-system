const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validateName, validateAddress, validateEmail, validatePassword } = require('../utils/validators');
require('dotenv').config();

function generateToken(user){
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

exports.signup = async (req,res) => {
  try{
    const { name, email, password, address } = req.body;
    let err;
    if(err = validateName(name)) return res.status(400).json({ error: err });
    if(err = validateEmail(email)) return res.status(400).json({ error: err });
    if(err = validatePassword(password)) return res.status(400).json({ error: err });
    if(err = validateAddress(address)) return res.status(400).json({ error: err });

    const exists = await User.findOne({ where: { email }});
    if(exists) return res.status(400).json({ error: 'Email already exists' });
    const user = await User.create({ name, email, password, address, role: 'user' });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role:user.role }, token: generateToken(user) });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.login = async (req,res) => {
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ where: { email }});
    if(!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: generateToken(user) });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.updatePassword = async (req,res) => {
  try{
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    if(!oldPassword || !newPassword) return res.status(400).json({ error: 'Old and new password required' });
    const ok = await user.comparePassword(oldPassword);
    if(!ok) return res.status(400).json({ error: 'Old password incorrect' });
    const err = validatePassword(newPassword);
    if(err) return res.status(400).json({ error: err });
    user.password = newPassword;
    await user.save();
    res.json({ ok:true, msg:'Password updated' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'Server error' });
  }
}
