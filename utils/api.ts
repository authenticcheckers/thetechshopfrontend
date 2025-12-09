import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * PRODUCTS
 */
export const getProducts = async () => {
  const res = await axios.get(`${API_URL}/products/list`);
  return res.data.products;
};

export const getProductById = async (id: number | string) => {
  const res = await axios.get(`${API_URL}/products/${id}`);
  return res.data.product;
};

/**
 * ORDERS
 */
export const createOrder = async (orderData: any) => {
  const res = await axios.post(`${API_URL}/orders/create`, orderData);
  return res.data;
};
