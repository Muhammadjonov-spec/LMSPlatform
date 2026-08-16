const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/AppError');
const { hashPassword } = require('../utils/hashPassword.util');
const { sendVerificationEmail } = require('../utils/email.util');
const crypto = require('crypto');

class UserService {
  async getAllUsers() {
    const users = await UserRepository.model.find().select("-password -verificationToken -refreshToken");
    return users;
  }

  async createUser(data) {
    const { firstName, lastName, email, password, role } = data;
    
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(400, "Bu email allaqachon ro'yxatdan o'tgan");
    }

    const hashedPassword = await hashPassword(password);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    
    const newUser = await UserRepository.create({
      firstName,
      lastName,
      email,
      role: role || 'student',
      password: hashedPassword,
      isVerified: false,
      verificationToken: verifyToken
    });

    await sendVerificationEmail(newUser.email, verifyToken);
    
    return {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role
    };
  }

  async updateUser(id, data) {
    const { firstName, lastName, email, role } = data;
    
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError(404, "Foydalanuvchi topilmadi");
    }

    const updatedUser = await UserRepository.update(id, {
      firstName,
      lastName,
      email,
      role
    });

    return {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role
    };
  }

  async deleteUser(id, requestUser) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError(404, "Foydalanuvchi topilmadi");
    }
    
    if (requestUser._id.toString() === id) {
      throw new AppError(400, "O'zingizni o'chira olmaysiz");
    }

    await UserRepository.model.findByIdAndDelete(id);
    return true;
  }
}

module.exports = new UserService();
