import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import LoginModal from '../components/LoginModal';
import api from '../services/api';
import { Product } from '../types';
import Loader from '../components/Loader';

const FALLBACK_IMAGE = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Product';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();
  const { token } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('Description');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Magnifier state
  const imgRef = useRef<HTMLImageElement>(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    if (!product) return;
    try {
      setIsAdding(true);
      await addToCart(product._id, quantity);
    } catch (error) {
      console.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    if (!product) return;
    await toggleWishlist(product._id);
  };

  const isWishlisted = product ? wishlistItems.includes(product._id) : false;

  if (isLoading) {
    return (
      <div className="bg-white flex flex-col min-h-[60vh] items-center justify-center">
        <Loader text="Loading product details..." size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-500 mb-6">{error || 'Product not found'}</p>
          <button onClick={() => navigate('/products')} className="bg-primary-500 text-white font-bold px-6 py-2 rounded-xl">← Back to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col">
      <main className="max-w-[1200px] mx-auto px-4 py-6 flex-1 w-full">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-500 font-bold text-sm hover:underline mb-6">
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Left: Product Images with Zoom */}
          <div className="w-full md:w-[45%] flex flex-col gap-4">
            <div 
              className="w-full aspect-square bg-white border border-gray-100 rounded-lg p-6 flex items-center justify-center relative shadow-sm cursor-crosshair group"
              onMouseEnter={(e) => {
                const elem = e.currentTarget;
                const { width, height } = elem.getBoundingClientRect();
                setSize([width, height]);
                setShowMagnifier(true);
              }}
              onMouseMove={(e) => {
                const elem = e.currentTarget;
                const { top, left } = elem.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;
                setXY([x, y]);
              }}
              onMouseLeave={() => setShowMagnifier(false)}
            >
              <img 
                ref={imgRef}
                src={product.image || FALLBACK_IMAGE} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
                onError={e => (e.target as HTMLImageElement).src = FALLBACK_IMAGE}
              />

              {/* Advanced Magnifier Glass Overlay */}
              <div
                style={{
                  display: showMagnifier ? 'block' : 'none',
                  position: 'absolute',
                  pointerEvents: 'none',
                  height: `200px`,
                  width: `200px`,
                  top: `${y - 100}px`,
                  left: `${x - 100}px`,
                  opacity: 1,
                  border: '4px solid white',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  backgroundImage: `url(${product.image || FALLBACK_IMAGE})`,
                  backgroundRepeat: 'no-repeat',
                  // Calculate background size assuming we magnify 2x
                  backgroundSize: `${imgWidth * 2}px ${imgHeight * 2}px`,
                  // Calculate position so the center of the magnifier is the mouse location
                  backgroundPositionX: `${-x * 2 + 100}px`,
                  backgroundPositionY: `${-y * 2 + 100}px`,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 50,
                }}
              />
            </div>

            {/* Thumbnails (Simulated) */}
            <div className="flex gap-3">
              <div className="w-20 h-20 border-2 border-primary-500 rounded-lg p-2 cursor-pointer bg-white">
                <img src={product.image || FALLBACK_IMAGE} className="w-full h-full object-contain" alt="thumb1" />
              </div>
              <div className="w-20 h-20 border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-primary-500 bg-white opacity-70 hover:opacity-100 transition-opacity">
                 {/* Reusing exact icon as a second thumb placeholder just like image 4 */}
                <img src={product.image || FALLBACK_IMAGE} className="w-full h-full object-contain" alt="thumb2" />
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-[55%] flex flex-col pt-2">
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 leading-tight">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">{product.category}</p>
            
            {/* Tags simulated based on name/category to match the mockup style */}
            <div className="flex gap-2 mb-6">
              <span className="border border-primary-200 text-primary-600 bg-primary-50 text-[11px] font-bold px-3 py-1 rounded-full">{product.category.toLowerCase()}</span>
              {product.subcategory && (
                <span className="border border-primary-200 text-primary-600 bg-primary-50 text-[11px] font-bold px-3 py-1 rounded-full">{product.subcategory.toLowerCase()}</span>
              )}
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-1.5 mb-6 text-sm">
              <span className="text-yellow-400 text-lg leading-none">★</span>
              <span className="text-yellow-400 text-lg leading-none">★</span>
              <span className="text-yellow-400 text-lg leading-none">★</span>
              <span className="text-gray-300 text-lg leading-none">★</span>
              <span className="text-gray-300 text-lg leading-none">★</span>
              <span className="ml-2 text-gray-500 font-medium">({product.rating || '4.0'} Review)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              {product.originalPrice && (
                 <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
              )}
              <span className="text-3xl font-extrabold text-primary-600">₹{product.price.toFixed(2)}</span>
            </div>

            {/* Size / Weight */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold text-gray-700">Size/Weight :</span>
              <span className="border border-primary-500 text-primary-600 text-[11px] font-bold px-3 py-1 bg-white">{product.unit || '1 Pack'}</span>
            </div>

            {/* Add Action Area (Responsive) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mt-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700 min-w-[70px]">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl h-12 w-28 bg-white shadow-sm">
                  <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="flex-1 font-bold text-gray-500 hover:text-black hover:bg-gray-50 h-full border-r border-gray-100 transition-colors">
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-gray-800">{quantity}</span>
                  <button onClick={() => quantity < (product.stock) && setQuantity(quantity + 1)} className="flex-1 font-bold text-gray-500 hover:text-black hover:bg-gray-50 h-full border-l border-gray-100 transition-colors">
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3 flex-1">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                  className="flex-1 bg-primary-500 text-white font-bold h-12 rounded-xl text-sm hover:bg-primary-600 transition-all focus:ring-4 focus:ring-primary-100 shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {isAdding ? 'Adding...' : 'Add To Cart'}
                </button>

                <button 
                  onClick={handleWishlist}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all shadow-sm active:scale-95
                    ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-primary-500 hover:text-primary-500 bg-white'}
                  `}
                >
                  <svg stroke="currentColor" fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth="2.5" viewBox="0 0 24 24" height="20" width="20">
                    <path d="M20.8 4.6a5.5 5.5 0 00-7.7 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.8 1.1-1.1a5.5 5.5 0 000-7.7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bottom Tabs */}
            <div className="mt-16 w-full md:w-[150%] xl:w-[200%] max-w-[900px]">
               <div className="flex border-b border-gray-200">
                 <button 
                   onClick={() => setActiveTab('Description')}
                   className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'Description' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                 >
                   Description
                 </button>
                 <button 
                   onClick={() => setActiveTab('Review')}
                   className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'Review' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                 >
                   Review (2)
                 </button>
               </div>
               
               <div className="py-6 text-sm text-gray-600 leading-relaxed bg-white/50 min-h-[150px]">
                 {activeTab === 'Description' ? (
                   <p>{product.description || "No description provided for this product. It is 100% genuine."}</p>
                 ) : (
                   <div className="space-y-4">
                     <div className="border border-gray-100 p-4 rounded-lg bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-800">John D.</span>
                          <span className="text-yellow-400 text-xs">★★★★★</span>
                        </div>
                        <p className="text-xs text-gray-500">Very fresh and high quality. Delivered on time. Will order again.</p>
                     </div>
                     <div className="border border-gray-100 p-4 rounded-lg bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-800">Sarah M.</span>
                          <span className="text-yellow-400 text-xs">★★★★☆</span>
                        </div>
                        <p className="text-xs text-gray-500">Good packaging perfectly sealed, product is also good.</p>
                     </div>
                   </div>
                 )}
               </div>
            </div>

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

export default ProductDetailPage;
