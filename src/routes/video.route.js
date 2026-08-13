const VideoController=require("../controllers/video.controller")
const {isAuth, restrictTo}=require("../middlewares/auth.middleware")
const router=require("express").Router()
const {uploadVideo}=require("../middlewares/upload.middleware")

router.post("/convert", isAuth, uploadVideo.single("video"),VideoController.convertToHls)

