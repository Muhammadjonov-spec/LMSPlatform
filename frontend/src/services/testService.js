import apiInstance from "../utils/axios";

export const createTest = async (data) => {
  try {
    const res = await apiInstance.post("/tests", data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTest = async (testId, data) => {
  try {
    const res = await apiInstance.put(`/tests/${testId}`, data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTestForManager = async (courseId, moduleId) => {
  try {
    const res = await apiInstance.get(`/tests/manager/${courseId}/${moduleId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTestForStudent = async (testId) => {
  try {
    const res = await apiInstance.get(`/tests/student/${testId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const submitTest = async (testId, answers) => {
  try {
    const res = await apiInstance.post(`/tests/${testId}/submit`, { answers });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTestResult = async (resultId) => {
  try {
    const res = await apiInstance.get(`/tests/results/${resultId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
