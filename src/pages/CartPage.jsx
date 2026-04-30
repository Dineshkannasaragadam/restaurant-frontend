import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;
const FREE_DELIVERY_ABOVE = 500;
export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.price || item.product?.discountPrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + deliveryFee + tax;
  const handleCheckout = () => {
    if (!isAuthenticated) { navigate('/signin?redirect=/checkout'); return; }
    navigate('/checkout');
  };
  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
          <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
            Browse Menu <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <Helmet><title>Cart — Athidhi</title></Helmet>
      <div className="pt-24 pb-16">
        <div className="page-container">
          <h1 className="section-title mb-8">Your Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => {
                  const price = item.variant?.price || item.product?.discountPrice || item.product?.price || 0;
                  const image = item.product?.images?.find((i) => i.isMain)?.url || item.product?.images?.[0]?.url;
                  return (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="card p-4 flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {image
                          ? <img src={image} alt={item.product?.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.product?.name}</h3>
                        {item.variant && (
                          <p className="text-xs text-gray-500 mb-1">{item.variant.name}</p>
                        )}
                        <p className="text-brand-600 font-bold">₹{price}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.productId, item.cartItemId, isAuthenticated)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.cartItemId, isAuthenticated)}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.cartItemId, isAuthenticated)}
                            className="w-7 h-7 rounded-lg bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="font-bold text-gray-900">₹{(price * item.quantity).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="font-display font-bold text-lg text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST 5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {subtotal < FREE_DELIVERY_ABOVE && (
                    <p className="text-xs text-brand-600 bg-brand-50 rounded-lg p-2">
                      Add ₹{(FREE_DELIVERY_ABOVE - subtotal).toFixed(0)} more for free delivery!
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <Link to="/menu" className="block text-center text-sm text-gray-500 hover:text-brand-600 mt-4 transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
