const UserRepository = require('../repositories/UserRepository');
const AppError=require("../utils/AppError")
const {hashPassword, comparePassword}=require("../utils/hashPassword.util")
const {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken}=require("../utils/jwt.util")
const {OAuth2Client}=require("google-auth-library")
const {sendVerificationEmail}=require("../utils/email.util")
const googleClient= new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
class AuthService {
  async register(userData){
    const existingUser=await UserRepository.findByEmail(userData.email)
    if(existingUser){
      throw new AppError(400, "Bu email allaqachon ro'yxatdan o'tgan")
    }
    const hashedPassword=await hashPassword(userData.password)
    const verifyToken=await verifyRefreshToken(userData)
    const newUser=await UserRepository.create({
      ...userData,
      password:hashedPassword,
      isVerified:false,
      verificationToken:verifyToken
    })
    await sendVerificationEmail(newUser.email, verifyToken)
    return {message:"your accaunt is verify successfully. Please check your email adress"}
  }
  async verifyEmail(token){
    const user=await UserRepository.findOne({verificationToken:token})
    if(!user){
      throw new Error("Tasdiqlash kodi yaroqsiz yoki eskirgan")
    }
    await UserRepository.update(user._id, {isVerified:true, verificationToken:null})
    return {message:"your accaunt is vericated. you can login application"}
  }
  async login(email, password){
    if (!email || !password) {throw new AppError(401, "Iltimos, email va parolni kiriting")}
    const user=await UserRepository.findByEmail(email).select("+password")
    if(!user){
      throw new AppError(401, "Email yoki parol noto'g'ri")
    }
    if (!user.isVerified) {
      throw new AppError("Iltimos, avval pochtangizga kelgan xat orqali akkauntingizni tasdiqlang!");
    }
    let isMatch=false
    try {
      isMatch=await comparePassword(password, user.password)
    } catch (error) {
      isMatch=false
    }
    if(!isMatch){
      throw new AppError(400, "Email yoki parol noto'g'ri")
    }
    const accessToken=generateAccessToken(user._id)
    const refreshToken=generateRefreshToken(user._id)
    await UserRepository.update(user._id, {refreshToken:refreshToken})
    return{user:{id:user._id,
      email:user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }, accessToken, refreshToken}
  }
  async googleAuth(idToken){
    if(!idToken){
      throw new AppError(403,"Google tokeni kiritilmadi")
    }
    let payload
    try {
      const ticket=await googleClient.verifyIdToken({idToken, audience:proccess.env.GOOGLE_CLIENT_ID})
      payload=ticket.getPayload()
    } catch (error) {
      throw new AppError(402, `${error.message}`)
    }
    const { email, name, picture, sub, given_name, family_name } = payload
    let user=await UserRepository.findByEmail(email)
    if(!user){
      user=await UserRepository.create({email:email,
        firstName:given_name || name || 'User',
        avatar: picture || null,
        googleId: sub,
        isVerified: true
      })
    }else if(!user.googleId){
      await UserRepository.update(user._id, {googleId:sub, isVerified:true})
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await UserRepository.update(user._id, { refreshToken: refreshToken })
    return {
      user:{id:user._id,
        email:user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar},
        accessToken, token:accessToken, refreshToken
    }
  }
}
module.exports = new AuthService();
