const OrderService = require("../services/order.service");
const AppError = require("../utils/AppError");

class OrderController{
  async createOrder(req, res){
    const studentId=req.user._id
    const courseId=req.params.id
    const { receiptImage } = req.body
    const result=await orderService.createOrder(studentId, courseId, receiptImage)
    res.status(200).json({success:true, data:result})
  }
  async approvedOrder(req, res){
    const orderId=req.params.id
    const result=await orderService.approveOrder(orderId)
    res.status(200).json({success:true, data:result})

  }
}

module.exports = new OrderController()
class OrderController {
  
  async createOrder(req, res) {
    const studentId = req.user._id;
    const courseId = req.params.id;
    if (!req.file) {
      throw new AppError(400, "Iltimos, to'lov kvitansiyasini (rasmni) yuklang");
    }
    const receiptImage = req.file.path; 
    
    const result = await OrderService.createOrder(studentId, courseId, receiptImage);
    res.status(201).json({ success: true, data: result });
  }
  
  async approveOrder(req, res) {
    const orderId = req.params.id;
    
    const result = await OrderService.approveOrder(orderId);
    res.status(200).json({ success: true, data: result });
  }
}
module.exports = new OrderController()