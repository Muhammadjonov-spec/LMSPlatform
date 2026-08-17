const OrderController=require("../controllers/order.controller")
const {isAuth, restrictTo}=require("../middlewares/auth.middleware")
const router=require("express").Router()
const {uploadImage}=require("../middlewares/upload.middleware")

router.post("/:id/buy", isAuth, uploadImage.single("receiptImage"), OrderController.createOrder)
router.get("/pending", isAuth, restrictTo("admin", "super_admin"), OrderController.getPendingOrders)
router.put("/:id/approve", isAuth, restrictTo("admin", "super_admin"), OrderController.approveOrder)

module.exports=router