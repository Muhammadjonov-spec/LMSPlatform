// 1. Express'ning 4 ta parametrli (err, req, res, next) xatolik middleware'ini yarating.
// 2. Agar xatolik AppError tipida bo'lsa (err.isOperational), shu status va xabarni qaytaring.
// 3. Agar kutilmagan xato bo'lsa (500), konsolga yozib, umumiy xatolik xabarini qaytaring.
// Bu middleware server.js da barcha routelardan keyin chaqirilishi kerak.

module.exports = (err, req, res, next) => {
  // logic...
};
