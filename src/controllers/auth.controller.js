const AuthService = require('../services/auth.service');

class AuthController {
 async register(req, res){
  const result=await AuthService.register(req.body)
  res.status(201).json({success:true, message:result.message})
 }
 async login(req, res){
  const {email, password}=req.body
  const result=await AuthService.login(email, password)
  res.status(201).json({success:true, data:result})
 }
 async verifyEmail(req, res){
  const { token } = req.params
  await AuthService.verifyEmail(token)
  res.redirect('https://lms.sardorbekcoder.uz/sign-in?verified=true')
 }
 async logout(req, res){
  const userId=req.user._id
  const result=await AuthService.logout(userId)
  res.status(201).json({success:true, message:"Successfully logout"})
 }
 async googleAuth(req, res) {
  const { idToken } = req.body;
  const result = await AuthService.googleAuth(idToken);
  res.status(200).json({ success: true, data: result });
 }
}

module.exports = new AuthController()

