import { apiInstanceAuth } from "../utils/axios";

export const getCategories = async () => {
  try {
    const response = await apiInstanceAuth.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

export const createCategory = async (data) => {
  try {
    const response = await apiInstanceAuth.post("/categories", data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await apiInstanceAuth.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    return null;
  }
};
