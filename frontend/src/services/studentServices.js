import { apiInstanceAuth } from "../utils/axios";

export const getStudents = async () => apiInstanceAuth.get("/users/students").then((res) => res.data);

export const getDetailStudent = async (id) => apiInstanceAuth.get(`/users/students/${id}`).then((res) => res.data);

export const createStudents = async (data) =>
  apiInstanceAuth
    .post("/users/students", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => res.data);

export const updateStudents = async (data, id) =>
  apiInstanceAuth
    .put(`/users/students/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => res.data);

export const deleteStudent = async (id) => apiInstanceAuth.delete(`/users/students/${id}`).then((res) => res.data);

export const getCoursesStudents = async () => apiInstanceAuth.get("/users/students-courses").then((res) => res.data);
