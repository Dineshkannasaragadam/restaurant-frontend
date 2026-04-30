import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Eye, Edit3, RefreshCw, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAdminOrders } from '../../hooks/useProducts';
import { orderAPI, paymentAPI } from '../../services/api';
import { onNewOrder } from '../../services/socket';
import { useEffect } from 'react';

const STATUS_OPTIONS = ['pending', 'confirmed', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const STATUS_LABEL = {
  pending: 'Pending', confirmed: 'Confirmed', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function AdminOrders() {
  const [filters, setFilters] = useState({ status: '', search: '', page: 1 });
  const [updatingId, setUpdatingId] = useState(null);
  const [collectingId, setCollectingId] = useState(null);
  const { orders, isLoading, meta, refetch } = useAdminOrders(filters);

  // Listen for new orders via socket
  useEffect(() => {
    const unsub = onNewOrder(() => { toast.success('New order received! 🎉', { icon: '🛵' }); refetch(); });
    return () => unsub?.();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success(`Order status updated to ${STATUS_LABEL[status]}`);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setUpdatingId(null); }
  };

  const handleCollectCodPayment = async (orderId) => {
    setCollectingId(orderId);
    try {
      await paymentAPI.collectCod(orderId);
      toast.success('COD payment collected!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Collection failed');
    } finally { setCollectingId(null); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500">{meta.total} total orders</p>
        </div>
        <button onClick={refetch} className="btn-ghost flex items-center gap-2 self-start">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9 !py-2 text-sm"
            placeholder="Search order number..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          />
        </div>
        <div className="relative">
          <select
            className="input-field !py-2 text-sm pr-8 appearance-none min-w-40"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="loading-skeleton h-5 rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">No orders found</td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-medium text-gray-900">#{order.orderNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-xs">{order.user?.name}</p>
                    <p className="text-gray-400 text-xs truncate max-w-32">{order.user?.email}</p>
                    <p className="text-gray-400 text-xs">{order.user?.phone || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">₹{order.pricing?.total?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.payment?.status === 'paid' ? 'bg-green-100 text-green-700' :
                      order.payment?.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.payment?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={updatingId === order._id || order.status === 'delivered' || order.status === 'cancelled'}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border-0 cursor-pointer appearance-none pr-6 ${STATUS_COLORS[order.status]} disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                      </select>
                      {updatingId === order._id && (
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{format(new Date(order.createdAt), 'MMM d, HH:mm')}</td>
                  <td className="px-4 py-3 flex gap-1.5 items-center">
                    {order.payment?.method === 'cod' && order.payment?.status === 'pending' && (
                      <button
                        onClick={() => handleCollectCodPayment(order._id)}
                        disabled={collectingId === order._id}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                        title="Collect COD Payment"
                      >
                        {collectingId === order._id ? (
                          <span className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <DollarSign size={15} />
                        )}
                      </button>
                    )}
                    <a href={`/orders/${order._id}`} target="_blank" rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors inline-flex text-gray-400 hover:text-brand-600">
                      <Eye size={15} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Page {filters.page} of {meta.pages} · {meta.total} orders</p>
            <div className="flex gap-1.5">
              {Array.from({ length: Math.min(meta.pages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilters((f) => ({ ...f, page: p }))}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    filters.page === p ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
