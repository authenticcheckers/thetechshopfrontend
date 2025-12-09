import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const getProducts = async () => {
  const res = await axios.get(`${API_URL}/api/products/list`);
  return res.data.products;
};

export const getProductById = async (id: string) => {
  const res = await axios.get(`${API_URL}/api/products/${id}`);
  return res.data.product;
};
