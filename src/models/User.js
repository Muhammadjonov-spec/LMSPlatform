const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName:{type:String, required:true, trim:true},
    lastName:{type:String, trim:true},
    email:{type:String, required:true, trim:true, unique:true, index:true},
    password:{type:String, select:false, trim:true},
    googleId:{type:String},
    role:{type:String, enum: ['student', 'teacher', 'admin', 'super_admin'], default: 'student'},
    authProvider:{type:String},
    isVerified:{type:Boolean, default:false},
    enrolledCourses:[{type:mongoose.Schema.Types.ObjectId, ref:"Course"}],
    verificationToken:{type:String},
    refreshToken:{type:String},
    sessionVersion:{type:Number, default:1}
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
