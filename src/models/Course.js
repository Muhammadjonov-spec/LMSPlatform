const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title:{type:String, required:true},
  description:{type:String, default:null},
  isPublished:{type:Boolean, default:false},
  avarangeRating:{type:Stirng, default:null},
  price:{type:Number, default:null},
  discountPrise:{type:Number, default:null},
  thumbnail:{type:String},
  teacher:{type:mongoose.Types.ObjectId, ref:"Teacher", default:null},
  category:{type:mongoose.Types.ObjectId, ref:"Category", default:null}
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
