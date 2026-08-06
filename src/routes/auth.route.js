const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const isAuth=require("../middlewares/auth.middleware")
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", isAuth, authController.logout)

module.exports = router;
