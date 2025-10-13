"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/Loading";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Shield, Truck } from "lucide-react";

// Fake cart data for demonstration
const fakeCartItems = [
  {
    id: "1",
    productId: "prod1",
    productName: "Turbocharger Upgrade Kit",
    productDescription:
      "High-performance turbocharger kit for improved acceleration and power output",
    productImageUrl: "/car-sketch/porsche-gt3-rs-2021.png",
    unitPriceCents: 29999, // $299.99
    quantity: 1,
    totalPriceCents: 29999,
  },
  {
    id: "2",
    productId: "prod2",
    productName: "Sport Exhaust System",
    productDescription: "Stainless steel exhaust system with improved flow and aggressive sound",
    productImageUrl: "/car-sketch/porsche-gt3-rs-2021.png",
    unitPriceCents: 15999, // $159.99
    quantity: 2,
    totalPriceCents: 31998,
  },
  {
    id: "3",
    productId: "prod3",
    productName: "Performance Brake Pads",
    productDescription: "Ceramic brake pads designed for high-performance driving conditions",
    productImageUrl: "/car-sketch/porsche-gt3-rs-2021.png",
    unitPriceCents: 8999, // $89.99
    quantity: 1,
    totalPriceCents: 8999,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(fakeCartItems);
  const [isLoading, setIsLoading] = useState(false);

  const subtotalCents = cartItems.reduce((acc, item) => acc + item.totalPriceCents, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      // Update quantity
      setIsLoading(true);
      setTimeout(() => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: newQuantity,
                  totalPriceCents: item.unitPriceCents * newQuantity,
                }
              : item
          )
        );
        setIsLoading(false);
      }, 500);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsLoading(false);
      alert("Checkout functionality would be implemented here!");
    }, 1000);
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="max-w-7xl mx-auto h-full w-full px-4 py-8 ">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text1)] mb-2 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" />
          Shopping Cart
        </h1>
        <p className="text-[var(--text2)]">
          {itemCount > 0
            ? `${itemCount} item${itemCount > 1 ? "s" : ""} in your cart`
            : "Your cart is empty"}
        </p>
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="bg-[var(--bg-dark3)] rounded-full p-6 mb-6">
            <ShoppingCart className="w-16 h-16 text-[var(--text2)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text1)] mb-2">Your cart is empty</h2>
          <p className="text-[var(--text2)] mb-6 max-w-md">
            Looks like you haven&apos;t added any items to your cart yet. Start browsing our
            marketplace to find amazing mods for your vehicle.
          </p>
          <Button className="px-8 py-3">Continue Shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[var(--bg-dark3)] border border-[var(--bg-dark1)] rounded-lg overflow-hidden">
              <div className="p-6 border-b border-[var(--bg-dark1)]">
                <h2 className="text-xl font-semibold text-[var(--text1)]">Cart Items</h2>
              </div>

              <div className="divide-y divide-[var(--bg-dark1)]">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-[var(--bg-dark2)] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-[var(--bg-dark2)] rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.productImageUrl}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-[var(--text1)] mb-1 truncate">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-[var(--text2)] line-clamp-2">
                          {item.productDescription}
                        </p>
                        <div className="text-lg font-bold text-[var(--highlight)] mt-2">
                          {formatPrice(item.unitPriceCents)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-[var(--bg-dark2)] rounded-lg border border-[var(--bg-dark1)]">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-[var(--bg-dark1)]"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={isLoading}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-3 text-sm font-medium text-[var(--text1)] min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-[var(--bg-dark1)]"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[var(--text2)] hover:text-red-400 hover:bg-red-400/10"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-[var(--text1)]">
                          {formatPrice(item.totalPriceCents)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Clear Cart */}
              <div className="p-6 border-t border-[var(--bg-dark1)]">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={isLoading || cartItems.length === 0}
                  className="text-red-400 border-red-400/20 hover:bg-red-400/10 hover:border-red-400/40"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--bg-dark3)] border border-[var(--bg-dark1)] rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-[var(--text1)] mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text2)]">Subtotal ({itemCount} items)</span>
                  <span className="text-[var(--text1)] font-medium">
                    {formatPrice(subtotalCents)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--text2)]">Shipping</span>
                  <span className="text-[var(--text2)]">Calculated at checkout</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--text2)]">Tax</span>
                  <span className="text-[var(--text2)]">Calculated at checkout</span>
                </div>

                <div className="border-t border-[var(--bg-dark1)] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[var(--text1)]">Total</span>
                    <span className="text-xl font-bold text-[var(--highlight)]">
                      {formatPrice(subtotalCents)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  className="w-full py-3 text-base font-semibold"
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loading size="sm" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Proceed to Checkout
                    </div>
                  )}
                </Button>

                <Button variant="outline" className="w-full" disabled={isLoading}>
                  Continue Shopping
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-[var(--text2)]">
                  <Shield className="w-4 h-4 text-[var(--green)]" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--text2)]">
                  <Truck className="w-4 h-4 text-[var(--highlight)]" />
                  <span>Free shipping on orders over $500</span>
                </div>
              </div>

              {/* Placeholder for future features */}
              <div className="mt-6 p-4 bg-[var(--bg-dark2)] rounded-lg border border-[var(--bg-dark1)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--bg-dark1)] rounded-full flex items-center justify-center">
                    <span className="text-[var(--text2)] text-sm">%</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text1)]">Discount Code</div>
                    <div className="text-xs text-[var(--text2)]">Enter code at checkout</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[var(--bg-dark3)] border border-[var(--bg-dark1)] rounded-lg p-6">
            <Loading size="lg" text="Updating cart..." />
          </div>
        </div>
      )}
    </div>
  );
}
