import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoginModal from '../components/LoginModal';
import api from '../services/api';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

// ── Attractive Category Grid ──
const HERO_CATEGORIES = [
  {
    name: 'Fruits & Vegetables',
    path: '/category/Fruits & Vegetables',
    emoji: '🥦',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500&h=380',
    from: '#bbf7d0', to: '#86efac', text: '#166534',
  },
  {
    name: 'Groceries',
    path: '/category/Groceries',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=500&h=380',
    from: '#fef9c3', to: '#fde047', text: '#713f12',
  },
  {
    name: 'Dairy & Eggs',
    path: '/category/Dairy & Eggs',
    emoji: '🥛',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=500&h=380',
    from: '#e0f2fe', to: '#7dd3fc', text: '#0c4a6e',
  },
  {
    name: 'Snacks',
    path: '/category/Snacks',
    emoji: '🍿',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=500&h=380',
    from: '#fde8d8', to: '#fdba74', text: '#7c2d12',
  },
  {
    name: 'Beverages',
    path: '/category/Beverages',
    emoji: '🧃',
    image: 'https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&q=80&w=500&h=380',
    from: '#fce7f3', to: '#f9a8d4', text: '#831843',
  },
  {
    name: 'Dry Fruits',
    path: '/category/Dry Fruits',
    emoji: '🥜',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=500&h=380',
    from: '#fef3c7', to: '#fbbf24', text: '#78350f',
  },
  {
    name: 'Households',
    path: '/category/Households',
    emoji: '🧴',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=500&h=380',
    from: '#ede9fe', to: '#c4b5fd', text: '#4c1d95',
  },
  {
    name: 'Bakery',
    path: '/category/Bakery',
    emoji: '🍞',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500&h=380',
    from: '#fdf2f8', to: '#f0abfc', text: '#701a75',
  },
];

