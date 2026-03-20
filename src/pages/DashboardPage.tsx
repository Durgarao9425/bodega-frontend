import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="bg-[#f8f9fa]">
      {/* ── HERO BANNER ── */}
      <section className="bg-[#007F2D] md:bg-[#007F2D] relative overflow-hidden">
        {/* Mobile-only Hero Image (Yellow background style) */}
        <div className="md:hidden w-full h-[220px] bg-[#FFD700] relative flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
            alt="Fresh Groceries"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-lg">
            <h1 className="text-2xl font-black leading-tight">Fresh Essentials<br />Delivered Fast!</h1>
          </div>
        </div>

        {/* Desktop Hero Content */}
        <div className="hidden md:flex max-w-[1400px] mx-auto px-10 py-12 items-center justify-between gap-6">
          <div className="text-white z-10 text-left">
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
            <div className="flex gap-3 justify-start flex-wrap">
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
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Stats pills — desktop only */}
          <div className="flex flex-col gap-3 z-10">
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

        {/* decorative blobs - desktop only */}
        <div className="hidden md:block absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden md:block absolute bottom-0 left-1/3 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      <main className="max-w-[1600px] ml-0 px-4 sm:px-6 md:px-10 py-8">

        {/* ── HERO CATEGORY CARDS ── */}
        <section className="mb-12">
          <div className="text-center mb-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">View Our Range</h2>
            <p className="text-gray-500 text-sm mt-1">Your One-Stop Destination</p>
          </div>

          {/* Grid for mobile (2x2), Scroll for desktop */}
          <div className="grid grid-cols-2 md:flex md:gap-5 gap-3 px-1 md:overflow-x-auto no-scrollbar pb-3">
            {HERO_CATEGORIES.map(cat => (
              <div
                key={cat.name}
                className="w-full md:shrink-0 md:w-60 rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col bg-white group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(cat.path)}
              >
                <div className="w-full h-24 sm:h-36 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/300x200/f0f9f4/007F2D?text=${encodeURIComponent(cat.name)}`; (e.target as HTMLImageElement).onerror = null; }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="p-2 sm:p-4 text-center">
                  <span className="font-bold text-[10px] sm:text-xs text-gray-800 uppercase tracking-wider">{cat.name}</span>
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

          {isLoading ? (
            // Skeleton for each section (4 sections in SECTIONS)
            SECTIONS.map((_, index) => (
              <div key={index} className="mb-10">
                {/* Skeleton for title and view more button */}
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                  <div className="h-6 w-40 bg-gray-100 animate-pulse rounded-md" />
                  <div className="h-4 w-20 bg-gray-100 animate-pulse rounded-md" />
                </div>
                {/* Skeleton for items */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="flex flex-col bg-white border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
                      <div className="aspect-[4/3] w-full bg-gray-100 animate-pulse" />
                      <div className="p-2 sm:p-4 flex items-center justify-center bg-white min-h-[50px]">
                        <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            SECTIONS.map(section => (
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
            ))
          )}
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
              {featuredProducts.length > 0 ? (
                featuredProducts
                  .filter(p => p.name && ![
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
                    'Kashmir Apples 1kg', 'Toor Dal Premium 1kg', 'Camphor / Kapur 50g', 'Agarbatti Premium Pack'
                  ].includes(p.name))
                  .map(p => (
                    <div key={p._id} className="w-44 sm:w-48 md:w-56 shrink-0">
                      <ProductCard
                        product={p}
                        onRequestLogin={() => setShowLoginModal(true)}
                      />
                    </div>
                  ))
              ) : (
                <div className="w-full py-12 text-center text-gray-400">
                  No products in trending section.
                </div>
              )}
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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default DashboardPage;
