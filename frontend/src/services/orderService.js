import apiInstance, { apiInstanceAuth } from "../utils/axios";

export const orderService = {
  createOrder: async (courseId, formData) => {
    const res = await apiInstanceAuth.post(`/orders/${courseId}/buy`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  },
  getPendingOrders: async () => {
    const res = await apiInstanceAuth.get("/orders/pending");
    return res.data;
  },
  approveOrder: async (id) => {
    const res = await apiInstanceAuth.put(`/orders/${id}/approve`);
    return res.data;
  }
};
