const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const teacherRoutes=require("./teacher.route")
router.use('/auth', authRoutes)
router.use("/", teacherRoutes )


module.exports = router;
