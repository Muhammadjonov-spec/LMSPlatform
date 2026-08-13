const CategoryController=require("../controllers/category.controller")
const {isAuth, restrictTo}=require("../middlewares/auth.middleware")
const router=require("express").Router()

router.post("/create", isAuth, restrictTo("admin", "super_admin"), CategoryController.createCategory)
router.get("/:id/get", isAuth, CategoryController.getAllCategories)
router.delete("/:id", isAuth, restrictTo("admin", "super_admin"), CategoryController.deleteCategory)
router.patch("/:id/update", isAuth, restrictTo("admin", "super_admin"), CategoryController.updateCategory)

module.exports=router