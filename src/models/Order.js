const mongoose=require("mongoose")

const OrderSchema=new mongoose.Schema({
  student:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
  course:{type:mongoose.Schema.Types.ObjectId, ref:"Course", required:true},
  status:{type:String, enum:['pending', 'approved', 'rejected'], default:"pending"},
  receiptImage:{type:String, required:true}
},{timestamps:true})


module.exports=mongoose.model("Order", OrderSchema)