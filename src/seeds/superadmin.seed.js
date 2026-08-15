require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const { hashPassword } = require("../utils/hashPassword.util");

const seedSuperAdmin = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lms-db");

    const email = "superadmin@edustack.uz";
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`Super Admin with email ${email} already exists!`);
      process.exit(0);
    }

    // Hash password
    const password = "superadmin123";
    const hashedPassword = await hashPassword(password);
    await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: email,
      password: hashedPassword,
      role: "super_admin",
      isVerified: true
    });

    console.log(`Super Admin created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error("Error seeding superadmin:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedSuperAdmin();
