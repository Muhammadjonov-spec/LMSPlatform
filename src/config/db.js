const mongoose = require('mongoose')
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,)
    console.log("MONGODB connected successfully")
  } catch (error) {
    console.log( `DB error ${error.message}`)
    process.exit(1)
  }
  
};

module.exports = connectDB
