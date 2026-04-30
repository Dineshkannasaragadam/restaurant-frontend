import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { adminAPI } from '../../services/api';

export default function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminAPI.getRevenueAnalytics({ days })
      .then(({ data: d }) => setData(d))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h2 className="text-xl font-bold text-gray-900">Analytics</h2><p className="text-sm text-gray-500">Revenue & order insights</p></div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${days === d ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <div className="loading-skeleton h-64 rounded-2xl" />
          <div className="loading-skeleton h-64 rounded-2xl" />
        </div>
      ) : data && (
        <>
          {/* Revenue Line Chart */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
            <h3 className="font-semibold text-gray-900 mb-4">Daily Revenue (₹)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tickFormatter={(d) => format(new Date(d), 'MMM d')} tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`₹${v.toFixed(2)}`, 'Revenue']} labelFormatter={(d) => format(new Date(d), 'MMM d, yyyy')} />
                <Line type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#FF6B35' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Bar Chart */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
            <h3 className="font-semibold text-gray-900 mb-4">Daily Order Count</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tickFormatter={(d) => format(new Date(d), 'MMM d')} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(d) => format(new Date(d), 'MMM d, yyyy')} />
                <Bar dataKey="orders" fill="#FF6B35" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Revenue */}
          {data.categoryRevenue?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue by Category</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.categoryRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="_id" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => [`₹${v.toFixed(2)}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#8B5CF6" fillOpacity={0.8} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
