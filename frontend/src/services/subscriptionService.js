import { apiInstanceAuth } from "../utils/axios";

export const getSubscriptions = async () => {
  try {
    const response = await apiInstanceAuth.get("/subscriptions");
    return response.data;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return null;
  }
};

export const updateSubscription = async (id, data) => {
  try {
    const response = await apiInstanceAuth.put(`/subscriptions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating subscription:", error);
    return null;
  }
};
