const express = require('express');
const TeacherController = require("../controllers/teacher.controller")
const router = express.Router();
const {isAuth, restrictTo}=require("../middlewares/auth.middleware")

router.post("/apply", isAuth, TeacherController.applyForTeacher )
router.get("/:id", isAuth, TeacherController.getTeacherProfile)
router.put("/:id/approve", isAuth, restrictTo("admin", "super_admin"), TeacherController.approvedTeacher)
router.put("/my-profile", isAuth, restrictTo("teacher", "super_admin"), TeacherController.updateProfile)


module.exports=router