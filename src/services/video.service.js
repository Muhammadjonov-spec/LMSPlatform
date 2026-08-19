const ffmpeg = require('fluent-ffmpeg');
const path=require("path")
const fs=require("fs")
const AppError=require("../utils/AppError")

class VideoService {
  async convertToHls(inputPath, outputFolder) {
    return new Promise((resolve, reject)=>{
      const outputDir=path.join(__dirname, "../../public/videos", outputFolder)

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
      const outputFileName = path.join(outputDir, 'index.m3u8')
      ffmpeg(inputPath).outputOptions([
          '-c:v libx264',
          '-c:a aac',
          '-start_number 0',   
          '-hls_time 10',      
          '-hls_list_size 0',  
          '-f hls' 
      ]).output(outputFileName)
    .on('end', () => {
      fs.unlinkSync(inputPath);
      resolve(`/videos/${outputFolder}/index.m3u8`); 
    })
    .on('error', (err) => {
      reject(new AppError(500, "Videoni qayta ishlashda xatolik: " + err.message));
    })
    .run();
    })
  }
}

module.exports = new VideoService()
