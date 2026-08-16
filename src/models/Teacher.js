const mongoose=require("mongoose")

const TeacherSchema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true, unique:true},
  bio:{type:String, required:true, trim:true, minlength:20},
  experties:[{type:String, trim:true}],
  experienceYears:{type:Number, default:0},
  socialLinks: { youtube: { type: String, trim: true }, linkedin: { type: String, trim: true }, github: { type: String, trim: true }, website: { type: String, trim: true }
  },
  
  isApproved: {type: Boolean, default: false}
})

module.exports=mongoose.model("Teacher", TeacherSchema)