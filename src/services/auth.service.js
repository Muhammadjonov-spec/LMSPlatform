const UserRepository = require('../repositories/UserRepository');
const AppError=require("../utils/AppError")
const {hashPassword, comparePassword}=require("../utils/hashPassword.util")
const {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken}=require("../utils/jwt.util")
const {OAuth2Client}=require("google-auth-library")
const {sendVerificationEmail}=require("../utils/email.util")
const crypto=require("crypto")
const googleClient= new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
class AuthService {
  async register(userData){
    const existingUser=await UserRepository.findByEmail(userData.email)
    if(existingUser){
      throw new AppError(400, "Bu email allaqachon ro'yxatdan o'tgan")
    }
    const hashedPassword=await hashPassword(userData.password)
    const verifyToken=crypto.randomBytes(32).toString("hex")
    const newUser=await UserRepository.create({
      ...userData,
      role: 'student',
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
      throw new AppError(400, "Tasdiqlash kodi yaroqsiz yoki eskirgan")
    }
    await UserRepository.update(user._id, {isVerified:true, verificationToken:null})
    return {message:"your accaunt is vericated. you can login application"}
  }
  async login(email, password){
    if (!email || !password) {throw new AppError(401, "Iltimos, email va parolni kiriting")}
    const user=await UserRepository.findByEmailWithPassword(email)
    if(!user){
      throw new AppError(401, "Email yoki parol noto'g'ri")
    }
    if (!user.isVerified) {
      throw new AppError(403, "Iltimos, avval pochtangizga kelgan xat orqali akkauntingizni tasdiqlang!");
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
    const newSessionVersion = user.sessionVersion + 1
    const accessToken=generateAccessToken(user._id, newSessionVersion )
    const refreshToken=generateRefreshToken(user._id, newSessionVersion)
    
    await UserRepository.update(user._id, {refreshToken:refreshToken, sessionVersion:newSessionVersion})
    return{user:{id:user._id,
      email:user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role:user.role
    }, accessToken, refreshToken}
  }
  async googleAuth(idToken){
    if(!idToken){
      throw new AppError(403,"Google tokeni kiritilmadi")
    }
    let payload
    try {
      const ticket=await googleClient.verifyIdToken({idToken, audience:process.env.GOOGLE_CLIENT_ID})
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
        lastName: family_name || '',
        googleId: sub,
        isVerified: true
      })
    }else if(!user.googleId){
      await UserRepository.update(user._id, {googleId:sub, isVerified:true})
    }
    let newSessionVersion=user.sessionVersion + 1
    const accessToken = generateAccessToken(user._id, newSessionVersion);
    const refreshToken = generateRefreshToken(user._id, newSessionVersion);
    await UserRepository.update(user._id, { refreshToken: refreshToken })
    return {
      user:{id:user._id,
        email:user.email,
        role:user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar},
        accessToken, token:accessToken, refreshToken
    }
  }
  async logout(userId){
    const user=await UserRepository.findOne({_id:userId})
    if(user){
      await UserRepository.update(userId, {refreshToken:null, sessionVersion: user.sessionVersion + 1})
    }
    
  }
}
module.exports = new AuthService();
