// ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Email is required'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Forgot Password — Athidhi</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center"><span className="text-white text-xl">🍽️</span></div>
              <span className="font-display font-bold text-2xl text-gray-900">Athidhi</span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-gray-900">Forgot Password?</h1>
            <p className="text-gray-500 mt-1">Enter your email to get a reset link</p>
          </div>

          <div className="card p-8">
            {sent ? (
              <div className="text-center">
                <div className="text-5xl mb-4">📧</div>
                <h3 className="font-semibold text-gray-900 mb-2">Check your inbox</h3>
                <p className="text-gray-500 text-sm mb-4">We sent a password reset link to <strong>{email}</strong></p>
                <Link to="/login" className="btn-primary inline-block">Back to Sign In</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" placeholder="you@example.com" className="input-field pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
                </button>
                <Link to="/login" className="block text-center text-sm text-gray-500 hover:text-brand-600">← Back to Sign In</Link>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