const SECTIONS = [
  {
    title: 'Groceries',
    items: [
      { name: 'Aata, maida, besan & sooji', display: 'Aata, Maida & Besan', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=500&h=400&fit=crop' },
      { name: 'Dals, Pulses & Grains', display: 'Dals & Pulses', img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=500&h=400&fit=crop' },
      { name: 'Masala & Spices', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&h=400&fit=crop' },
      { name: 'Oil & Ghee', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=500&h=400&fit=crop' },
    ],
  },
  {
    title: 'Fruits & Vegetables',
    display: 'Fresh Fruits & Vegetables',
    items: [
      { name: 'Fruits', display: 'Fresh Fruits', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500&h=400&fit=crop' },
      { name: 'Vegetables', display: 'Fresh Vegetables', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=500&h=400&fit=crop' },
      { name: 'Fresh Fruits', display: 'Imported Fruits', img: 'https://images.unsplash.com/photo-1457296898342-cdd24585d095?q=80&w=500&h=400&fit=crop' },
    ],
  },
  {
    title: 'Households',
    items: [
      { name: 'Breakfast & cereals', display: 'Breakfast & Cereals', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=500&h=400&fit=crop' },
      { name: 'Detergents & Cleaning', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=500&h=400&fit=crop' },
      { name: 'Facewash & skincare', display: 'Skin & Face Care', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&h=400&fit=crop' },
      { name: 'Hair care', display: 'Hair Care', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500&h=400&fit=crop' },
    ],
  },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [recentlyOpened, setRecentlyOpened] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const recommendedCarouselRef = useRef<HTMLDivElement>(null);
  const recentlyCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/products')
      .then(r => {
        const all = r.data.products || [];
        setFeaturedProducts(all);
        // "Recommended for You" - pick 6 somewhat random or diverse products
        setRecommendedProducts([...all].sort(() => 0.5 - Math.random()).slice(0, 6));
      })
      .catch(() => { })
      .finally(() => setIsLoading(false));

    // Load recently opened products from localStorage
    const saved = JSON.parse(localStorage.getItem('recentlyOpened') || '[]');
    setRecentlyOpened(saved);
  }, []);

  // Working carousel nav
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => {
    ref.current?.scrollBy({ left: dir === 'right' ? 900 : -900, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f4f7fb]">
      {/* ── HERO BANNER ── */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 relative overflow-hidden shadow-inner">
        {/* Mobile-only Hero Image */}
        <div className="md:hidden w-full h-[240px] relative flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
            alt="Fresh Groceries"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-5 right-5 text-white">
            <span className="text-[9px] font-black uppercase tracking-widest bg-yellow-400 text-black px-2 py-1 rounded inline-block mb-3">
              Fastest Delivery
            </span>
            <h1 className="text-3xl font-black leading-[1.1] drop-shadow-md mb-4">
              Fresh Essentials<br />Delivered Fast!
            </h1>
            <button
              onClick={() => navigate('/products')}
              className="bg-white text-primary-700 text-xs font-black px-6 py-2.5 rounded-lg shadow-lg active:scale-95 transition-transform inline-flex items-center gap-2"
            >
              Shop Now <span>→</span>
            </button>
          </div>
        </div>

        {/* Desktop Hero Content */}
        <div className="hidden md:flex max-w-[1400px] mx-auto px-10 py-8 items-center justify-between gap-12 min-h-[300px]">
          <div className="text-white z-10 text-left flex-1 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 inline-flex items-center gap-2 mb-8">
              🚀 FAST DELIVERY · FRESH EVERY DAY
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6 tracking-tight">
              Fresh Groceries<br />
              <span className="text-yellow-400">Delivered in 30 Minutes!</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-medium mb-10 max-w-xl leading-relaxed">
              Order fresh fruits, vegetables, dairy & thousands of daily essentials right to your door.
            </p>
            <div className="flex gap-4 justify-start">
              <button
                onClick={() => navigate('/products')}
                className="bg-white text-primary-600 font-black px-12 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-xl text-lg flex items-center gap-2"
              >
                Shop Now <span>→</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 z-10 w-72">
            {[
              { emoji: '⚡', label: '30 Min Delivery' },
              { emoji: '🥬', label: 'Farm Fresh' },
              { emoji: '💰', label: 'Best Prices' },
              { emoji: '🛡️', label: '100% Genuine' },
            ].map((s, i) => (
              <div 
                key={s.label} 
                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 text-white hover:bg-white/20 transition-all cursor-default shadow-lg group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {s.emoji}
                </div>
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

          {/* Attractive gradient category grid */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4 px-1">
            {HERO_CATEGORIES.map(cat => (
              <div
                key={cat.name}
                onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                className="rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer group hover:scale-[1.04] hover:shadow-xl transition-all duration-300 py-4 sm:py-5 px-3 select-none border border-black/5"
                style={{ background: `linear-gradient(135deg, ${cat.from}, ${cat.to})` }}
              >
                <span className="text-2xl sm:text-3xl mb-1.5 group-hover:scale-125 transition-transform duration-300">{cat.emoji}</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-center leading-tight px-1" style={{ color: cat.text }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SHOP BY CATEGORIES (Matches Reference) ── */}
        <section className="mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 text-left mb-8">
            Shop by categories
          </h1>

          {isLoading ? (
            <Loader text="Loading categories..." />
          ) : (
            SECTIONS.map(section => (
              <div key={section.title} className="mb-10">
                {/* Added bottom border and distinct coloring to match references */}
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                  <h2 className="text-base sm:text-lg font-bold text-primary-600">{(section as any).display || section.title}</h2>
                  <button
                    onClick={() => navigate(`/category/${encodeURIComponent(section.title)}/subcategories`)}
                    className="text-primary-600 text-[10px] sm:text-xs font-bold hover:underline"
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
                          {(item as any).display || item.name}
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
                onClick={() => scrollCarousel(carouselRef, 'left')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
              >
                ‹
              </button>
              <button
                onClick={() => scrollCarousel(carouselRef, 'right')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
              >
                ›
              </button>
            </div>
          </div>

          {isLoading ? (
            <Loader text="Loading trending products..." />
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

        {/* ── RECOMMENDED FOR YOU ── */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Recommended for You</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(recommendedCarouselRef, 'left')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
              >
                ‹
              </button>
              <button
                onClick={() => scrollCarousel(recommendedCarouselRef, 'right')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
              >
                ›
              </button>
            </div>
          </div>

          {isLoading ? (
            <Loader text="Loading..." />
          ) : (
            <div ref={recommendedCarouselRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {recommendedProducts.length > 0 ? (
                recommendedProducts.map(p => (
                  <div key={p._id} className="w-44 sm:w-48 md:w-56 shrink-0">
                    <ProductCard
                      product={p}
                      onRequestLogin={() => setShowLoginModal(true)}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full py-12 text-center text-gray-400 font-medium">
                  We'll suggest items you might like soon!
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── RECENTLY OPENED ── */}
        {recentlyOpened.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Recently Opened</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollCarousel(recentlyCarouselRef, 'left')}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollCarousel(recentlyCarouselRef, 'right')}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm"
                >
                  ›
                </button>
              </div>
            </div>

            <div ref={recentlyCarouselRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {recentlyOpened.map(p => (
                <div key={p._id} className="w-44 sm:w-48 md:w-56 shrink-0">
                  <ProductCard
                    product={p}
                    onRequestLogin={() => setShowLoginModal(true)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── APP PROMO BANNER (matches reference) ── */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-storewave-secondary to-primary-500 rounded-2xl sm:rounded-3xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center justify-between px-8 py-10 gap-8">
              <div className="text-white z-10 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
                  Shop Faster With<br />StoreWave App
                </h2>
                <p className="text-blue-100 text-sm mb-6">Available on both iOS & Android</p>
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
              { icon: '💰', bg: 'bg-primary-50', title: 'Best Prices & Deals', desc: "Don't miss our daily amazing deals and prices" },
              { icon: '🔄', bg: 'bg-primary-50', title: 'Refundable', desc: 'If your items have issues, we refund easily' },
              { icon: '🚚', bg: 'bg-primary-50', title: 'Free Delivery', desc: 'On orders above ₹499 in specific areas' },
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
