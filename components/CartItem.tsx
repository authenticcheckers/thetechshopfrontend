import { useCart } from "../hooks/useCart";
import { CartItem as CartItemType } from "../types/CartItem";

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeFromCart } = useCart();

  return (
    <div className="flex justify-between items-center bg-neutral-800 p-3 rounded-lg mb-2">
      <span>{item.name}</span>
      <button
        onClick={() => removeFromCart(item.id)}
        className="bg-red-600 px-2 py-1 rounded text-white"
      >
        Remove
      </button>
    </div>
  );
}
