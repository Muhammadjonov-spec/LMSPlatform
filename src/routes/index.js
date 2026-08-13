const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const teacherRoutes=require("./teacher.route")
const videoRoutes=require("./video.route")


router.use('/auth', authRoutes)
router.use("/teachers", teacherRoutes )
router.use("/course", require("./course.route"))
router.use("/category", require("./category.route"))
router.use("/video", videoRoutes)


module.exports = router
