const { User, Store, Rating, Sequelize } = require("../models");
const { Op } = Sequelize;
const {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

// Dashboard totals
exports.dashboard = async (req, res) => {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();
  res.json({ totalUsers, totalStores, totalRatings });
};

// Add user (admin creates admin/normal/owner users)
exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    let err;
    if ((err = validateName(name))) return res.status(400).json({ error: err });
    if ((err = validateEmail(email)))
      return res.status(400).json({ error: err });
    if ((err = validatePassword(password)))
      return res.status(400).json({ error: err });
    if ((err = validateAddress(address)))
      return res.status(400).json({ error: err });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email exists" });
    const user = await User.create({
      name,
      email,
      password,
      address,
      role: role || "user",
    });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user (admin)
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, address, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (name) {
      const e = validateName(name);
      if (e) return res.status(400).json({ error: e });
      user.name = name;
    }
    if (email) {
      const e = validateEmail(email);
      if (e) return res.status(400).json({ error: e });
      user.email = email;
    }
    if (address) {
      const e = validateAddress(address);
      if (e) return res.status(400).json({ error: e });
      user.address = address;
    }
    if (role) user.role = role;
    await user.save();
    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    const store = await Store.create({
      name,
      email,
      address,
      owner_id: owner_id || null,
    });
    res.json({ store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update store (admin)
exports.updateStore = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, address, owner_id } = req.body;
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ error: "Store not found" });
    if (name) store.name = name;
    if (email) store.email = email;
    if (address) store.address = address;
    if (owner_id !== undefined) store.owner_id = owner_id || null;
    await store.save();
    res.json({ store });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete store (admin)
exports.deleteStore = async (req, res) => {
  try {
    const id = req.params.id;
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ error: "Store not found" });
    await store.destroy();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.listStores = async (req, res) => {
  const { q, sortBy = "name", order = "ASC", page = 1, limit = 20 } = req.query;
  const where = {};
  if (q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${q}%` } },
      { email: { [Op.like]: `%${q}%` } },
      { address: { [Op.like]: `%${q}%` } },
    ];
  }
  const offset = (page - 1) * limit;
  const { rows, count } = await Store.findAndCountAll({
    where,
    order: [[sortBy, order]],
    include: [{ model: Rating }],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
  const results = rows.map((s) => {
    const arr = s.ratings || [];
    const avg = arr.length
      ? (arr.reduce((a, b) => a + b.value, 0) / arr.length).toFixed(2)
      : null;
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      rating: avg,
      owner_id: s.owner_id,
    };
  });
  res.json({ data: results, total: count });
};

exports.listUsers = async (req, res) => {
  const {
    q,
    role,
    sortBy = "name",
    order = "ASC",
    page = 1,
    limit = 20,
  } = req.query;
  const where = {};
  if (role) where.role = role;
  if (q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${q}%` } },
      { email: { [Op.like]: `%${q}%` } },
      { address: { [Op.like]: `%${q}%` } },
    ];
  }
  const offset = (page - 1) * limit;
  const { rows, count } = await User.findAndCountAll({
    where,
    order: [[sortBy, order]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
  res.json({ data: rows, total: count });
};

exports.getUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id, {
    include: [
      { model: Store, include: [{ model: Rating }] },
      { model: Rating },
    ],
  });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
};
