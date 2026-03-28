import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

/**
 * LoginModal — shown when a guest user tries to add to cart or wishlist.
 * Gives them a chance to login without losing their context.
 */
const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  message = 'Please login to continue shopping',
}) => {
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Lock body scroll when visible
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Blurred dark background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in text-center"
        onClick={e => e.stopPropagation()} // Prevent backdrop click through
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors text-lg"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
          🛒
        </div>

        {/* Text */}
        <h2 className="text-lg font-extrabold text-gray-800 mb-2">
          Login Required
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {message}
          <br />
          <span className="text-primary-500 font-semibold">Login to add items to your cart!</span>
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Continue Browsing
          </button>
          <button
            onClick={() => { navigate('/login'); onClose(); }}
            className="flex-1 py-2.5 px-4 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 transition-colors shadow-md"
          >
            Login
          </button>
        </div>

        {/* Trust indicators */}
        <p className="text-[10px] text-gray-400 mt-4">
          🔒 Secure login · Your cart is saved after login
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
