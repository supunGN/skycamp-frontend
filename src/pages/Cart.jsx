import React, { useState } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Button from "../components/atoms/Button";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import tentImg from "../assets/cart_images/tent.png";
import sleepingBagImg from "../assets/cart_images/sleeping_bag.png";
import gasImg from "../assets/cart_images/gas.png";
import chairImg from "../assets/cart_images/chair.png";

// Mock cart data (replace with API data in real app)
const initialCart = [
  {
    id: 1,
    name: "2-person tent",
    price: 1200,
    quantity: 1,
    image: tentImg,
  },
  {
    id: 2,
    name: "Sleeping bags",
    price: 1000,
    quantity: 1,
    image: sleepingBagImg,
  },
  {
    id: 3,
    name: "Double gas stove",
    price: 1500,
    quantity: 1,
    image: gasImg,
  },
  {
    id: 4,
    name: "Camping chair",
    price: 500,
    quantity: 1,
    image: chairImg,
  },
];

function CartTable({ cart, onQuantityChange, onRemove }) {
  return (
    <table className="w-full text-left border-separate border-spacing-y-4">
      <thead>
        <tr className="text-gray-500 text-sm">
          <th>Item Photo</th>
          <th>Product Name</th>
          <th>Price(per day)</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item) => (
          <tr key={item.id} className="bg-white shadow rounded-lg">
            <td className="py-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
            </td>
            <td className="font-medium">{item.name}</td>
            <td>LKR {item.price.toFixed(2)}</td>
            <td>
              <div className="flex items-center gap-2">
                <button
                  className="p-1 border rounded disabled:opacity-50"
                  onClick={() => onQuantityChange(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-6 text-center">{String(item.quantity).padStart(2, "0")}</span>
                <button
                  className="p-1 border rounded"
                  onClick={() => onQuantityChange(item.id, 1)}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </td>
            <td>LKR {(item.price * item.quantity).toFixed(2)}</td>
            <td>
              <button
                className="text-red-500 hover:text-red-700 text-xl"
                title="Remove"
                onClick={() => onRemove(item.id)}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OrderSummary({ total, advance }) {
  return (
    <div className="w-full lg:w-96 h-full flex flex-col lg:sticky lg:top-32">
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col h-full">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Total</span>
          <span className="font-semibold">LKR {total.toFixed(2)}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          You are only required to pay 50% of the total rental amount now as an advance. The remaining balance can be paid directly to the service provider upon receiving the items.
        </p>
        <div className="flex justify-between mb-2">
          <span className="font-semibold text-cyan-700">Total Advance Payment</span>
          <span className="font-semibold text-cyan-700">LKR {advance.toFixed(2)}</span>
        </div>
        <Button className="w-full mt-4" size="md" variant="primary">
          Make Advance Payment
        </Button>
      </div>
    </div>
  );
}

export default function Cart() {
  const [cart, setCart] = useState(initialCart);

  const handleQuantityChange = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const advance = total * 0.5;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 pt-32">
        <h1 className="text-3xl font-semibold mb-8">Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="flex-1">
            <CartTable cart={cart} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
          </div>
          <OrderSummary total={total} advance={advance} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
