import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { useOrders } from '../hooks/useProducts';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-700' },
  ready: { label: 'Ready', color: 'bg-teal-100 text-teal-700' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
  const { orders, isLoading, meta } = useOrders({ limit: 10 });

  return (
    <>
      <Helmet><title>My Orders — Athidhi</title></Helmet>
      <div className="pt-24 pb-16">
        <div className="page-container max-w-3xl">
          <h1 className="section-title mb-2">My Orders</h1>
          <p className="text-gray-500 mb-8">{meta.total} total orders</p>

          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => <div key={i} className="loading-skeleton h-24 rounded-2xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Time to order something delicious!</p>
              <Link to="/menu" className="btn-primary">Browse Menu</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/orders/${order._id}`} className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow group">
                      <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={20} className="text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 text-sm">#{order.orderNumber}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {order.items.map((i) => i.name || 'Item').join(', ')}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={11} /> {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                          </span>
                          <span className="font-bold text-brand-600 text-sm">₹{order.pricing.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-brand-600 transition-colors flex-shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
