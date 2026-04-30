import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { orderAPI, paymentAPI } from '../services/api';

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;
const FREE_DELIVERY = 500;

// Load Razorpay script dynamically
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });
  const [instructions, setInstructions] = useState('');

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.price || item.product?.discountPrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  const deliveryFee = deliveryType === 'pickup' || subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (deliveryType === 'delivery') {
      if (!address.street || !address.city || !address.state || !address.pincode) {
        toast.error('Please fill in delivery address');
        return;
      }
      if (!/^\d{6}$/.test(address.pincode)) {
        toast.error('Invalid pincode');
        return;
      }
    }

    setLoading(true);
    try {
      // 1. Create order
      const orderItems = items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        variantId: item.variant?.variantId,
      }));

      const { data: orderData } = await orderAPI.create({
        items: orderItems,
        deliveryAddress: deliveryType === 'delivery' ? address : undefined,
        deliveryType,
        paymentMethod,
        specialInstructions: instructions,
      });

      const order = orderData.order;

      // 2. Handle payment
      if (paymentMethod === 'online') {
        const loaded = await loadRazorpay();
        if (!loaded) {
          toast.error('Failed to load payment gateway. Please try again.');
          setLoading(false);
          return;
        }

        const { data: paymentData } = await paymentAPI.createOrder(order._id);

        await new Promise((resolve, reject) => {
          const rzp = new window.Razorpay({
            key: paymentData.keyId,
            amount: paymentData.amount,
            currency: paymentData.currency,
            order_id: paymentData.razorpayOrderId,
            name: 'Athidhi Restaurant',
            description: `Order #${paymentData.orderNumber}`,
            image: '/logo.png',
            prefill: paymentData.prefill,
            theme: { color: '#FF6B35' },
            handler: async (response) => {
              try {
                // 3. Verify payment
                await paymentAPI.verify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  orderId: order._id,
                });
                clearCart(true);
                navigate(`/order-success/${order._id}`);
                resolve();
              } catch (err) {
                toast.error('Payment verification failed. Contact support.');
                reject(err);
              }
            },
            modal: {
              ondismiss: () => {
                toast.error('Payment cancelled');
                reject(new Error('Payment cancelled'));
              },
            },
          });
          rzp.open();
        });
      } else {
        // Cash on delivery
        clearCart(true);
        navigate(`/order-success/${order._id}`);
      }
    } catch (error) {
      if (error.message !== 'Payment cancelled') {
        toast.error(error.response?.data?.message || 'Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Checkout — Athidhi</title></Helmet>
      <div className="pt-24 pb-16">
        <div className="page-container">
          <h1 className="section-title mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Type */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-brand-600" /> Delivery Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'delivery', label: 'Home Delivery', icon: '🛵', desc: `₹${DELIVERY_FEE} fee (Free above ₹${FREE_DELIVERY})` },
                    { value: 'pickup', label: 'Self Pickup', icon: '🏪', desc: 'Pick up from restaurant' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDeliveryType(opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        deliveryType === opt.value
                          ? 'border-brand-600 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="font-semibold text-sm text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              {deliveryType === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="card p-6"
                >
                  <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-brand-600" /> Delivery Address
                  </h2>

                  {/* Saved addresses */}
                  {user?.addresses?.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {user.addresses.map((addr) => (
                        <button
                          key={addr._id}
                          onClick={() => setAddress({ street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, landmark: addr.landmark || '' })}
                          className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-brand-400 text-sm transition-colors"
                        >
                          <span className="font-medium">{addr.label}</span> — {addr.street}, {addr.city}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Street Address *</label>
                      <input className="input-field" placeholder="House/Flat no., Street, Area" value={address.street} onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                      <input className="input-field" placeholder="City" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                      <input className="input-field" placeholder="State" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Pincode *</label>
                      <input className="input-field" placeholder="6-digit pincode" maxLength={6} value={address.pincode} onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Landmark</label>
                      <input className="input-field" placeholder="Nearby landmark (optional)" value={address.landmark} onChange={(e) => setAddress((a) => ({ ...a, landmark: e.target.value }))} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-brand-600" /> Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'online', label: 'Pay Online', icon: '💳', desc: 'Cards, UPI, Netbanking' },
                    { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPaymentMethod(opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === opt.value ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="font-semibold text-sm text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Special Instructions</h2>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Allergy info, spice preference, delivery notes..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="font-display font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag size={18} /> Order Summary
                </h2>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto custom-scroll">
                  {items.map((item) => {
                    const price = item.variant?.price || item.product?.discountPrice || item.product?.price || 0;
                    return (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate flex-1 mr-2">{item.product?.name} × {item.quantity}</span>
                        <span className="font-medium flex-shrink-0">₹{(price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-600' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600"><span>Tax (GST 5%)</span><span>₹{tax.toFixed(2)}</span></div>
                  <div className="border-t pt-2 flex justify-between font-bold text-base text-gray-900">
                    <span>Total</span><span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || items.length === 0}
                  className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : paymentMethod === 'online' ? '💳 Pay ₹' + total.toFixed(2) : '✅ Place Order'}
                </button>

                {paymentMethod === 'online' && (
                  <p className="text-xs text-center text-gray-400 mt-3">
                    🔒 Secured by Razorpay — 256-bit SSL encryption
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
