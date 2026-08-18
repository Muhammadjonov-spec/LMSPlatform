import apiInstance, { apiInstanceAuth } from "../utils/axios";

export const getCourseReviews = async (courseId) => {
  return apiInstance.get(`/reviews/${courseId}`).then((res) => res.data);
};

export const createReview = async (courseId, data) => {
  return apiInstanceAuth.post(`/reviews/${courseId}`, data).then((res) => res.data);
};
