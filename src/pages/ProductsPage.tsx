import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import LoginModal from '../components/LoginModal';
import { useWishlist } from '../context/WishlistContext';

interface ProductsPageProps {
  isWishlist?: boolean;
}

const Skeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-3 h-64 flex flex-col gap-3 animate-pulse">
    <div className="w-full h-32 bg-gray-50 rounded-lg"></div>
    <div className="w-2/3 h-4 bg-gray-100 rounded"></div>
    <div className="w-full h-4 bg-gray-100 rounded"></div>
    <div className="mt-auto w-full h-8 bg-gray-100 rounded-lg"></div>
  </div>
);

// Category structure — subcategory names match EXACT values in MongoDB
const CATEGORY_STRUCTURE: Record<string, string[]> = {
  'All': [],
  'Households': [
    'Breakfast & cereals',
    'Detergents & Cleaning',
    'Facewash & skincare',
    'Hair care',
    'Oral care',
    'Pasta & noodles',
    'Soaps & body wash',
  ],
  'Fruits & Vegetables': ['Vegetables', 'Fruits', 'Fresh Fruits'],
  'Groceries': [
    'Aata, maida, besan & sooji',
    'Dals, Pulses & Grains',
    'Masala & Spices',
    'Oil & Ghee',
    'Rice, Poha & Sabhudana',
  ],
  'Dry Fruits': ['Premium Nuts'],
  'Testing cat': ['Other Items'],
};

const MAIN_CATEGORIES = Object.keys(CATEGORY_STRUCTURE);

