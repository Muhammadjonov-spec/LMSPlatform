import { apiInstanceAuth } from "../utils/axios";

export const getStudents = async () => apiInstanceAuth.get("/students").then((res) => res.data);

export const getDetailStudent = async (id) => apiInstanceAuth.get(`/students/${id}`).then((res) => res.data);

export const createStudents = async (data) =>
  apiInstanceAuth
    .post("/students", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => res.data);

export const updateStudents = async (data, id) =>
  apiInstanceAuth
    .put(`/students/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => res.data);

export const deleteStudent = async (id) => apiInstanceAuth.delete(`/students/${id}`).then((res) => res.data);

export const getCoursesStudents = async () => apiInstanceAuth.get("/students-courses").then((res) => res.data);
