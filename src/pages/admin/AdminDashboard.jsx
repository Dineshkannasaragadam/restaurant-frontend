import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingBag, Users, DollarSign, Package,
  ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { format } from 'date-fns';
import { useDashboard } from '../../hooks/useProducts';

const STATUS_COLORS = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  preparing: '#F97316',
  ready: '#14B8A6',
  out_for_delivery: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

function StatCard({ title, value, icon: Icon, change, prefix = '', color = 'brand' }) {
  const isPositive = change >= 0;
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{title}</p>
    </motion.div>
  );
}

const STATUS_LABEL = {
  pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
  ready: 'Ready', out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function AdminDashboard() {
  const { dashboard, isLoading } = useDashboard();

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => <div key={i} className="h-28 loading-skeleton rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array(2).fill(0).map((_, i) => <div key={i} className="h-72 loading-skeleton rounded-2xl" />)}
      </div>
    </div>
  );

  if (!dashboard) return null;

  const { stats, topProducts, recentOrders, charts } = dashboard;

  // Prepare pie data for order status
  const pieData = Object.entries(charts.ordersByStatus || {})
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_LABEL[status] || status,
      value: count,
      color: STATUS_COLORS[status] || '#9CA3AF',
    }));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={stats.totalRevenue} prefix="₹" icon={DollarSign} color="green" />
        <StatCard title="Today's Revenue" value={stats.todayRevenue} prefix="₹" icon={TrendingUp} color="brand" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="blue" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="purple" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Today's Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">New Users Today</p>
          <p className="text-2xl font-bold text-gray-900">{stats.newUsersToday}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Active Products</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={charts.dailyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tickFormatter={(d) => format(new Date(d), 'MMM d')} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [`₹${v.toFixed(2)}`, 'Revenue']}
                labelFormatter={(d) => format(new Date(d), 'MMM d, yyyy')}
              />
              <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2.5} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status Pie */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
          <h3 className="font-semibold text-gray-900 mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name) => [v, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {pieData.slice(0, 4).map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold text-gray-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Top Selling Items</h3>
            <Link to="/admin/products" className="text-xs text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {topProducts?.map((product, i) => (
              <div key={product._id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-50 flex-shrink-0">
                  {product.images?.[0]?.url
                    ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.totalOrders} orders · ₹{product.price}</p>
                </div>
                <div className="text-xs text-amber-600 font-semibold flex items-center gap-0.5 flex-shrink-0">
                  ★ {product.rating?.average || '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package size={16} className="text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      STATUS_COLORS[order.status] ? `bg-opacity-10` : ''
                    }`} style={{
                      background: (STATUS_COLORS[order.status] || '#9CA3AF') + '20',
                      color: STATUS_COLORS[order.status] || '#9CA3AF',
                    }}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-xs text-gray-500 truncate">{order.user?.name}</p>
                    <p className="text-xs font-semibold text-gray-900">₹{order.pricing?.total?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
