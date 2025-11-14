const { Store, Rating, User } = require('../models');

// For store owner dashboard
exports.myDashboard = async (req,res) => {
  const ownerId = req.user.id;
  const stores = await Store.findAll({ where: { owner_id: ownerId }, include: [{ model: Rating, include: [User] }] });
  const results = stores.map(s=>{
    const ratings = s.ratings || [];
    const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.value,0)/ratings.length).toFixed(2) : null;
    const users = ratings.map(r=>({ id:r.user.id, name:r.user.name, email:r.user.email, value: r.value }));
    return { id:s.id, name:s.name, address:s.address, avgRating: avg, ratings: users };
  });
  res.json(results);
};
