import { useCart } from "../hooks/useCart";
import CartItem from "../components/CartItem";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Checkout() {
  const { cart, getTotal } = useCart();

  if (cart.length === 0)
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center">
        <h2>Your cart is empty</h2>
      </div>
    );

  const handlePayment = async () => {
    // Here you can integrate Stripe / Paystack / MoMo
    alert(`Total to pay: ${getTotal()} GHS`);
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
        <h2 className="text-xl font-bold mt-6">Total: {getTotal()} GHS</h2>
        <button
          onClick={handlePayment}
          className="bg-blue-600 px-4 py-2 rounded mt-4 hover:bg-blue-500"
        >
          Pay Now
        </button>
      </div>
      <Footer />
    </div>
  );
}
