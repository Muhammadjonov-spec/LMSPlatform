const mongoose=require("mongoose")

const TeacherSchema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true, unique:true},
  bio:{type:String, required:true, trim:true, minlength:20},
  experties:[{type:String, trim:true}],
  experienceYears:{type:Number, default:0},
  phone: { type: String, trim: true },
  socialLinks: { linkedin: { type: String, trim: true }, github: { type: String, trim: true }, website: { type: String, trim: true } },
  isApproved: {type: Boolean, default: false},
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String }
})

module.exports=mongoose.model("Teacher", TeacherSchema)