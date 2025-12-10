// hooks/useCart.ts
import { useState } from "react";
import { CartItem } from "../types/CartItem";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    // Increment quantity if already in cart
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const getTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, getTotal };
};
