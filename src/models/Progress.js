const mongoose=require("mongoose")

const ProgressSchema=new mongoose.Schema({
  student:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
}, {timestamps:true})