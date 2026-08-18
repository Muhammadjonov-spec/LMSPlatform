const VideoService = require('./video.service');
const fs = require('fs')
const CourseRepository=require("../repositories/CourseRepository")

class VideoQueueService {
  constructor() {
    this.queue = []
    this.isProcessing = false
  }
  addJob(courseId, moduleId, lessonId, inputPath, outputFolder){
    this.queue.push({ courseId, moduleId, lessonId, inputPath, outputFolder })
    if (!this.isProcessing) {
      this.processQueue()
    }
  }

   async processQueue(){
    if(this.queue.length===0){
      this.isProcessing=false
      return
    }
    this.isProcessing=true
    const job=this.queue.shift()
    try {
      const hlsUrl=await VideoService.convertToHls(job.inputPath, job.outputFolder)
      await CourseRepository.updateLessonStatus(job.courseId, job.moduleId, job.lessonId, hlsUrl, "ready")
    } catch (error) {
      console.error("Video processing failed:", error);
      await CourseRepository.updateLessonStatus(job.courseId, job.moduleId, job.lessonId, null, "failed")
      if (fs.existsSync(job.inputPath)) {
        fs.unlinkSync(job.inputPath);
      }
    }

    this.processQueue()
   }
}

module.exports = new VideoQueueService()