const CourseController=require("../controllers/course.controller")
const router=require("express").Router()
const {isAuth, restrictTo}=require("../middlewares/auth.middleware")
const { uploadVideo } = require('../middlewares/upload.middleware')

router.get("/", isAuth, restrictTo("teacher", "admin", "super_admin"), CourseController.getAllCourses)
router.get("/public", CourseController.getPublicCourses)
router.get("/public/:id", CourseController.getPublicCourseDetails)
router.post("/create", isAuth, restrictTo("teacher", "admin", "super_admin"), uploadVideo.single("previewVideo"), CourseController.createCourse)
router.get("/:id", isAuth, CourseController.getCourceDetails)

router.put("/:id", isAuth, restrictTo("teacher", "admin", "super_admin"), uploadVideo.single("previewVideo"), CourseController.updateCourse)
router.get("/contents/:id", isAuth, CourseController.getDetailContent)
router.put("/contents/:id", isAuth, restrictTo("teacher", "admin", "super_admin"), uploadVideo.single("video"), CourseController.updateContent)
router.delete("/contents/:id", isAuth, restrictTo("teacher", "admin", "super_admin"), CourseController.deleteDetailContent)

router.post("/:id/modules", isAuth, restrictTo("teacher", "admin", "super_admin"), CourseController.addModule)
router.post("/:courseId/modules/:moduleId/lessons", isAuth, restrictTo("teacher", "admin", "super_admin"), uploadVideo.single("video"), CourseController.addLesson)

module.exports=router