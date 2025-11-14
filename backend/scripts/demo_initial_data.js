require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { sequelize, User, Store, Rating } = require("../src/models");

async function demo_data() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    const adminData = {
      name: "Mohammed Raza Administrator",
      email: "raza@rstore.com",
      password: "Admin@1234",
      address: "Mumbai, Maharashtra, India",
      role: "admin",
    };
    const ownerData = {
      name: "Amit Meerchandani Bookstore",
      email: "amit.store@rstore.com",
      password: "Owner@1234",
      address: "Jaipur, Rajasthan, India",
      role: "owner",
    };

    let admin = await User.findOne({ where: { email: adminData.email } });
    if (!admin) admin = await User.create(adminData);
    console.log("Admin:", admin.email);

    let owner = await User.findOne({ where: { email: ownerData.email } });
    if (!owner) owner = await User.create(ownerData);
    console.log("Owner:", owner.email);

    const stores = [
      {
        name: "Raza Groceries Pune",
        email: "sharma@example.com",
        address: "Koregaon Park, Pune",
        owner_id: owner.id,
      },
      {
        name: "Raza Electronics",
        email: "raza@example.com",
        address: "Camp, Pune",
        owner_id: owner.id,
      },
      {
        name: "RazaGreen Mart",
        email: "green@example.com",
        address: "Baner, Pune",
        owner_id: null,
      },
    ];
    for (const s of stores) {
      let st = await Store.findOne({ where: { name: s.name } });
      if (!st) st = await Store.create(s);
      console.log("Store:", st.name);
    }

    const user = {
      name: "Rohit Kumar Narayan Singh",
      email: "rohit.singh@rstore.com",
      password: "User@1234",
      address: "Mumbai",
    };
    let us = await User.findOne({ where: { email: user.email } });
    if (!us) us = await User.create(user);
    console.log("User:", us.email);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

demo_data();
