const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const { isAuth, restrictTo } = require("../middlewares/auth.middleware");

router.get("/", isAuth, restrictTo("super_admin", "admin"), UserController.getAllUsers);
router.post("/", isAuth, restrictTo("super_admin", "admin"), UserController.createUser);
router.put("/:id", isAuth, restrictTo("super_admin", "admin"), UserController.updateUser);
router.delete("/:id", isAuth, restrictTo("super_admin"), UserController.deleteUser);
module.exports = router;
