import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';


// ✅ SINGLE Field component (ONLY ONE — OUTSIDE)
const Field = ({
  label,
  name,
  type = 'text',
  icon: Icon,
  placeholder,
  value,
  onChange,
  error,
  showPass,
  onTogglePass
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>

    <div className="relative">
      <Icon
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type={type}
        placeholder={placeholder}
        className={`input-field pl-10 ${error ? 'border-red-400' : ''}`}
        value={value}
        onChange={onChange}
      />
      {/* 👁 Show/Hide Password */}
      {name === 'password' && (
        <button
          type="button"
          onClick={onTogglePass}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>

    {error && (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    )}
  </div>
);


export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};

    if (!form.name || form.name.length < 2)
      errs.name = 'Name must be at least 2 characters';

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Valid email required';

    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone))
      errs.phone = 'Valid Indian phone number required';

    if (!form.password || form.password.length < 8)
      errs.password = 'Password must be at least 8 characters';

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password =
        'Must include uppercase, lowercase, and number';

    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Registration failed'
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account — Athidhi</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-brand">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <span className="font-display font-bold text-2xl text-gray-900">
                Athidhi
              </span>
            </Link>

            <h1 className="font-display font-bold text-2xl text-gray-900">
              Create your account
            </h1>
            <p className="text-gray-500 mt-1">
              Start ordering in minutes
            </p>
          </div>

          {/* Form */}
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              <Field
                label="Full Name"
                name="name"
                icon={User}
                placeholder=" Doe"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                error={errors.name}
              />

              <Field
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                error={errors.email}
              />

              <Field
                label="Phone (optional)"
                name="phone"
                type="tel"
                icon={Phone}
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                error={errors.phone}
              />

              <Field
                label="Password"
                name="password"
                type={showPass ? 'text' : 'password'}
                icon={Lock}
                placeholder="Min 8 chars, upper+lower+number"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                error={errors.password}
                showPass={showPass}
                onTogglePass={() => setShowPass(!showPass)}
              />

              <Field
                label="Confirm Password"
                name="confirmPassword"
                type={showPass ? 'text' : 'password'}
                icon={Lock}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-brand-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}