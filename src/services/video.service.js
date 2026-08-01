
// 1. fluent-ffmpeg kutubxonasini import qiling.
// 2. convertToHls(inputPath, outputFolder) asinxron funksiyasini yarating.
// 3. Ushbu funksiya berilgan mp4 faylni HLS (.m3u8 va .ts fayllar) ga aylantirishi kerak.
// 4. Promise qilib qaytaring (resolve, reject) chunki ffmpeg asinxron ishlaydi.

const ffmpeg = require('fluent-ffmpeg');

class VideoService {
  async convertToHls(inputPath, outputFolder) {
    // ffmpeg logikasi...
  }
}

module.exports = new VideoService();
