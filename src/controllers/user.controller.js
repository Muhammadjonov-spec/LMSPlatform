const UserService = require('../services/user.service');
const AppError = require('../utils/AppError');
class UserController {
  async getAllUsers(req, res) {
    const users = await UserService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  }
  async changePassword(req, res){
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    const result = await UserService.changePassword(userId, currentPassword, newPassword)
    res.status(200).json({success:true, data:result});
  }
  async createUser(req, res) {
    const data = await UserService.createUser(req.body);
    res.status(201).json({ success: true, message: "Foydalanuvchi yaratildi. Tasdiqlash emaili yuborildi.", data });
  }

  async updateUser(req, res) {
    const data = await UserService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Foydalanuvchi yangilandi", data });
  }

  async deleteUser(req, res) {
    await UserService.deleteUser(req.params.id, req.user);
    res.status(200).json({ success: true, message: "Foydalanuvchi muvaffaqiyatli o'chirildi" });
  }

  async getStudents(req, res) {
    const students = await UserService.getStudents();
    res.status(200).json({ success: true, data: students });
  }

  async getStudentById(req, res) {
    const student = await UserService.getStudentById(req.params.id);
    res.status(200).json({ success: true, data: student });
  }

  async getStudentCourses(req, res) {
    const courses = await UserService.getStudentCourses(req.user._id);
    res.status(200).json({ success: true, data: courses });
  }

  async updateAvatar(req, res) {
    if (!req.file) {
      throw new AppError(400, "Iltimos rasmni yuklang");
    }
    const avatarPath = req.file.path;
    const result = await UserService.updateAvatar(req.user._id, avatarPath);
    res.status(200).json({ success: true, message: "Profil rasmi yangilandi", data: result });
  }
}

module.exports = new UserController();
