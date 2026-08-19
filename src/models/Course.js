const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title:{type:String, required:true},
  description:{type:String, default:null},
  isPublished:{type:Boolean, default:false},
  averageRating:{type:Number, default:0},
  price:{type:Number, default:null},
  discountPrise:{type:Number, default:null},
  isFree:{type:Boolean, default:false},
  thumbnail:{type:String},
  previewVideo:{type:String, default:null},
  teacher:{type:mongoose.Types.ObjectId, ref:"Teacher", default:null},
  category:{type:mongoose.Types.ObjectId, ref:"Category", default:null},
  lessons:[{ 
    title: { type: String, required: true },
    videoPath: { type: String, default: null },
    status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' }
    }],
  modules: [{
      title: { type: String, required: true },
      lessons: [{
          title: { type: String, required: true },
          type: { type: String, enum: ['video', 'text'], default: 'video' },
          videoPath: { type: String, default: null },
          text: { type: String, default: null },
          status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' }
      }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
