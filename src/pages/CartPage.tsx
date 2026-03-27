import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const FALLBACK_IMAGE = 'https://placehold.co/80x80/f3f4f6/9ca3af?text=Product';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isLoading: isCartLoading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' | '' }>({ msg: '', type: '' });
  const [formData, setFormData] = useState({
    fullName: '', mobile: '', addressLine1: '', flatNo: '', type: 'Home'
  });

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 4000);
  };

  useEffect(() => {
    if (user) {
      api.get('/user/addresses').then(res => {
        setAddresses(res.data.addresses || []);
        if (res.data.addresses?.length > 0) {
          setSelectedAddressId(res.data.addresses[0]._id);
        }
      }).catch(console.error);
    }
  }, [user]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return showToast('Please login to save address', 'error');
    try {
      const res = await api.post('/user/address', formData);
      setAddresses(res.data.addresses);
      setSelectedAddressId(res.data.addresses[res.data.addresses.length - 1]._id);
      setShowAddModal(false);
      setFormData({ fullName: '', mobile: '', addressLine1: '', flatNo: '', type: 'Home' });
      showToast('Address saved successfully!', 'success');
    } catch {
      showToast('Failed to save address', 'error');
    }
  };

  if (isCartLoading && !cart) {
    return (
      <div className="bg-gray-50 flex flex-col">
        <main className="max-w-[1200px] mx-auto px-4 py-8 w-full flex-1">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6" />
        </main>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-gray-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="text-7xl mb-6 opacity-40">🛒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <button onClick={() => navigate('/products')} className="bg-[#0ea5e9] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0284c7] mt-5">
            Start Shopping →
          </button>
        </div>
      </div>
    );
  }

  const subTotal = cart.totalPrice;
  const gst = subTotal * 0.02;     // 2%
  const handlingFee = 0.1;
  const deliveryCharges = subTotal > 499 ? 0 : 49;
  const grandTotal = subTotal + gst + handlingFee + deliveryCharges;

  const handleCheckoutClick = () => {
    if (!user) return showToast('Please login to checkout', 'error');
    if (!selectedAddressId) return showToast('Please add and select a delivery address', 'error');
    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    setIsProcessing(true);
    try {
      const address = addresses.find(a => a._id === selectedAddressId);
      const items = cart.items.filter(i => i.product != null).map(i => ({
        product: i.product._id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price || i.price,
        image: i.product.image
      }));
      await api.post('/order/create', {
        items, deliveryAddress: address, subTotal, deliveryFee: deliveryCharges, totalAmount: grandTotal, paymentMethod: 'Cash on Delivery'
      });
      clearCart();
      setIsProcessing(false);
      setShowConfirmModal(false);
      showToast('Order created successfully! Redirecting...', 'success');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (e: any) {
      console.error(e);
      showToast('Failed: ' + (e.response?.data?.error || e.message), 'error');
      setIsProcessing(false);
    }
  };

  const handleRemoveItem = async (productId: string, name: string) => {
    try {
      await removeFromCart(productId);
      showToast(`Removed ${name} from cart`, 'info');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white">

      {/* GLOBAL TOAST */}
      {toast.msg && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 ${toast.type === 'success' ? 'bg-green-50 text-[#0ea5e9] border-green-200' : toast.type === 'error' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'} border px-8 py-4 rounded-2xl font-black text-base shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[999] animate-fade-in flex items-center gap-4 min-w-[320px]`}>
          <span className="text-2xl">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          {toast.msg}
        </div>
      )}

      <main className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10 items-start">

        {/* LEFT COLUMN: Cart Items & Summary */}
        <div className="w-full lg:w-[60%] shrink-0">

          {/* Items */}
          <div className="space-y-4 mb-6">
            {cart.items.filter(i => i.product != null).map((item) => (
              <div key={item._id} className="flex gap-4 items-center bg-white border border-gray-100 rounded-xl p-3 shadow-sm relative">
                <div className="w-16 h-16 bg-white overflow-hidden shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                  <img src={item.product?.image} alt={item.product?.name || 'Product'} className="w-full h-full object-contain" onError={e => {
                    const t = e.target as HTMLImageElement;
                    t.onerror = null;
                    t.src = `https://placehold.co/100x100/f0fdf4/007F2D?text=${encodeURIComponent((item.product?.name || 'Item').slice(0, 10))}`;
                  }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-400 mb-1">{item.product.unit}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">₹{item.product.originalPrice}</span>
                    <span className="font-bold text-[#0ea5e9] text-sm">₹{item.product?.price || item.price}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2 pr-2">
                  <button onClick={() => handleRemoveItem(item.product._id, item.product.name)} className="text-green-600 hover:text-red-500 transition-colors" title="Remove">🗑️</button>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-semibold">Quantity :</span>
                    <div className="flex items-center border border-gray-200 rounded shrink-0 h-6">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="px-2 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                        −
                      </button>
                      <span className="w-6 text-center font-bold text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="px-2 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {deliveryCharges === 0 && (
            <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-center gap-2 mb-6">
              <span>🎉</span>
              <p className="text-[#0ea5e9] font-bold text-xs uppercase tracking-wide">Congratulations! You've unlocked FREE DELIVERY ✨</p>
            </div>
          )}

          {/* Summary */}
          <div className="bg-white border text-sm border-gray-100 p-6 shadow-sm rounded-xl">
            <h3 className="font-extrabold text-gray-800 mb-5 text-lg">Summary</h3>
            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Sub-Total</span>
                <span className="font-bold text-gray-800">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">GST(0.02%)</span>
                <span className="font-bold text-gray-800">+ ₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Handling Fee</span>
                <span className="font-bold text-gray-800">+ ₹{handlingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Delivery Charges</span>
                <span className="font-bold text-gray-800">{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6 px-4">
              <span className="font-extrabold text-gray-900">Total Amount</span>
              <span className="font-extrabold text-gray-900 text-lg">₹{grandTotal.toFixed(2)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="border border-[#0ea5e9] text-[#0ea5e9] font-bold py-3 px-6 rounded-xl hover:bg-green-50 text-center flex-1 text-sm flex items-center justify-center gap-2">
                + Add More items
              </Link>
              <button onClick={handleCheckoutClick} className="bg-[#0ea5e9] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#0284c7] text-center flex-1 focus:ring-4 focus:ring-green-100 transition-colors shadow-lg active:scale-95 text-lg">
                Checkout
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Addresses */}
        <div className="w-full lg:w-[40%]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">My Addresses</h2>
            <button onClick={() => setShowAddModal(true)} className="text-[#0ea5e9] text-sm font-bold hover:underline flex items-center gap-1">
              + Add Address
            </button>
          </div>

          {!user ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 h-48">
              <p className="text-sm text-gray-500 font-medium text-center">Please login to add a delivery address.</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="border-2 border-dashed border-[#8bc5a0] rounded-xl p-8 flex flex-col items-center justify-center bg-[#f7fcf9] text-center h-48 cursor-pointer hover:bg-green-50" onClick={() => setShowAddModal(true)}>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-2xl">📦</div>
              <p className="font-bold text-gray-800 mb-1">No Address Added Yet</p>
              <p className="text-[11px] text-gray-500 px-4">Please add a delivery address to proceed with checkout and complete your order.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map(addr => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddressId(addr._id)}
                  className={`border rounded-xl p-4 cursor-pointer relative flex gap-3 ${selectedAddressId === addr._id ? 'border-[#0ea5e9] bg-[#f7fcf9]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <div className="pt-1 select-none">
                    <input type="radio" checked={selectedAddressId === addr._id} readOnly className="accent-[#0ea5e9] w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 mb-1">{addr.fullName} <span className="text-gray-400 font-normal">({addr.mobile})</span> | <span className="font-bold">{addr.type}</span></p>
                    <p className="text-xs text-gray-500 leading-tight pr-6 relative">{addr.flatNo}, {addr.addressLine1}</p>
                    <div className="absolute right-4 top-4 flex gap-2">
                      <button className="text-[#0ea5e9] hover:scale-110">✏️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Add Address Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-[#0ea5e9] text-lg font-bold mb-6">Add Address</h2>
            <form onSubmit={handleSaveAddress} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Full Name *</label>
                  <input required placeholder="Enter your name" className="w-full border p-2.5 rounded focus:border-[#0ea5e9] outline-none text-sm" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Mobile *</label>
                  <input required placeholder="10 digit mobile number" className="w-full border p-2.5 rounded focus:border-[#0ea5e9] outline-none text-sm" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Address *</label>
                <input required placeholder="Area, Street, Sector, Village" className="w-full border p-2.5 rounded focus:border-[#0ea5e9] outline-none text-sm" value={formData.addressLine1} onChange={e => setFormData({ ...formData, addressLine1: e.target.value })} />
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Flat No / House No /Building No *</label>
                  <input required placeholder="" className="w-full border border-green-400 p-2.5 rounded focus:border-[#0ea5e9] outline-none text-sm" value={formData.flatNo} onChange={e => setFormData({ ...formData, flatNo: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Type *</label>
                  <select className="w-full border p-2.5 rounded focus:border-[#0ea5e9] outline-none text-sm bg-white" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option>Home</option>
                    <option>Office</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="bg-[#0ea5e9] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#0284c7]">SAVE</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="border border-[#0ea5e9] text-[#0ea5e9] px-8 py-2.5 rounded-lg font-bold hover:bg-green-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm Checkout Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center transform inline-block">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-[#0ea5e9] text-3xl mx-auto mb-4">
              🛒
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Order?</h2>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to place the order with Cash on Delivery? Total: <strong className="text-gray-900">₹{grandTotal.toFixed(2)}</strong></p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-2 rounded-lg font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={confirmOrder} disabled={isProcessing} className="flex-1 py-2 rounded-lg font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] transition-colors flex justify-center items-center">
                {isProcessing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CartPage;
