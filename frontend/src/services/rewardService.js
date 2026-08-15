import { apiInstanceAuth } from "../utils/axios";

export const getRewards = async () => {
  try {
    const response = await apiInstanceAuth.get("/rewards");
    return response.data;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return null;
  }
};
