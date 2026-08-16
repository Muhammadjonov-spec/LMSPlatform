const UserService = require('../services/user.service');

class UserController {
  async getAllUsers(req, res) {
    const users = await UserService.getAllUsers();
    res.status(200).json({ success: true, data: users });
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
}

module.exports = new UserController();
