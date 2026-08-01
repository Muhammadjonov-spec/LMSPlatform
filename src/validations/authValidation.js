 
// const registerSchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required()
// })
// 2. Ushbu sxemalarni ishlatuvchi validatsiya middleware'ni yozing. (Agar xato bo'lsa AppError 400 qaytaradi).

const Joi = require('joi');

// Simalarni yozing va eksport qiling...
