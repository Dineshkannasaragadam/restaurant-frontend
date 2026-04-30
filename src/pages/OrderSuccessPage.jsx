import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Redirect to home if no orderId
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <>
      <Helmet>
        <title>Order Placed Successfully — Savori</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md mx-auto">

          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
            className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={56} className="text-green-500" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
              Order Placed! 🎉
            </h1>
            <p className="text-gray-500 mb-2">
              Your order has been confirmed successfully.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Sit back and relax — we'll have it delivered in about 45 minutes.
            </p>

            {/* Order ID Badge */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 shadow-card">
              <p className="text-xs text-gray-400 mb-1">Order ID</p>
              <p className="font-mono text-sm text-gray-700 break-all">{orderId}</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={`/orders/${orderId}`}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Package size={18} />
                Track My Order
              </Link>
              <Link
                to="/menu"
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <ArrowRight size={18} />
                Order More
              </Link>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-600 transition-colors mt-6"
            >
              <Home size={15} />
              Back to Home
            </Link>
          </motion.div>

        </div>
      </div>
    </>
  );
}