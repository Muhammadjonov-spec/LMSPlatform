const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const teacherRoutes=require("./teacher.route")



router.use('/auth', authRoutes)
router.use("/teachers", teacherRoutes )
router.use("/course", require("./course.route"))
router.use("/category", require("./category.route"))
router.use("/reviews", require("./review.route"))

module.exports = router
