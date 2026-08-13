import apiInstance from "../utils/axios";

export const orderService = {
  createOrder: async (data) => {
    const res = await apiInstance.post("/orders/create", data);
    return res.data;
  },
  getPendingOrders: async () => {
    const res = await apiInstance.get("/orders/pending");
    return res.data;
  },
  approveOrder: async (id) => {
    const res = await apiInstance.put(`/orders/${id}/approve`);
    return res.data;
  }
};
