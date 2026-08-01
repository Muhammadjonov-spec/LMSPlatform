const jwt =require("jsonwebtoken")
const  generateAccessToken=(userId)=>{
  const ACCESS_SECRET=process.env.ACCESS_SECRET
  return jwt.sign({id:userId}, ACCESS_SECRET, {expiresIn: "7d"})
} 

const  generateRefreshToken=(userId)=>{
  const REFRESH_SECRET=process.env.REFRESH_SECRET
  return jwt.sign({id:userId}, REFRESH_SECRET, {expiresIn: "30"})
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