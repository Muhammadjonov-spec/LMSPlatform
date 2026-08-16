import { apiInstanceAuth } from "../utils/axios";

export const adminService = {
  getUsers: async () => {
    const res = await apiInstanceAuth.get("/users");
    return res.data;
  },
  createUser: async (data) => {
    const res = await apiInstanceAuth.post("/users", data);
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await apiInstanceAuth.put(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await apiInstanceAuth.delete(`/users/${id}`);
    return res.data;
  }
};
