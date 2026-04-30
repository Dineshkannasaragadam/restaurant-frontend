/**
 * AdminLayout — Sidebar + Topbar
 */

import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Tag, ClipboardList, Users,
  BarChart2, LogOut, Menu, X, ChevronRight, Bell
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: ShoppingBag },
  { label: 'Categories', path: '/admin/categories', icon: Tag },
  { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
];
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-gray-950 text-white flex flex-col fixed top-0 left-0 h-full z-40 overflow-hidden"
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between h-16">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🍽️</span>
                </div>
                <span className="font-display font-bold text-lg whitespace-nowrap">Athidhi restaurant</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scroll">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                title={!sidebarOpen ? label : ''}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  active ? 'bg-brand-600 text-white shadow-brand' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && sidebarOpen && (
                  <ChevronRight size={16} className="ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-800">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{user?.name?.charAt(0)}</span>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">Administrator</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={handleLogout}
            className={`mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-[72px]'}`}>
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <h1 className="font-semibold text-gray-900 capitalize">
              {navItems.find((n) => location.pathname === n.path || (n.path !== '/admin' && location.pathname.startsWith(n.path)))?.label || 'Admin'}
            </h1>
            <p className="text-xs text-gray-500">Restaurant Management Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full" />
            </button>
            <Link to="/" className="text-sm text-gray-600 hover:text-brand-600 flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-50">
              ← Back to Site
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
