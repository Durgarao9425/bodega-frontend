import React, { useState } from 'react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onRequestLogin?: () => void;
  simpleDisplay?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onRequestLogin, simpleDisplay }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, cart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  // FIX: Null-safe check — i.product could be null if product was deleted from DB
  const cartItem = cart?.items.find(i => i.product && i.product._id === product._id) ?? null;
  const isWished = isInWishlist(product._id);

  const handleAddToCart = async () => {
    if (!user) {
      // Show login modal if parent provides it, otherwise navigate
      if (onRequestLogin) onRequestLogin();
      else navigate('/login');
      return;
    }
    if (cartItem) return;
    try {
      setAdding(true);
      await addToCart(product._id, 1);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = () => {
    if (!user) {
      if (onRequestLogin) onRequestLogin();
      else navigate('/login');
      return;
    }
    toggleWishlist(product._id);
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://placehold.co/300x300/f0f9ff/0ea5e9?text=${encodeURIComponent(product.name.slice(0, 12))}`;
  };

  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative group">

      {/* Discount Badge */}
      {discountPct > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
          -{discountPct}%
        </div>
      )}

      {/* Wishlist Heart */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110"
        aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          fill={isWished ? '#ef4444' : 'none'}
          stroke={isWished ? '#ef4444' : '#9ca3af'}
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Product Image — clickable → product detail */}
      <div
        className="w-full h-36 sm:h-40 bg-gray-50 flex items-center justify-center p-3 cursor-pointer overflow-hidden"
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImgError}
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col px-3 pb-3 pt-2">
        {/* Category tag */}
        {!simpleDisplay && (
          <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1 truncate">
            {product.subcategory || product.category}
          </span>
        )}

        {/* Product name */}
        <h3
          className="text-xs sm:text-[13px] font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-primary-500 leading-snug mb-1"
          onClick={() => navigate(`/products/${product._id}`)}
        >
          {product.name}
        </h3>

        {!simpleDisplay && (
          <>
            {/* Unit/weight */}
            <p className="text-[10px] text-gray-400 mb-2">{product.unit}</p>

            {/* Price row */}
            <div className="flex items-baseline gap-2 mt-auto mb-2">
              <span className="text-primary-500 font-extrabold text-base sm:text-lg leading-none">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-gray-400 line-through text-xs">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Add to Cart / Quantity Controls */}
            {product.stock === 0 ? (
              <button
                disabled
                className="w-full h-9 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg cursor-not-allowed"
              >
                Out of Stock
              </button>
            ) : cartItem ? (
              /* Quantity stepper — shown when item is already in cart */
              <div className="flex items-center border-2 border-primary-500 rounded-lg overflow-hidden h-9 w-full">
                <button
                  onClick={() => updateQuantity(cartItem.product._id, cartItem.quantity - 1)}
                  className="flex-1 h-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold text-sm flex items-center justify-center transition-colors"
                  aria-label="Decrease"
                >
                  {cartItem.quantity <= 1 ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M3 6h18v2H3V6zm3 4h12l-1.5 9H7.5L6 10z" /></svg>
                  ) : '−'}
                </button>
                <span className="flex-none w-10 text-center text-sm font-extrabold text-primary-500">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(cartItem.product._id, cartItem.quantity + 1)}
                  disabled={cartItem.quantity >= product.stock}
                  className="flex-1 h-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold text-sm flex items-center justify-center transition-colors disabled:opacity-40"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
            ) : (
              /* Add to cart button */
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full h-9 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70"
              >
                {adding ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    Add
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
