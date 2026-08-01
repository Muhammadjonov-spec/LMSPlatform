require('dotenv').config();
require("express-async-errors")
const PORT = process.env.PORT || 5000;
const connectDB=require("./config/db")
const app=require("./app")
const bootstrap=async()=>{
  await connectDB()
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

bootstrap()