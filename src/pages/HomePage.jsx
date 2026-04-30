/**
 * HomePage — Hero, Features, Featured Products, CTA
 */

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Clock, Shield, Truck, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/menu/ProductCard';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax BG */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-brand-900" />
        {/* Decorative blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 page-container text-center py-32">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          {/* Pill badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-600/20 border border-brand-500/30 rounded-full text-brand-400 text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              Now delivering in your city
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight"
          >
            Fine Food,{' '}
            <span className="gradient-text">Delivered</span>
            {' '}Fresh
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            From our kitchen to your doorstep — artisanal dishes crafted with the finest ingredients, delivered in under 45 minutes.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/menu" className="btn-primary flex items-center gap-2 text-base !px-8 !py-4">
              Order Now <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-ghost text-white/80 hover:text-white hover:bg-white/10 !text-base flex items-center gap-2">
              Explore Menu <ChevronDown size={18} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            {[
              { value: '4.9★', label: 'Rating' },
              { value: '45min', label: 'Delivery' },
              { value: '10K+', label: 'Happy Customers' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-display font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown size={24} className="text-white/40" />
      </motion.div>
    </section>
  );
}

function FeatureStrip() {
  const features = [
    { icon: <Truck size={22} />, title: 'Free Delivery', desc: 'On orders above ₹200' },
    { icon: <Clock size={22} />, title: 'Fast & Fresh', desc: 'Delivered in 45 minutes' },
    { icon: <Star size={22} />, title: 'Top Rated', desc: '4.9★ from 10,000+ reviews' },
    { icon: <Shield size={22} />, title: 'Safe & Hygienic', desc: 'FSSAI certified kitchen' },
  ];

  return (
    <section className="py-12 bg-brand-600">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-white"
            >
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <div className="font-semibold text-sm">{title}</div>
                <div className="text-xs text-brand-100">{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  const { products, isLoading } = useProducts({ featured: 'true', limit: 8 });

  return (
    <section className="py-20">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-wider">Chef's Selection</span>
            <h2 className="section-title mt-1">Featured Dishes</h2>
          </div>
          <Link to="/menu" className="btn-ghost hidden md:flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="loading-skeleton h-72 rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link to="/menu" className="btn-secondary inline-flex items-center gap-2">
            View All Menu <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryStrip() {
  const categories = [
    { name: 'Starters', icon: '🥗', color: 'bg-green-50 border-green-200', slug: 'starters' },
    { name: 'Main Course', icon: '🍛', color: 'bg-orange-50 border-orange-200', slug: 'main-course' },
    { name: 'Beverages', icon: '🥤', color: 'bg-blue-50 border-blue-200', slug: 'drinks' },
    { name: 'Desserts', icon: '🍰', color: 'bg-pink-50 border-pink-200', slug: 'desserts' },
    { name: 'Biryani', icon: '🍚', color: 'bg-yellow-50 border-yellow-200', slug: 'biryani' },
    { name: 'Pizza', icon: '🍕', color: 'bg-red-50 border-red-200', slug: 'pizza' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-brand-600 text-sm font-semibold uppercase tracking-wider">Browse by</span>
          <h2 className="section-title mt-1">Category</h2>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(({ name, icon, color, slug }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/menu?category=${slug}`}
                className={`card border ${color} p-5 flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform duration-200 group`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
                <span className="text-xs font-semibold text-gray-700 text-center">{name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="page-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Ready to Order? 🍽️
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of happy customers enjoying restaurant-quality meals at home.
          </p>
          <Link to="/menu" className="btn-primary text-base !px-10 !py-4 inline-flex items-center gap-2">
            Order Now <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Athidhi Family Restaurant</title>
        <meta name="description" content="Order fresh, delicious food online. Fast delivery, easy ordering, amazing taste." />
      </Helmet>
      <HeroSection />
      <FeatureStrip />
      <FeaturedSection />
      <CategoryStrip />
      <CTASection />
    </>
  );
}
