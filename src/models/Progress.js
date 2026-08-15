const mongoose=require("mongoose")

const ProgressSchema=new mongoose.Schema({
  student:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
  course:{type:mongoose.Schema.Types.ObjectId, ref:"Course", required:true},
  completedLessons:[{type:String, required:true}],
  percentage:{type:Number, default:0},
  lastWatchedLesson:{type:mongoose.Schema.Types.ObjectId, default: null}
}, {timestamps:true})

module.exports=mongoose.model("Progress", ProgressSchema)