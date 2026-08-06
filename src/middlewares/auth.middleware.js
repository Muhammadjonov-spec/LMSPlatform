const { verifyAccessToken }=require("../utils/jwt.util")
const AppError=require("../utils/AppError")
const UserRepository=require("../repositories/UserRepository")
const isAuth = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token=req.headers.authorization.split(" ")[1]
  }
  if(!token){
    return res.status(401).json({ success: false, message: "Token topilmadi, tizimga kiring" })
  }
  try {
    const decoded=verifyAccessToken(token)
    const user=await UserRepository.findById(decoded.id)
    if (!user) return next(new AppError(401, "Bunday foydalanuvchi topilmadi"))
    if(user.sessionVersion!==decoded.sessionVersion){
      return next(new AppError(401, "Sessiya eskirgan. Boshqa qurilmadan kirilgan bo'lishi mumkin. Qaytadan kiring."))
    }
    req.user=user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: "Yaroqsiz token" })
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      return next(new AppError(403, "Sizda bu amalni bajarish uchun ruxsat yo'q (Faqat admin/o'qituvchilar uchun)"))
    }
    next()
  }
}
module.exports = { isAuth, restrictTo }
