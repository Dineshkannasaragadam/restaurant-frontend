import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, CheckCircle, Loader, Bike, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useOrder } from '../hooks/useProducts';
import { trackOrder, stopTrackingOrder, onOrderUpdate } from '../services/socket';
import { format } from 'date-fns';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📋', desc: 'We received your order' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Order confirmed by restaurant' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳', desc: 'Chef is making your food' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵', desc: 'Rider is on the way' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Enjoy your meal!' },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { order, setOrder, isLoading, error } = useOrder(id);
  const [liveStatus, setLiveStatus] = useState(null);

  useEffect(() => {
    if (!id) return;
    trackOrder(id);
    const unsubscribe = onOrderUpdate((update) => {
      if (update.orderId === id) {
        setLiveStatus(update.status);
        setOrder((prev) => prev ? { ...prev, status: update.status } : prev);
      }
    });
    return () => { stopTrackingOrder(id); unsubscribe?.(); };
  }, [id]);

  const currentStatus = liveStatus || order?.status;
  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  if (isLoading) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="pt-24 min-h-screen flex items-center justify-center text-center">
      <div><div className="text-5xl mb-4">😔</div><h2 className="font-display font-bold text-xl mb-2">Order not found</h2><Link to="/orders" className="btn-primary">View All Orders</Link></div>
    </div>
  );

  return (
    <>
      <Helmet><title>Order {order.orderNumber} — Savori</title></Helmet>
      <div className="pt-24 pb-16">
        <div className="page-container max-w-3xl">
          <div className="mb-6">
            <Link to="/orders" className="text-brand-600 hover:underline text-sm">← My Orders</Link>
            <h1 className="section-title mt-1">Order #{order.orderNumber}</h1>
            <p className="text-gray-500 text-sm">{format(new Date(order.createdAt), 'PPP p')}</p>
          </div>

          {/* Live tracking */}
          {order.status !== 'cancelled' && (
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Order Tracking</h2>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200">
                  <motion.div
                    className="w-full bg-brand-600 origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1) }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                </div>

                <div className="space-y-6">
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={step.key} className="flex items-center gap-4 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-lg transition-all duration-500 ${
                          isDone ? 'bg-brand-600 shadow-brand scale-110' : 'bg-gray-100'
                        } ${isCurrent ? 'ring-4 ring-brand-200' : ''}`}>
                          {step.icon}
                        </div>
                        <div className={`transition-all ${isDone ? 'opacity-100' : 'opacity-40'}`}>
                          <p className={`font-semibold text-sm ${isCurrent ? 'text-brand-700' : 'text-gray-900'}`}>
                            {step.label} {isCurrent && <span className="text-xs font-normal text-brand-500">(Current)</span>}
                          </p>
                          <p className="text-xs text-gray-500">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Cancelled notice */}
          {order.status === 'cancelled' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="font-semibold text-red-800">❌ Order Cancelled</p>
              {order.cancellationReason && <p className="text-sm text-red-600 mt-1">{order.cancellationReason}</p>}
            </div>
          )}

          {/* Items */}
          <div className="card p-6 mb-4">
            <h2 className="font-semibold text-gray-900 mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{item.name}</p>
                    {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-500">×{item.quantity}</p>
                    <p className="font-semibold">₹{item.subtotal?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.pricing.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.pricing.deliveryFee === 0 ? 'FREE' : `₹${order.pricing.deliveryFee}`}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>₹{order.pricing.tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-1 border-t"><span>Total</span><span>₹{order.pricing.total.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="card p-5 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><MapPin size={16} className="text-brand-600" /> Delivery Address</h3>
              <p className="text-sm text-gray-600">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
              </p>
            </div>
          )}

          {/* Payment */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Method</span>
              <span className="font-medium capitalize">{order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium capitalize px-2 py-0.5 rounded-full text-xs ${
                order.payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                order.payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {order.payment.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
