/**
 * App.jsx — Root component with all routes
 */

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';
import { initSocket, disconnectSocket } from './services/socket';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function App() {
  const { isAuthenticated, user, fetchProfile } = useAuthStore();
  const { syncToDatabase } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      syncToDatabase();
      const token = localStorage.getItem('accessToken');
      initSocket(token);
    } else {
      disconnectSocket();
    }
    return () => {};
  }, [isAuthenticated]);

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <motion.div {...pageVariants} transition={{ duration: 0.3 }}>
                <HomePage />
              </motion.div>
            }
          />
          <Route path="/menu" element={<motion.div {...pageVariants} transition={{ duration: 0.3 }}><MenuPage /></motion.div>} />
          <Route path="/menu/:slug" element={<motion.div {...pageVariants} transition={{ duration: 0.3 }}><ProductPage /></motion.div>} />
          <Route path="/about" element={<motion.div {...pageVariants} transition={{ duration: 0.3 }}><AboutPage /></motion.div>} />
          <Route path="/contact" element={<motion.div {...pageVariants} transition={{ duration: 0.3 }}><ContactPage /></motion.div>} />
          <Route path="/cart" element={<motion.div {...pageVariants} transition={{ duration: 0.3 }}><CartPage /></motion.div>} />

          {/* Auth routes */}
          <Route path="/signin" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

          {/* Protected routes */}
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/order-success/:orderId" element={<PrivateRoute><OrderSuccessPage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}
