const { Store, Rating, Sequelize } = require('../models');
const { Op } = Sequelize;

// list all stores for normal users, include user's submitted rating
exports.listStores = async (req,res) => {
  const { q, sortBy='name', order='ASC', page=1, limit=50 } = req.query;
  const where = {};
  if(q){
    where[Op.or] = [
      { name: { [Op.like]: `%${q}%` } },
      { address: { [Op.like]: `%${q}%` } },
    ];
  }
  const offset = (page-1) * limit;
  const stores = await Store.findAll({ where, order: [[sortBy,order]], include: [{ model: Rating }], limit: parseInt(limit), offset: parseInt(offset) });
  const userId = req.user ? req.user.id : null;
  const results = stores.map(s=>{
    const ratings = s.ratings || [];
    const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.value,0)/ratings.length).toFixed(2) : null;
    const userRating = ratings.find(r=> r.user_id === userId);
    return { id:s.id, name:s.name, address:s.address, rating: avg, userRating: userRating ? userRating.value : null };
  });
  res.json(results);
};

exports.submitRating = async (req,res) => {
  try{
    const { storeId, value } = req.body;
    if(!value || value<1 || value>5) return res.status(400).json({ error:'Invalid rating' });
    const existing = await Rating.findOne({ where: { user_id: req.user.id, store_id: storeId }});
    if(existing){
      existing.value = value;
      await existing.save();
      return res.json({ ok:true, rating: existing });
    }
    const rating = await Rating.create({ value, user_id: req.user.id, store_id: storeId });
    res.json({ ok:true, rating });
  }catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }
};
