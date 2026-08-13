const orderService=require("../services/order.service")


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