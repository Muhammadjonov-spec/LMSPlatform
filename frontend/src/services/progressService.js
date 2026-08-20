import { apiInstanceAuth } from "../utils/axios";

export const getProgress = async (courseId) => {
  try {
    const res = await apiInstanceAuth.get(`/progress/${courseId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const markLessonCompleted = async (courseId, lessonId) => {
  try {
    const res = await apiInstanceAuth.post(`/progress/${courseId}/lesson/${lessonId}/complete`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
