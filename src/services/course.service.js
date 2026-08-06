const OrderRepository = require('../repositories/OrderRepository');
const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/AppError');

class OrderService {
  async createOrder(studentId, courseId, receiptImage) {
    const newOrder = await OrderRepository.create({
      student: studentId,
      course: courseId,
      receiptImage: receiptImage,
      status: 'pending' 
    });
    return newOrder;
  }
  async approveOrder(orderId) {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new AppError(404, "Buyurtma topilmadi");
    if (order.status === 'approved') {
      throw new AppError(400, "Bu to'lov allaqachon tasdiqlangan");
    }
    await OrderRepository.update(orderId, { status: 'approved' });
    const student = await UserRepository.findById(order.student);
    if (!student.enrolledCourses.includes(order.course)) {
      student.enrolledCourses.push(order.course)
      await UserRepository.update(student._id, { enrolledCourses: student.enrolledCourses });
    }
    return { message: "To'lov tasdiqlandi va kurs o'quvchiga ochildi" };
  }
}

module.exports = new OrderService();