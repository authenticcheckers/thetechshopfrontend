import { CartItem as CartItemType } from "../types/CartItem";
import { useCart } from "../hooks/useCart";

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex justify-between items-center bg-neutral-800 p-3 rounded-lg mb-2">
      <div className="flex-1">
        <h3 className="font-bold">{item.name}</h3>
        <p className="text-sm">{item.specs}</p>
        <p className="text-sm">{item.price} GHS</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
          className="w-16 text-black p-1 rounded"
        />
        <button
          onClick={() => removeFromCart(item.id)}
          className="bg-red-600 text-white px-2 py-1 rounded"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
