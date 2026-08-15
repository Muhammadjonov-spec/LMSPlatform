import apiInstance from "../utils/axios";

export const teacherService = {
  applyForTeacher: async (data) => {
    const res = await apiInstance.post("/teachers/apply", data);
    return res.data;
  },
  getPendingTeachers: async () => {
    const res = await apiInstance.get("/teachers/pending");
    return res.data;
  },
  approveTeacher: async (id) => {
    const res = await apiInstance.put(`/teachers/${id}/approve`);
    return res.data;
  }
};
