import { useState } from "react";
import { CartItem } from "../types/CartItem";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const getTotal = () =>
    cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, getTotal };
};
