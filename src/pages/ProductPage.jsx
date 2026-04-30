import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Clock, Flame, ChevronLeft, Plus, Minus, Heart, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProducts';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const SPICE_LABELS = { none: 'Not Spicy', mild: 'Mild 🌶', medium: 'Medium 🌶🌶', hot: 'Hot 🌶🌶🌶', 'extra-hot': 'Extra Hot 🌶🌶🌶🌶' };

export default function ProductPage() {
  const { slug } = useParams();
  const { product, isLoading, error } = useProduct(slug);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addItem(product, quantity, selectedVariant, isAuthenticated);
    setAdding(false);
  };

  if (isLoading) return (
    <div className="pt-24 min-h-screen">
      <div className="page-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="loading-skeleton aspect-square rounded-3xl" />
          <div className="space-y-4">
            <div className="loading-skeleton h-10 rounded-xl w-3/4" />
            <div className="loading-skeleton h-6 rounded-xl w-1/2" />
            <div className="loading-skeleton h-24 rounded-xl" />
            <div className="loading-skeleton h-12 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="pt-24 min-h-screen flex items-center justify-center text-center">
      <div>
        <div className="text-6xl mb-4">😔</div>
        <h2 className="font-display font-bold text-xl mb-2">Product not found</h2>
        <Link to="/menu" className="btn-primary">Back to Menu</Link>
      </div>
    </div>
  );

  const mainImage = product.images?.[selectedImage]?.url || product.images?.[0]?.url;
  const effectivePrice = selectedVariant?.price || product.discountPrice || product.price;
  const hasDiscount = !selectedVariant && product.discountPrice && product.discountPrice < product.price;

  return (
    <>
      <Helmet>
        <title>{product.name} — Savori</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="page-container py-3 flex items-center gap-2 text-sm text-gray-500">
            <Link to="/menu" className="hover:text-brand-600 flex items-center gap-1">
              <ChevronLeft size={16} /> Menu
            </Link>
            <span>/</span>
            <Link to={`/menu?category=${product.category?.slug}`} className="hover:text-brand-600">
              {product.category?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>

        <div className="page-container py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Images */}
            <div>
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-4 shadow-card"
              >
                {mainImage ? (
                  <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">🍽️</div>
                )}
              </motion.div>

              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === idx ? 'border-brand-600 shadow-brand' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {/* Type & Category Badge */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Link
                  to={`/menu?category=${product.category?.slug}`}
                  className="text-xs bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-700 px-3 py-1 rounded-full font-medium transition-colors"
                >
                  {product.category?.icon || '🍴'} {product.category?.name}
                </Link>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold border rounded px-2 py-0.5 ${
                  product.type === 'veg' ? 'border-green-500 text-green-700' :
                  product.type === 'non-veg' ? 'border-red-500 text-red-700' :
                  product.type === 'vegan' ? 'border-green-400 text-green-700' :
                  'border-yellow-500 text-yellow-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    product.type === 'veg' ? 'bg-green-500' :
                    product.type === 'non-veg' ? 'bg-red-500' :
                    product.type === 'vegan' ? 'bg-green-400' :
                    'bg-yellow-500'
                  }`} />
                  {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                </span>
                {product.isPopular && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Flame size={10} /> Popular
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-3xl text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Meta */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                {product.rating.count > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={14} fill="#FBBF24" stroke="#FBBF24" />
                    <span className="font-semibold text-gray-900">{product.rating.average}</span>
                    <span>({product.rating.count} reviews)</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {product.preparationTime} min
                </span>
                {product.spiceLevel !== 'none' && (
                  <span>{SPICE_LABELS[product.spiceLevel]}</span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Choose Size</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedVariant(null)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        !selectedVariant ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Regular — ₹{product.discountPrice || product.price}
                    </button>
                    {product.variants.filter((v) => v.isAvailable).map((v) => (
                      <button
                        key={v._id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          selectedVariant?._id === v._id ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {v.name} — ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-display font-bold text-gray-900">₹{effectivePrice}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {product.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Quantity + Add to Cart */}
              {product.isAvailable ? (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 !py-4"
                  >
                    {adding ? (
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                    {adding ? 'Adding...' : `Add to Cart — ₹${(effectivePrice * quantity).toFixed(2)}`}
                  </motion.button>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                  <p className="text-red-700 font-medium text-center">Currently unavailable</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    wishlisted ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                  {wishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
                <button
                  onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 text-sm font-medium transition-all"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>

              {/* Ingredients & Allergens */}
              {(product.ingredients?.length > 0 || product.allergens?.length > 0) && (
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                  {product.ingredients?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Ingredients</p>
                      <p className="text-sm text-gray-500">{product.ingredients.join(', ')}</p>
                    </div>
                  )}
                  {product.allergens?.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-amber-800 mb-0.5">⚠️ Allergen Info</p>
                      <p className="text-xs text-amber-700">Contains: {product.allergens.join(', ')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Nutrition */}
              {product.nutrition && Object.values(product.nutrition).some(Boolean) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Nutrition (per serving)</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Calories', value: product.nutrition.calories, unit: 'kcal' },
                      { label: 'Protein', value: product.nutrition.protein, unit: 'g' },
                      { label: 'Carbs', value: product.nutrition.carbs, unit: 'g' },
                      { label: 'Fat', value: product.nutrition.fat, unit: 'g' },
                    ].filter((n) => n.value).map(({ label, value, unit }) => (
                      <div key={label} className="text-center bg-gray-50 rounded-xl p-3">
                        <p className="text-lg font-bold text-gray-900">{value}<span className="text-xs font-normal text-gray-500">{unit}</span></p>
                        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
