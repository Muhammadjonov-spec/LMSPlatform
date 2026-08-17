const router = require('express').Router()
const TeacherController = require("../controllers/teacher.controller")
const {isAuth, restrictTo}=require("../middlewares/auth.middleware")

router.post("/apply", isAuth, TeacherController.applyForTeacher )
router.get("/all", isAuth, restrictTo("admin", "super_admin"), TeacherController.getAllApplications)
router.get("/my-application", isAuth, TeacherController.getMyApplication)
router.get("/:id", isAuth, TeacherController.getTeacherProfile)
router.put("/:id/approve", isAuth, restrictTo("admin", "super_admin"), TeacherController.approvedTeacher)
router.put("/:id/reject", isAuth, restrictTo("admin", "super_admin"), TeacherController.rejectTeacher)
router.put("/my-profile", isAuth, restrictTo("teacher", "super_admin"), TeacherController.updateProfile)


module.exports=router