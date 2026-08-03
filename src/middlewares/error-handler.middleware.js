

export const errorHandler=(err, req, res, next)=>{
  console.error("TIZIMDA XATO YUZ BERDI:", err.message)
  const statusCode=err.statusCode ||400
  const message= err.message ||  "Serverda ichki xatolik yuz berdi"
  res.status(statusCode).json({success:false, message:message})
}