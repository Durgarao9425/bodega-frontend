import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const CATEGORIES = [
  { name: 'All', path: '/products' },
  { name: 'Households', path: '/category/Households' },
  { name: 'Fruits & Vegetables', path: '/category/Fruits & Vegetables' },
  { name: 'Groceries', path: '/category/Groceries' },
  { name: 'Dry Fruits', path: '/category/Dry Fruits' },
  { name: 'Testing cat', path: '/category/Testing cat' },
];

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount, cart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Display name: prefer name, fall back to phone
  const displayName = user?.name?.trim() ? user.name : user?.phone ?? '';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    if (searchCategory === 'All') {
      navigate(`/products?search=${encodeURIComponent(q)}`);
    } else {
      navigate(`/category/${encodeURIComponent(searchCategory)}?search=${encodeURIComponent(q)}`);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="bg-[#007F2D] text-white sticky top-0 z-50 w-full shadow-md">

        {/* ── Main Nav Row ── */}
        <div className="w-full px-3 sm:px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">

          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] shrink-0"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Open menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex flex-col shrink-0 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex items-center">
              <span className="text-orange-500 font-extrabold text-2xl sm:text-3xl leading-none">B</span>
              <span className="text-white font-bold text-2xl sm:text-3xl leading-none tracking-tight">odegaa</span>
            </div>
            <span className="text-[8px] uppercase tracking-widest text-[#a7f3d0] font-bold hidden sm:block">BEST IN QUALITY</span>
          </Link>

          {/* Desktop Search */}
          <div className="flex-1 max-w-xl hidden md:block mx-4">
            <form onSubmit={handleSearch} className="flex bg-white rounded-md overflow-hidden h-10 shadow-sm">
              <select
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="bg-gray-50 text-gray-700 px-2 text-xs border-r border-gray-200 outline-none w-32 cursor-pointer font-medium"
              >
                {CATEGORIES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search for items..."
                className="flex-1 px-4 outline-none text-sm text-gray-800"
              />
              <button type="submit" className="bg-white px-4 text-gray-800 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" height="18" width="18">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">

            {/* Wishlist icon */}
            <Link to="/wishlist" className="hidden sm:flex items-center gap-1 hover:text-green-200 transition-colors relative">
              <div className="relative">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="22" width="22">
                  <path d="M20.8 4.6a5.5 5.5 0 00-7.7 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.8 1.1-1.1a5.5 5.5 0 000-7.7z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#007F2D]">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden lg:inline">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-1.5 hover:text-green-200 transition-colors">
              <div className="relative">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="22" width="22">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#007F2D]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                Cart{cart?.totalPrice ? <span className="ml-1 hidden lg:inline text-green-200">₹{cart.totalPrice}</span> : null}
              </span>
            </Link>

            {/* Profile / Login */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  onClick={() => { setShowUserMenu(v => !v); setShowNotifications(false); }}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white/40 overflow-hidden">
                    {user.name?.trim() ? user.name.charAt(0).toUpperCase() : user.phone.slice(-2)}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold hidden lg:block max-w-[100px] truncate">
                    {displayName}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[60] text-gray-800 overflow-hidden animate-fade-in">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                      <p className="text-xs text-gray-400 truncate">+91 {user.phone}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-b border-gray-50" onClick={() => setShowUserMenu(false)}>
                      <span>👤</span> My Profile
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-b border-gray-50" onClick={() => setShowUserMenu(false)}>
                      <span>❤️</span> Wishlist
                      {wishlistCount > 0 && <span className="ml-auto bg-red-100 text-red-500 text-xs font-bold px-1.5 py-0.5 rounded-full">{wishlistCount}</span>}
                    </Link>
                    <Link to="/cart" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-b border-gray-50" onClick={() => setShowUserMenu(false)}>
                      <span>🛒</span> My Cart
                      {cartCount > 0 && <span className="ml-auto bg-green-100 text-green-600 text-xs font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
                    </Link>
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="font-semibold hover:bg-white/20 transition-colors bg-white/10 px-4 py-1.5 rounded-full border border-white/30 text-xs sm:text-sm whitespace-nowrap">
                Login / Sign up
              </Link>
            )}
          </div>
        </div>

        {/* ── Mobile Search Bar ── */}
        <div className="md:hidden bg-[#006e27] px-3 pb-2 border-t border-green-900/30">
          <form onSubmit={handleSearch} className="flex bg-white rounded-lg overflow-hidden h-9 shadow-sm">
            <select
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              className="bg-gray-50 text-gray-700 text-xs border-r border-gray-200 outline-none px-2 w-24 cursor-pointer"
            >
              {CATEGORIES.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search for items..."
              className="flex-1 px-3 outline-none text-sm text-gray-800 min-w-0"
            />
            <button type="submit" className="bg-white px-4 text-gray-800 flex items-center justify-center hover:bg-gray-50">
              <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" height="18" width="18">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>
      </header>

      {/* ── Mobile Side Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl animate-slide-right overflow-y-auto">
            {/* Drawer header */}
            <div className="bg-[#007F2D] text-white p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <span className="text-orange-500 font-extrabold text-2xl leading-none">B</span>
                  <span className="text-white font-bold text-2xl leading-none">odegaa</span>
                </div>
                {user && <p className="text-[10px] text-green-200 mt-0.5">Hello, {displayName}!</p>}
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* User block (if logged in) */}
            {user && (
              <div className="px-4 py-3 bg-green-50 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#007F2D] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name?.trim() ? user.name.charAt(0).toUpperCase() : user.phone.slice(-2)}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{displayName}</p>
                  <p className="text-xs text-gray-500">+91 {user.phone}</p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-2 py-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold px-3 mb-2">Menu</p>
              {[
                { icon: '🏠', label: 'Home', path: '/' },
                { icon: '🛍️', label: 'All Products', path: '/products' },
                { icon: '❤️', label: 'My Wishlist', path: '/wishlist', badge: wishlistCount },
                { icon: '🛒', label: 'My Cart', path: '/cart', badge: cartCount },
                { icon: '👤', label: 'My Profile', path: '/profile' },
              ].map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-[#007F2D] transition-colors"
                >
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-[#007F2D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              <div className="border-t border-gray-100 mt-3 pt-3">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold px-3 mb-2">Categories</p>
                {CATEGORIES.filter(c => c.name !== 'All').map(cat => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#007F2D] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007F2D] shrink-0" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Bottom: Login/Logout */}
            <div className="p-4 border-t border-gray-100">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 font-bold text-sm py-3 rounded-xl hover:bg-red-100 transition-colors"
                >
                  🚪 Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#007F2D] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#006e27] transition-colors"
                >
                  Login / Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
