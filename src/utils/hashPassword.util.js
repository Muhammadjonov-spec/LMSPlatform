const bcrypt=require("bcrypt")
const AppError=require("./AppError")
const hashPassword=async(password)=>{
  return await bcrypt.hash(password, 10)
}

const comparePassword=async(password, hashPassword)=>{
  const isMatch= await bcrypt.compare(password, hashPassword)
  if (!isMatch) {
    throw new AppError(500, "Invalid Password")
  }
  return isMatch
}

module.exports={hashPassword, comparePassword}