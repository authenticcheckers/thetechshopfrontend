import axios from "axios";

export const getProducts = async () => {
  const res = await axios.get("/api/products");
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await axios.get(`/api/products/${id}`);
  return res.data;
};

export const createOrder = async (data: any) => {
  const res = await axios.post("/api/orders", data);
  return res.data;
};
