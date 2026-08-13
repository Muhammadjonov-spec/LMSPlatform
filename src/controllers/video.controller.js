const VideoService = require('../services/video.service');
const AppError = require('../utils/AppError');

class VideoController {
  async convertToHls(req, res) {
    if (!req.file) {
      throw new AppError(400, "Iltimos, video faylni yuklang!");
    }
    
    const inputPath = req.file.path;
    const outputFolder = `lesson_${Date.now()}+${Math.round(Math.random()*10)}`; 
    const videoUrl = await VideoService.convertToHls(inputPath, outputFolder);
    res.status(200).json({ success: true, url: videoUrl });
  }

}
module.exports = new VideoController()