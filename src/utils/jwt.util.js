const jwt =require("jsonwebtoken")
const  generateAccessToken=(userId, sessionVersion)=>{
  const ACCESS_SECRET=process.env.ACCESS_SECRET
  return jwt.sign({id:userId, sessionVersion:sessionVersion}, ACCESS_SECRET, {expiresIn: "7d"})
} 

const  generateRefreshToken=(userId, sessionVersion)=>{
  const REFRESH_SECRET=process.env.REFRESH_SECRET
  return jwt.sign({id:userId, sessionVersion:sessionVersion}, REFRESH_SECRET, {expiresIn: "30d"})
} 

const verifyAccessToken = (token) => {
  const ACCESS_SECRET = process.env.ACCESS_SECRET;
  return jwt.verify(token, ACCESS_SECRET)
}

const verifyRefreshToken = (token) => {
  const REFRESH_SECRET = process.env.REFRESH_SECRET;
  return jwt.verify(token, REFRESH_SECRET)
}



module.exports={generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken}