/**
 * MainLayout — Navbar + Footer wrapper
 */

import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Menu, X, User, LogOut, Package, ChevronDown,
  Search, Heart, Bell
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setUserMenuOpen(false); }, [location]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
              <span className="text-white text-lg">🍽️</span>
            </div>
            <span className={`font-display font-bold text-xl tracking-tight ${
              scrolled || !isHome ? 'text-gray-900' : 'text-white'
            }`}>
              Athidhi
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-brand-600 bg-brand-50'
                    : scrolled || !isHome
                    ? 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors group">
              <ShoppingCart size={22} className={scrolled || !isHome ? 'text-gray-700' : 'text-white'} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                    <span className="text-brand-700 font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''} ${scrolled || !isHome ? 'text-gray-500' : 'text-white/70'}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-50">
                        <p className="font-semibold text-sm text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-purple-700 hover:bg-purple-50 font-medium">
                            <span>⚡</span> Admin Panel
                          </Link>
                        )}
                        <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                          <User size={15} /> Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                          <Package size={15} /> My Orders
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 mt-1"
                        >
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/signin"
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                    scrolled || !isHome
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-5 !text-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isOpen
                ? <X size={20} className={scrolled || !isHome ? 'text-gray-700' : 'text-white'} />
                : <Menu size={20} className={scrolled || !isHome ? 'text-gray-700' : 'text-white'} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="page-container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-2 flex gap-2">
                  <Link to="/signin" className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium">Sign In</Link>
                  <Link to="/register" className="flex-1 btn-primary text-center !py-2.5">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 mt-20">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🍽️</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Athidhi</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Bringing the finest flavors to your doorstep. Fresh ingredients, masterful preparation, delivered with love.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Menu', 'About Us', 'Blog', 'Contact'].map((item) => (
                <li key={item}><a href="#" className="hover:text-brand-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Mosayyapeta, atchuthapuram, Atchutapuram, Andhra Pradesh 531011</li>
              <li>📞 +91 95054 64000</li>
              <li>✉️ hello@athidhi.in</li>
              <li>🕐 Mon–Sun: 10am–11pm</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Athidhi Restaurant. All rights reserved.</p>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
