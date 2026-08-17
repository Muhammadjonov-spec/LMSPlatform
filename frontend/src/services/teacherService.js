import { apiInstanceAuth } from "../utils/axios";

export const teacherService = {
  applyForTeacher: async (data) => {
    const res = await apiInstanceAuth.post("/teachers/apply", data);
    return res.data;
  },
  getPendingTeachers: async () => {
    const res = await apiInstanceAuth.get("/teachers/pending");
    return res.data;
  },
  approveTeacher: async (id) => {
    const res = await apiInstanceAuth.put(`/teachers/${id}/approve`);
    return res.data;
  }
};
