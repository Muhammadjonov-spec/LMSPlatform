const mongoose=require("mongoose")

const ReviewSchema=new mongoose.Schema({
  studentId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
  courceId:{type:mongoose.Schema.Types.ObjectId, ref:"Course", required:true},
  rating:{type:Number, default:1},
  comment:{type:String, default:null}

}, {timestamps:true})


module.exports=mongoose.model("Review", ReviewSchema)