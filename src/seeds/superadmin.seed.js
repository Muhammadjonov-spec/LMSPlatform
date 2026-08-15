require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const { hashPassword } = require("../utils/hashPassword.util");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt.util");

const seedSuperAdmin = async () => {
  try {
    console.log("\n🔌 MongoDB ga ulanmoqda...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lms-db");
    console.log("✅ MongoDB ga ulandi!\n");

    const email    = process.env.SUPERADMIN_EMAIL    || "superadmin@edustack.uz";
    const password = process.env.SUPERADMIN_PASSWORD || "superadmin123";

    const hashedPassword = await hashPassword(password);

    let user = await User.findOne({ email });

    if (user) {
      console.log(`⚠️  Super Admin (${email}) allaqachon mavjud — ma'lumotlar yangilanmoqda...`);
      user.password      = hashedPassword;
      user.isVerified    = true;
      user.role          = "super_admin";
      user.sessionVersion = (user.sessionVersion || 1) + 1;
      user.verificationToken = null;
      await user.save();
      console.log("✅ Super Admin yangilandi!");
    } else {
      user = await User.create({
        firstName:      "Super",
        lastName:       "Admin",
        email:          email,
        password:       hashedPassword,
        role:           "super_admin",
        isVerified:     true,             
        sessionVersion: 1,
        verificationToken: null,
      });
      console.log("✅ Super Admin yaratildi!");
    }
    const accessToken  = generateAccessToken(user._id, user.sessionVersion);
    const refreshToken = generateRefreshToken(user._id, user.sessionVersion);
    user.refreshToken = refreshToken;
    await user.save();

    console.log(` Email    : ${email}`);
    console.log(` Parol    : ${password}`);
    console.log(` Rol      : ${user.role}`);
    console.log(` User ID  : ${user._id}`);
    
    console.log("ACCESS TOKEN (7 kun):");
    console.log(accessToken);
    console.log("───────────────────────────────────────────");
    console.log(" REFRESH TOKEN (30 kun):");
    console.log(refreshToken);
  } catch (error) {
    console.error("Xatolik:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedSuperAdmin()

