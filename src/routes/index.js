const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const teacherRoutes=require("./teacher.route")



router.use('/auth', authRoutes)
router.use("/teachers", teacherRoutes )
router.use("/courses", require("./course.route"))
router.use("/categories", require("./category.route"))
router.use("/reviews", require("./review.route"))
router.use("/progress", require("./progress.route"))
router.use("/overviews", require("./overview.route"))
router.use("/users", require("./user.route"))
router.use("/orders", require("./order.route"))

module.exports = router
