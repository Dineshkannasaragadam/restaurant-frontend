import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AuthGatewayPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <Helmet><title>Sign In or Register — Athidhi</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-brand">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <span className="font-display font-bold text-2xl text-gray-900">Athidhi</span>
            </Link>
            <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">Welcome!</h1>
            <p className="text-gray-600">Continue to enjoy delicious food from Athidhi</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Sign In Option */}
            <motion.div variants={itemVariants}>
              <Link
                to="/login"
                className="card p-6 block hover:shadow-lg hover:border-brand-200 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                    <LogIn size={24} className="text-brand-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="font-semibold text-gray-900 text-lg">Sign In</h2>
                    <p className="text-sm text-gray-600">Access your existing account</p>
                  </div>
                  <span className="text-brand-600 text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>

            {/* Register Option */}
            <motion.div variants={itemVariants}>
              <Link
                to="/register"
                className="card p-6 block bg-brand-50 border-brand-200 hover:shadow-lg hover:bg-brand-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                    <UserPlus size={24} className="text-brand-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="font-semibold text-gray-900 text-lg">Create Account</h2>
                    <p className="text-sm text-gray-600">New to Athidhi? Join us today</p>
                  </div>
                  <span className="text-brand-600 text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Continue as Guest */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Want to explore?{' '}
              <Link to="/menu" className="text-brand-600 font-semibold hover:underline">
                Browse our menu
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