const ProductsPage: React.FC<ProductsPageProps> = ({ isWishlist }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Cache all products for client-side search
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [visibleItemsCount, setVisibleItemsCount] = useState(10);

  const location = useLocation();
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { wishlistItems } = useWishlist();

  // Get URL search params — derived directly from location for reactivity
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  // Read subcategory directly (decoded) from URL — this is reactive to navigation
  const urlSubcategory = searchParams.get('subcategory') || '';

  // Filters state
  const [activeCategory, setActiveCategory] = useState<string>(() =>
    categoryName ? decodeURIComponent(categoryName) : 'Households'
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string>(urlSubcategory);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('default');

  // Handle URL-driven category + subcategory — runs on every navigation
  useEffect(() => {
    if (categoryName) {
      setActiveCategory(decodeURIComponent(categoryName));
    } else if (!searchQuery) {
      setActiveCategory('Households');
    }
    // Always sync subcategory from URL (handles both initial load and navigation)
    setActiveSubcategory(urlSubcategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName, location.search]);

  // Fetch ALL products once and cache
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/products');
        setAllProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching products', err);
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Apply filters client-side from cached products
  const applyFilters = useCallback(() => {
    // If allProducts is empty, we might still be loading the initial fetch
    if (allProducts.length === 0) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    let filtered = [...allProducts];

    if (isWishlist) {
      // Show only wishlisted items
      filtered = filtered.filter(p => wishlistItems.includes(p._id));
    } else if (searchQuery) {
      // SEARCH ACROSS ALL CATEGORIES
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q)
      );
    } else {
      // Category / subcategory filter
      if (activeCategory && activeCategory !== 'All') {
        filtered = filtered.filter(p => (p.category || '').toLowerCase() === activeCategory.toLowerCase());
      }
      if (activeSubcategory) {
        filtered = filtered.filter(p => {
          const productSub = (p.subcategory || '').toLowerCase().trim();
          const filterSub = activeSubcategory.toLowerCase().trim();
          return productSub === filterSub;
        });
      }
    }

    // Price filter
    filtered = filtered.filter(p => p.price <= priceRange);

    // Sort
    if (sortBy === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    console.log('🔍 Filtering:', { activeCategory, activeSubcategory, total: allProducts.length, found: filtered.length });
    setProducts(filtered);
    setIsLoading(false);
  }, [allProducts, isWishlist, searchQuery, activeCategory, activeSubcategory, priceRange, sortBy, wishlistItems]);

  useEffect(() => {
    setVisibleItemsCount(10); // Reset pagination on filter change
    applyFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [applyFilters]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubcategory('');
    navigate('/products', { replace: true });
  };

  const resetFilters = () => {
    setPriceRange(10000);
    setActiveSubcategory('');
    setSortBy('default');
  };

  // Calculate slider fill percentage for CSS
  const sliderFill = (priceRange / 10000) * 100;

  return (
    <div className="bg-white">
      <main className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4 sm:py-6">

        {/* Breadcrumb + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#007F2D] font-medium">Home</Link>
            <span>›</span>
            {isWishlist ? (
              <span className="text-[#007F2D] font-bold">My Wishlist ❤️</span>
            ) : searchQuery ? (
              <span className="text-[#007F2D] font-bold">Search: "{searchQuery}"</span>
            ) : (
              <span className="text-[#007F2D] font-bold">{activeCategory}</span>
            )}
          </div>

          {/* Sort dropdown */}
          {!isWishlist && (
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs sm:text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-[#007F2D] cursor-pointer bg-white self-start sm:self-auto"
            >
              <option value="default">Sort: Relevance</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-7 items-start">

          {/* ── LEFT SIDEBAR (desktop only, hidden while searching or wishlist) ── */}
          {!isWishlist && !searchQuery && (
            <aside className="hidden md:block w-56 lg:w-64 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm self-start sticky top-[88px] overflow-hidden">

              {/* Category filter */}
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest mb-3">Categories</h3>
                <div className="space-y-1">
                  {MAIN_CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full text-left text-xs font-medium py-2 px-3 rounded-lg transition-colors ${activeCategory === cat
                          ? 'bg-[#007F2D] text-white font-bold'
                          : 'text-gray-600 hover:bg-green-50 hover:text-[#007F2D]'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory filter */}
              {CATEGORY_STRUCTURE[activeCategory]?.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest mb-3">Sub-Categories</h3>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="subcategory"
                        checked={activeSubcategory === ''}
                        onChange={() => setActiveSubcategory('')}
                        className="accent-[#007F2D]"
                      />
                      <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">All</span>
                    </label>
                    {CATEGORY_STRUCTURE[activeCategory].map(sub => (
                      <label key={sub} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="subcategory"
                          checked={activeSubcategory === sub}
                          onChange={() => setActiveSubcategory(sub)}
                          className="accent-[#007F2D]"
                        />
                        <span className={`text-xs font-medium ${activeSubcategory === sub ? 'text-[#007F2D]' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {sub}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price filter */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">Price Range</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#007F2D]">Up to ₹{priceRange}</span>
                    <button
                      onClick={resetFilters}
                      className="text-[9px] uppercase font-bold text-[#007F2D] border border-[#007F2D] px-2 py-0.5 rounded hover:bg-[#007F2D] hover:text-white transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Range slider with filled track via inline style gradient */}
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange}
                  onChange={e => setPriceRange(parseInt(e.target.value))}
                  className="price-slider w-full mb-3"
                  style={{
                    background: `linear-gradient(to right, #007F2D ${sliderFill}%, #d1d5db ${sliderFill}%)`
                  }}
                />
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span className="bg-gray-100 px-2 py-1 rounded">₹0</span>
                  <span className="text-[#007F2D]">₹{priceRange.toLocaleString()}</span>
                </div>
              </div>
            </aside>
          )}

          {/* ── PRODUCT GRID ── */}
          <div className="flex-1 w-full min-w-0">

            {/* Results summary */}
            {!isLoading && (
              <p className="text-xs text-gray-400 mb-3 font-medium">
                {products.length === 0 ? 'No products found' : `Showing ${products.length} product${products.length === 1 ? '' : 's'}`}
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <Skeleton key={n} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 rounded-2xl border border-gray-100 min-h-[220px]">
                <span className="text-5xl mb-4">{isWishlist ? '💔' : '📦'}</span>
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {isWishlist ? 'No wishlist items' : 'No products found'}
                </h2>
                <p className="text-gray-500 max-w-sm mb-6 text-sm">
                  {isWishlist
                    ? 'Add products to your wishlist by clicking the heart icon on any product.'
                    : searchQuery
                      ? `No results for "${searchQuery}". Try a different search or browse by category.`
                      : "We couldn't find any products matching your filters."}
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-[#007F2D] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#006e27] transition-colors text-sm"
                >
                  Browse All Products
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {products.slice(0, visibleItemsCount).map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      onRequestLogin={() => setShowLoginModal(true)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {products.length > visibleItemsCount && (
                  <div className="flex justify-center pt-4 pb-8">
                    <button
                      onClick={() => setVisibleItemsCount(prev => prev + 10)}
                      className="group flex items-center gap-2 bg-white border-2 border-[#007F2D] text-[#007F2D] font-bold px-8 py-3 rounded-xl hover:bg-[#007F2D] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Load More
                      <svg 
                        className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default ProductsPage;
