const ReviewRepository = require("../repositories/ReviewRepository");
const CourseRepository = require("../repositories/CourseRepository");
const UserRepository = require("../repositories/UserRepository");
const TeacherRepository = require("../repositories/TeacherRepository");
const AppError = require("../utils/AppError");

class ReviewService {
  async createReview(studentId, courseId, rating, comment) {
    const user = await UserRepository.findById(studentId);
    if (!user) throw new AppError(404, "Foydalanuvchi topilmadi");

    const isEnrolled = user.enrolledCourses.some(c => c.toString() === courseId.toString());
    if (!isEnrolled) {
      throw new AppError(403, "Siz bu kursni sotib olmagansiz. Izoh yozish mumkin emas");
    }

    const existingReview = await ReviewRepository.findOne({ studentId, courceId: courseId });
    if (existingReview) {
      throw new AppError(400, "Siz ushbu kursga allaqachon izoh bergansiz");
    }

    const review = await ReviewRepository.create({studentId, courceId: courseId, rating, comment})
    await this.updateCourseAverageRating(courseId);

    return review;
  }

  async updateCourseAverageRating(courseId) {
    const reviews = await ReviewRepository.find({ courceId: courseId })
    let sum = 0;
    reviews.forEach(r => sum += r.rating);
    const average = reviews.length > 0 ? (sum / reviews.length) : 0;
    const course = await CourseRepository.findById(courseId);
    if (course) {
      course.averageRating = average;
      await course.save()
      await this.updateTeacherAverageRating(course.teacher);
    }
  }

  async updateTeacherAverageRating(teacherId) {
    const courses = await CourseRepository.find({ teacher: teacherId });
    let sum = 0;
    let count = 0;
    
    courses.forEach(c => {
      if (c.averageRating > 0) {
        sum += c.averageRating;
        count++ }
    });
    
    const average = count > 0 ? (sum / count) : 0;
    const teacher = await TeacherRepository.findById(teacherId);
    if (teacher) {
      teacher.averageRating = average;
      await teacher.save();
    }
  }

  async getCourseReviews(courseId) {
    return await ReviewRepository.find({ courceId: courseId }, { populate: 'studentId' });
  }
}

module.exports = new ReviewService();
