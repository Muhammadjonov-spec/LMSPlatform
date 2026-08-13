import apiInstance from "../utils/axios";

export const adminService = {
  createAdmin: async (data) => {
    const res = await apiInstance.post("/admin/create", data);
    return res.data;
  }
};
