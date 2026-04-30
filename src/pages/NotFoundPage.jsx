import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found — Savori</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-9xl mb-6"
          >
            🍽️
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display font-bold text-6xl text-gray-900 mb-2">
              404
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Page Not Found
            </p>
            <p className="text-gray-400 mb-8">
              Looks like this dish isn't on our menu!
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              ← Go Home
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}