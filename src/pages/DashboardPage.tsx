import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import LoginModal from '../components/LoginModal';
import api from '../services/api';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

// ── Verified working Unsplash images for category cards ──
const HERO_CATEGORIES = [
  {
    name: 'Households',
    path: '/category/Households',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500&h=380',
    bg: '#f0fdf4',
  },
  {
    name: 'Fruits & Vegetables',
    path: '/category/Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500&h=380',
    bg: '#fffbeb',
  },
  {
    name: 'Groceries',
    path: '/category/Groceries',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=500&h=380',
    bg: '#fdf4ff',
  },
  {
    name: 'Dry Fruits',
    path: '/category/Dry Fruits',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=500&h=380',
    bg: '#fff7ed',
  },
  {
    name: 'Testing cat',
    path: '/category/Testing cat',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=500&h=380',
    bg: '#eff6ff',
  },
];

const SECTIONS = [
  {
    title: 'Groceries',
    items: [
      { name: 'Aata, maida, besan & sooji', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=500&h=400&fit=crop' },
      { name: 'Dals, Pulses & Grains', img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=500&h=400&fit=crop' },
      { name: 'Masala & Spices', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&h=400&fit=crop' },
      { name: 'Oil & Ghee', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=500&h=400&fit=crop' },
      { name: 'Rice, Poha & Sabhudana', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=500&h=400&fit=crop' },
    ],
  },
  {
    title: 'Households',
    items: [
      { name: 'Breakfast & cereals', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=500&h=400&fit=crop' },
      { name: 'Detergents & Cleaning', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=500&h=400&fit=crop' },
      { name: 'Facewash & skincare', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&h=400&fit=crop' },
      { name: 'Hair care', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500&h=400&fit=crop' },
      { name: 'Oral care', img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=500&h=400&fit=crop' },
      { name: 'Pasta & noodles', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=500&h=400&fit=crop' },
      { name: 'Soaps & body wash', img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=500&h=400&fit=crop' },
    ]
  },
  {
    title: 'Fruits & Vegetables',
    items: [
      { name: 'Fruits', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500&h=400&fit=crop' },
      { name: 'Vegetables', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=500&h=400&fit=crop' },
      { name: 'Fresh Fruits', img: 'https://images.unsplash.com/photo-1457296898342-cdd24585d095?q=80&w=500&h=400&fit=crop' },
    ]
  },
  {
    title: 'Testing cat',
    items: [
      { name: 'Other Items', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=500&h=400&fit=crop' }
    ]
  }
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/products')
      .then(r => setFeaturedProducts(r.data.products || []))
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, []);

  // Working carousel nav
  const scrollCarousel = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'right' ? 900 : -900, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="You need to be logged in to add items to your cart or wishlist."
      />

      {/* ── HERO BANNER ── */}
      <section className="bg-[#007F2D] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white z-10 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block mb-4">
              🚀 Fast Delivery · Fresh Every Day
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-3">
              Fresh Groceries<br />
              <span className="text-yellow-300">Delivered in 30 Minutes!</span>
            </h1>
            <p className="text-green-100 text-sm md:text-base mb-6 max-w-md">
              Order fresh fruits, vegetables, dairy & thousands of daily essentials right to your door.
            </p>
            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              <button
                onClick={() => navigate('/products')}
                className="bg-white text-[#007F2D] font-extrabold px-7 py-3 rounded-xl hover:bg-yellow-300 transition-all shadow-lg text-sm"
              >
                Shop Now →
              </button>
              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="border-2 border-white/60 text-white font-bold px-7 py-3 rounded-xl hover:bg-white/10 transition-all text-sm"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>

          {/* Stats pills — desktop only */}
          <div className="hidden md:flex flex-col gap-3 z-10">
            {[
              { emoji: '⚡', label: '30 Min Delivery' },
              { emoji: '🥬', label: 'Farm Fresh' },
              { emoji: '💰', label: 'Best Prices' },
              { emoji: '🛡️', label: '100% Genuine' },
            ].map(s => (
              <div key={s.label} className="bg-white/15 border border-white/25 backdrop-blur rounded-xl px-5 py-3 flex items-center gap-3 text-white">
                <span className="text-2xl">{s.emoji}</span>
                <span className="font-bold text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* decorative blobs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      <main className="max-w-[1600px] ml-0 px-4 sm:px-6 md:px-10 py-8">

        {/* ── HERO CATEGORY CARDS (scroll) ── */}
        <section className="mb-12">
          <div className="text-center mb-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">View Our Range Of Categories</h2>
            <p className="text-gray-500 text-sm mt-1">Your One-Stop Destination for Every Category</p>
          </div>

          <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-3">
            {HERO_CATEGORIES.map(cat => (
              <div
                key={cat.name}
                className="shrink-0 w-44 sm:w-52 md:w-60 rounded-2xl border border-gray-100 shadow-md overflow-hidden flex flex-col bg-white group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(cat.path)}
              >
                <p className="text-center font-bold text-gray-800 text-xs sm:text-sm py-3 px-3">{cat.name}</p>
                <div className="w-full h-28 sm:h-36 overflow-hidden" style={{ background: cat.bg }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/300x200/f0f9f4/007F2D?text=${encodeURIComponent(cat.name)}`; (e.target as HTMLImageElement).onerror = null; }}
                  />
                </div>
                <div className="px-3 pb-3 bg-white">
                  <div className="w-full bg-[#007F2D] group-hover:bg-[#006e27] text-white font-bold text-xs py-2.5 rounded-lg text-center transition-colors mt-2">
                    SHOP NOW →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SHOP BY CATEGORIES (Matches Reference) ── */}
        <section className="mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#007F2D] text-left mb-8">
            Shop by categories
          </h1>

          {SECTIONS.map(section => (
            <div key={section.title} className="mb-10">
              {/* Added bottom border and distinct coloring to match references */}
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <h2 className="text-base sm:text-lg font-bold text-[#007F2D]">{section.title}</h2>
                <button
                  onClick={() => navigate(`/category/${encodeURIComponent(section.title)}/subcategories`)}
                  className="text-[#007F2D] text-[10px] sm:text-xs font-bold hover:underline"
                >
                  View More
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {section.items.slice(0, 4).map(item => (
                  <div
                    key={item.name}
                    onClick={() => navigate(`/category/${encodeURIComponent(section.title)}?subcategory=${encodeURIComponent(item.name)}`)}
                    className="flex flex-col bg-white border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50 border-b border-gray-50">
                      <img
                        src={item.img}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          const t = e.target as HTMLImageElement;
                          t.onerror = null;
                          t.src = `https://placehold.co/400x300/f0fdf4/007F2D?text=${encodeURIComponent(item.name.slice(0, 10))}`;
                        }}
                      />
                    </div>
                    <div className="p-2 sm:p-4 flex items-center justify-center bg-white min-h-[50px]">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-800 text-center leading-tight">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}


              </div>
            </div>
          ))}
        </section>


        {/* ── TRENDINGS (working carousel) ── */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Trendings</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-[#007F2D] hover:text-white hover:border-[#007F2D] transition-all shadow-sm"
              >
                ‹
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-[#007F2D] hover:text-white hover:border-[#007F2D] transition-all shadow-sm"
              >
                ›
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex gap-4 overflow-x-hidden">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="w-48 sm:w-52 h-[280px] bg-gray-100 animate-pulse rounded-xl shrink-0" />
              ))}
            </div>
          ) : (
            <div ref={carouselRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {featuredProducts
                .filter(p => ![
                  // Products excluded from Trending by user request
                  'Sunflower Oil 1L', 'Garam Masala 100g', 'Coriander Powder 200g',
                  'Rajma (Kidney Beans) 500g', 'Maida (Refined Flour) 1kg',
                  'Sabhudana (Sago) 500g', 'Sona Masoori Rice 5kg', 'Brass Diya',
                  'Pomegranate', 'Tomatoes', 'Green Capsicum', 'Fresh Potatoes',
                  'CloseUp Red Hot', 'Listerine Mouthwash 250ml', 'Sensodyne Repair',
                  'Nivea Body Milk 400ml', 'Gillette Mach 3 Razor', 'Ponds White Beauty Cream 50g',
                  'Chocos 250g', 'Muesli 400g', "Kellogg's Corn Flakes 500g",
                  'Farm Fresh Brown Eggs (Pack of 6)', 'Chana Dal 1kg', 'Pooja Thali Set',
                  'Bourbon', 'Parle-G 800g', 'Sugar', 'Pure White Sugar',
                ].includes(p.name))
                .map(p => (
                  <div key={p._id} className="w-44 sm:w-48 md:w-56 shrink-0">
                    <ProductCard
                      product={p}
                      onRequestLogin={() => setShowLoginModal(true)}
                    />
                  </div>
                ))
              }
            </div>
          )}
        </section>

        {/* ── APP PROMO BANNER (matches reference) ── */}
        <section className="mb-12">
          <div className="bg-[#007F2D] rounded-2xl sm:rounded-3xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center justify-between px-8 py-10 gap-8">
              <div className="text-white z-10 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
                  Shop Faster With<br />bodegaa App
                </h2>
                <p className="text-green-100 text-sm mb-6">Available on both iOS & Android</p>
                <div className="flex gap-4 justify-center md:justify-start">
                  {/* App Store Button */}
                  <a href="#" className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2.5 hover:bg-gray-900 transition-colors">
                    <span className="text-2xl leading-none">🍎</span>
                    <div className="text-left">
                      <p className="text-[9px] text-gray-300 leading-none">Download on the</p>
                      <p className="text-sm font-bold leading-none mt-0.5">App Store</p>
                    </div>
                  </a>
                  {/* Google Play Button */}
                  <a href="#" className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2.5 hover:bg-gray-900 transition-colors">
                    <span className="text-2xl leading-none">▶</span>
                    <div className="text-left">
                      <p className="text-[9px] text-gray-300 leading-none">Get it on</p>
                      <p className="text-sm font-bold leading-none mt-0.5">Google Play</p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="text-[100px] hidden md:block z-10">📱</div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-full bg-white/5 rounded-full -mr-32 blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* ── VALUE PROPOSITIONS ── */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '💰', bg: 'bg-green-50', title: 'Best Prices & Deals', desc: "Don't miss our daily amazing deals and prices" },
              { icon: '🔄', bg: 'bg-blue-50', title: 'Refundable', desc: 'If your items have issues, we refund easily' },
              { icon: '🚚', bg: 'bg-orange-50', title: 'Free Delivery', desc: 'On orders above ₹499 in specific areas' },
            ].map(s => (
              <div key={s.title} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center text-2xl shrink-0`}>{s.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-0.5">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER — bodegaa green matching reference ── */}
      <footer className="bg-[#007F2D] text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-12 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

            {/* Brand col */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1">
              <div className="flex items-center mb-1">
                <span className="text-orange-400 font-extrabold text-3xl leading-none">B</span>
                <span className="text-white font-bold text-3xl leading-none">odegaa</span>
              </div>
              <p className="text-[9px] uppercase tracking-widest text-green-200 font-bold mb-4">BEST IN QUALITY</p>
              <div className="space-y-1.5 text-xs text-green-100">
                <p>📍 Matrusri Nagar, Miyapur, Hyderabad, 500049</p>
                <p>📞 Call Us: +91 8886541155</p>
                <p>✉️ supermarketsbodegaa@gmail.com</p>
                <p>🕒 9:00 AM – 6:00 PM, Mon – Sat</p>
              </div>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Account</h4>
              <ul className="space-y-2.5 text-xs text-green-200">
                <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
                <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Track Order</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Shipping Details</Link></li>
              </ul>
            </div>

            {/* Useful links */}
            <div>
              <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Useful Links</h4>
              <ul className="space-y-2.5 text-xs text-green-200">
                <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Help Center</h4>
              <ul className="space-y-2.5 text-xs text-green-200">
                <li><Link to="/" className="hover:text-white transition-colors">Return Policy</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-green-600 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-200">
            <span>© 2025, All copy rights reserved, Bodegaa Supermarkets Private Limited</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
