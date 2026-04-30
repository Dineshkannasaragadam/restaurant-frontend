/**
 * ProductCard — Reusable menu item card
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, ShoppingCart, Heart, Flame } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

function VegBadge({ type }) {
  const config = {
    veg: { dot: 'bg-green-500', label: 'Veg', border: 'border-green-500' },
    'non-veg': { dot: 'bg-red-500', label: 'Non-Veg', border: 'border-red-500' },
    vegan: { dot: 'bg-green-400', label: 'Vegan', border: 'border-green-400' },
    egg: { dot: 'bg-yellow-500', label: 'Egg', border: 'border-yellow-500' },
  };
  const c = config[type] || config.veg;
  return (
    <span className={`inline-flex items-center gap-1 border ${c.border} rounded px-1.5 py-0.5`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      <span className={`text-xs font-medium`} style={{ color: c.dot.replace('bg-', '').replace('-500', '') }}>
        {c.label}
      </span>
    </span>
  );
}

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const mainImage = product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url;
  const effectivePrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart) return;
    setAddingToCart(true);
    await addItem(product, 1, null, isAuthenticated);
    setAddingToCart(false);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card group overflow-hidden"
    >
      <Link to={`/menu/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-brand-50">🍽️</div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          >
            <Heart size={14} fill={isWishlisted ? '#ef4444' : 'none'} stroke={isWishlisted ? '#ef4444' : '#666'} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {hasDiscount && (
              <span className="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {product.discountPercent}% OFF
              </span>
            )}
            {product.isPopular && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame size={10} /> Popular
              </span>
            )}
            {product.isNewItem && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>
            )}
          </div>

          {/* Quick add to cart */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.isAvailable || addingToCart}
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.02 }}
            className="absolute bottom-3 left-3 right-3 bg-brand-600 text-white py-2 px-4 rounded-xl text-sm font-semibold
                       opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {addingToCart ? (
              <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingCart size={15} />
            )}
            {addingToCart ? 'Adding...' : product.isAvailable ? 'Add to Cart' : 'Unavailable'}
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1 group-hover:text-brand-600 transition-colors">
              {product.name}
            </h3>
            <VegBadge type={product.type} />
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-gray-900">₹{effectivePrice}</span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              {product.rating.count > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={11} fill="#FBBF24" stroke="#FBBF24" />
                  {product.rating.average}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {product.preparationTime}m
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
