const multer=require("multer")
const path=require("path")
const fs=require("fs")

const uploadDir="uploads"
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage=multer.diskStorage({
  destination:function(req, file, cb){
    cb(null, uploadDir)
  },
  filename:function(req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})
const upload=multer({storage:storage})
module.exports=upload
