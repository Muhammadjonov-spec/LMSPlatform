const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const { isAuth, restrictTo } = require("../middlewares/auth.middleware");
const { uploadImage } = require("../middlewares/upload.middleware");

router.put("/profile/avatar", isAuth, uploadImage.single("avatar"), UserController.updateAvatar);
router.put("/change-password", isAuth, UserController.changePassword)
router.get("/", isAuth, restrictTo("super_admin", "admin"), UserController.getAllUsers);
router.post("/", isAuth, restrictTo("super_admin", "admin"), UserController.createUser);
router.put("/:id", isAuth, restrictTo("super_admin", "admin"), UserController.updateUser);
router.delete("/:id", isAuth, restrictTo("super_admin"), UserController.deleteUser);

router.get("/students", isAuth, UserController.getStudents);
router.get("/students-courses", isAuth, UserController.getStudentCourses);
router.get("/students/:id", isAuth, UserController.getStudentById);
router.post("/students", isAuth, restrictTo("admin", "super_admin", "manager"), UserController.createUser);
router.put("/students/:id", isAuth, restrictTo("admin", "super_admin", "manager"), UserController.updateUser);
router.delete("/students/:id", isAuth, restrictTo("admin", "super_admin", "manager"), UserController.deleteUser);
module.exports = router;
