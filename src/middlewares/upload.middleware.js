const multer=require("multer")
const path=require("path")
const fs=require("fs")
const AppError=require("../utils/AppError")

const pictureDir="uploads/pictures"
const videoDir="uploads/videos"
if(!fs.existsSync(pictureDir)){
  fs.mkdirSync(pictureDir, { recursive: true })
}
if(!fs.existsSync(videoDir)){
  fs.mkdirSync(videoDir, { recursive: true })
}

const storage=multer.diskStorage({
  destination:function(req, file, cb){
    if(file.mimetype.startsWith("image/")){
      cb(null, pictureDir)
    }else if(file.mimetype.startsWith("video/")){
       cb(null, videoDir)
    }
    else{
      cb(null, "uploads/")
    }
    
  },
  filename:function(req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Faqat rasm (jpeg, jpg, png) yuklash mumkin!"), false);
  }
}


const uploadImage=multer({storage:storage, fileFilter:imageFilter, limits:{ fileSize: 10* 1024 * 1024 }})
const uploadVideo=multer({storage:storage, limits:{fileSize:2000*1024*1024}})
module.exports={ uploadImage, uploadVideo }
