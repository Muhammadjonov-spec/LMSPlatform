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
  },
  rejectTeacher: async (id, reason) => {
    const res = await apiInstanceAuth.put(`/teachers/${id}/reject`, { reason });
    return res.data;
  },
  getTeacherProfile: async (id) => {
    const res = await apiInstanceAuth.get(`/teachers/${id}`);
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await apiInstanceAuth.put('/teachers/my-profile', data);
    return res.data;
  },
  getMyApplication: async () => {
    const res = await apiInstanceAuth.get('/teachers/my-application');
    return res.data;
  },
};
