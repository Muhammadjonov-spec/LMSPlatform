const CourseController=require("../controllers/course.controller")
const router=require("express").Router()
const {isAuth, restrictTo}=require("../middlewares/auth.middleware")

router.post("/create", isAuth, restrictTo("teacher", "admin", "super_admin"), CourseController.createCourse)
router.get("/get-courses", isAuth, CourseController.getCourceDetails)

module.exports=router