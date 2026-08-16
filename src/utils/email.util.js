const nodemailer=require("nodemailer")
const AppError = require("./AppError")

const sendVerificationEmail=async(userEmail, verificationToken)=>{
  try {
    const transporter=nodemailer.createTransport({
      service:"gmail",
      auth:{user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
      }
    })
    const verifyUrl=`${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`
    const mailOptions={
      from:`"EduStack"<${process.env.EMAIL_USER}>`,
      to:userEmail,
      subject:"Akkauntni tasdiqlang",
      html:`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <h1 style="color: #0088cc;">Xush kelibsiz!</h1>
          <p> StackHubga a'zo bo'lganingiz uchun rahmat. Akkauntingizni faollashtirish va tizimga kirish uchun quyidagi tugmani bosing:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0088cc; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Akkauntni faollashtirish</a>
          <br/>
          <p style="font-size: 12px; color: #777;">Agar tugma ishlamasa, ushbu linkni brauzerga nusxalang:<br/>${verifyUrl}</p>
        </div>
      `
    }
    await transporter.sendMail(mailOptions)
    console.log(`Xat muvaffaqiyatli jo'natildi: ${userEmail}`)
  } catch (error) {
    console.error("Xat jo'natishda xato yuz berdi:", error.message);
    throw new AppError(500, "Xat jo'natishda xato yuz berdi")
  }
}

module.exports=sendVerificationEmail
