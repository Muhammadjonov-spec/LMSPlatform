const { verifyAccessToken }=require("../utils/jwt.util")
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
    req.user={id: decoded.id}
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: "Yaroqsiz token" })
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // logic...
  };
};

module.exports = { isAuth, restrictTo };
