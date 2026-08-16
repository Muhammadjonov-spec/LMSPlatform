const router = require("express").Router();
const OverviewController = require("../controllers/overview.controller");
const { isAuth, restrictTo } = require("../middlewares/auth.middleware");

router.get("/", isAuth, restrictTo("admin", "super_admin", "teacher"), OverviewController.getOverview);

module.exports = router;
