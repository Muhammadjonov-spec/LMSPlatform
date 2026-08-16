const CategoryController=require("../controllers/category.controller")
const {isAuth, restrictTo}=require("../middlewares/auth.middleware")
const router=require("express").Router()

router.post("/", isAuth, restrictTo("admin", "super_admin"), CategoryController.createCategory)
router.get("/", CategoryController.getAllCategories)
router.delete("/:id", isAuth, restrictTo("admin", "super_admin"), CategoryController.deleteCategory)
router.patch("/:id", isAuth, restrictTo("admin", "super_admin"), CategoryController.updateCategory)

module.exports=router