import { apiInstanceAuth } from "../utils/axios";

export const getOverviews = async () => apiInstanceAuth.get("/overviews").then((res) => res.data);
