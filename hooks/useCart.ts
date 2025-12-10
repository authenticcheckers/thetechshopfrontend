import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

import { CartItem } from '../types/CartItem';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };
  return { cart, addToCart };
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
