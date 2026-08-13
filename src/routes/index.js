const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const teacherRoutes=require("./teacher.route")
const videoRoutes=require("./video.route")
const orderRoutes=require("./order.route")

router.use('/auth', authRoutes)
router.use("/teachers", teacherRoutes )
router.use("course", require("./course.route"))


module.exports = router
