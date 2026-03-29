import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
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
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' | '' }>({ msg: '', type: '' });
  const [formData, setFormData] = useState({
    fullName: '', mobile: '', addressLine1: '', flatNo: '', type: 'Home'
  });
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 4000);
  };

  useEffect(() => {
    if (user) {
      setIsAddressLoading(true);
      api.get('/user/addresses').then(res => {
        setAddresses(res.data.addresses || []);
        if (res.data.addresses?.length > 0) {
          setSelectedAddressId(res.data.addresses[0]._id);
        }
      }).catch(console.error).finally(() => setIsAddressLoading(false));
    } else {
      setIsAddressLoading(false);
    }
  }, [user]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return showToast('Please login to save address', 'error');
    if (isSavingAddress) return; // prevent double submit
    setIsSavingAddress(true);
    try {
      const res = await api.post('/user/address', formData);
      setAddresses(res.data.addresses);
      setSelectedAddressId(res.data.addresses[res.data.addresses.length - 1]._id);
      setShowAddModal(false);
      setFormData({ fullName: '', mobile: '', addressLine1: '', flatNo: '', type: 'Home' });
      showToast('Address saved successfully! 🏠', 'success');
    } catch {
      showToast('Failed to save address. Please try again.', 'error');
    } finally {
      setIsSavingAddress(false);
    }
  };

  if (isCartLoading && !cart) {
    return (
      <div className="bg-gray-50 flex flex-col min-h-screen items-center justify-center">
        <Loader text="Loading your cart..." size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-gray-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="text-7xl mb-6 opacity-40">🛒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <button onClick={() => navigate('/products')} className="bg-primary-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-600 mt-5">
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
    if (isProcessing) return;
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

      if (paymentMethod === 'Razorpay') {
        const razorpayAmount = Math.round(Number(grandTotal.toFixed(2)) * 100);
        
        const options = {
          key: 'rzp_test_SWMGlUfAqZEvOA',
          amount: razorpayAmount,
          currency: 'INR',
          name: 'StoreWave',
          description: 'Payment for your grocery order',
          image: '',
          handler: async function (response: any) {
            try {
              const orderRes = await api.post('/order/create', {
                items, deliveryAddress: address, subTotal, deliveryFee: deliveryCharges, totalAmount: grandTotal, paymentMethod: 'Razorpay', razorpayPaymentId: response.razorpay_payment_id
              });
              clearCart();
              setShowConfirmModal(false);
              navigate('/order-success', { state: { order: orderRes.data, paymentId: response.razorpay_payment_id, method: 'Razorpay' } });
            } catch (err) {
              showToast('Error saving order. Please contact support.', 'error');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user?.name,
            contact: user?.phone
          },
          notes: {
            address: address?.addressLine1 || ''
          },
          theme: { color: 'var(--color-primary-600, #0f766e)' },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setShowConfirmModal(false);
              showToast('Payment cancelled. Please try again.', 'info');
            }
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          setIsProcessing(false);
          setShowConfirmModal(false);
          showToast(`Payment failed: ${resp.error?.description || 'Please try another method.'}`, 'error');
        });
        rzp.open();
        // Do NOT set isProcessing to false here. Wait for handler or ondismiss.
      } else {
          const orderRes = await api.post('/order/create', {
            items, deliveryAddress: address, subTotal, deliveryFee: deliveryCharges, totalAmount: grandTotal, paymentMethod: 'Cash on Delivery'
          });
          clearCart();
          setIsProcessing(false);
          setShowConfirmModal(false);
          navigate('/order-success', { state: { order: orderRes.data, method: 'Cash on Delivery' } });
        }
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

      {/* GLOBAL TOAST (Fixed for Mobile Cutoff) */}
      {toast.msg && (
        <div className="fixed bottom-10 left-4 right-4 z-[999] flex justify-center animate-fade-in pointer-events-none">
          <div className={`px-4 py-3 rounded-2xl font-bold text-sm shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex items-center gap-3 w-full max-w-[400px] border-2 pointer-events-auto ${toast.type === 'success' ? 'bg-primary-50 text-primary-600 border-primary-200' : toast.type === 'error' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
            <span className="text-xl shrink-0">
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span className="leading-tight truncate sm:whitespace-normal">{toast.msg}</span>
          </div>
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
                    <span className="text-xs text-gray-400 line-through">₹{(item.product.originalPrice || 0).toFixed(2)}</span>
                    <span className="font-bold text-primary-600 text-sm">₹{(item.product?.price || item.price).toFixed(2)}</span>
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
              <p className="text-primary-600 font-bold text-xs uppercase tracking-wide">Congratulations! You've unlocked FREE DELIVERY ✨</p>
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
                <span className="font-bold text-gray-800">{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6 px-4">
              <span className="font-extrabold text-gray-900">Total Amount</span>
              <span className="font-extrabold text-gray-900 text-lg">₹{grandTotal.toFixed(2)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="border border-primary-500 text-primary-600 font-bold py-3 px-6 rounded-xl hover:bg-primary-50 text-center flex-1 text-sm flex items-center justify-center gap-2">
                + Add More items
              </Link>
              <button onClick={handleCheckoutClick} className="bg-primary-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-600 text-center flex-1 focus:ring-4 focus:ring-primary-100 transition-colors shadow-lg active:scale-95 text-lg">
                Checkout
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Addresses & Payment */}
        <div className="w-full lg:w-[40%] space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">My Addresses</h2>
              <button onClick={() => setShowAddModal(true)} className="text-primary-500 text-sm font-bold hover:underline flex items-center gap-1">
                + Add Address
              </button>
            </div>

            {isAddressLoading ? (
              <Loader text="Loading addresses..." />
            ) : !user ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 h-48">
                <p className="text-sm text-gray-500 font-medium text-center">Please login to add a delivery address.</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="border-2 border-dashed border-primary-200 rounded-xl p-8 flex flex-col items-center justify-center bg-primary-50/30 text-center h-48 cursor-pointer hover:bg-primary-50 transition-colors" onClick={() => setShowAddModal(true)}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-2xl">📍</div>
                <p className="font-bold text-gray-800 mb-1">No Address Added Yet</p>
                <p className="text-[11px] text-gray-500 px-4">Please add a delivery address to proceed with checkout and complete your order.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id)}
                    className={`border rounded-xl p-4 cursor-pointer relative flex gap-3 transition-all ${selectedAddressId === addr._id ? 'border-primary-500 bg-primary-50 shadow-sm ring-1 ring-primary-500/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div className="pt-1 select-none">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAddressId === addr._id ? 'border-primary-500 bg-primary-500' : 'border-gray-300 bg-white'}`}>
                        {selectedAddressId === addr._id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800 mb-1">{addr.fullName} <span className="text-gray-400 font-normal">({addr.mobile})</span> | <span className="font-bold text-primary-600">{addr.type}</span></p>
                      <p className="text-xs text-gray-500 leading-tight pr-6 relative font-medium">{addr.flatNo}, {addr.addressLine1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: 'Razorpay', label: 'Online Payment', icon: '💳', desc: 'UPI, Cards, Netbanking (Secure)' },
                { id: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your groceries arrive' },
              ].map(method => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`border rounded-xl p-4 cursor-pointer flex gap-4 transition-all items-center ${paymentMethod === method.id ? 'border-primary-500 bg-primary-50 shadow-sm ring-1 ring-primary-500/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <div className="text-2xl">{method.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-800">{method.label}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{method.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-primary-500 bg-primary-500' : 'border-gray-300 bg-white'}`}>
                    {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Add Address Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-primary-600 text-2xl font-black">Add New Address</h2>
              <button
                type="button"
                onClick={() => !isSavingAddress && setShowAddModal(false)}
                disabled={isSavingAddress}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-40"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Full Name *</label>
                  <input required placeholder="Enter your name" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-primary-500 outline-none text-sm font-bold transition-all" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Mobile *</label>
                  <input required placeholder="10 digit mobile number" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-primary-500 outline-none text-sm font-bold transition-all" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Address *</label>
                <input required placeholder="Area, Street, Sector, Village" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-primary-500 outline-none text-sm font-bold transition-all" value={formData.addressLine1} onChange={e => setFormData({ ...formData, addressLine1: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Flat / Building No *</label>
                  <input required className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-primary-500 outline-none text-sm font-bold transition-all" value={formData.flatNo} onChange={e => setFormData({ ...formData, flatNo: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Address Type *</label>
                  <select className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-primary-500 outline-none text-sm bg-white font-bold transition-all cursor-pointer" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option>Home</option>
                    <option>Office</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {/* Save Button with Loading Spinner */}
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-black hover:bg-primary-600 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSavingAddress ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Address...
                    </>
                  ) : (
                    'Save Address'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => !isSavingAddress && setShowAddModal(false)}
                  disabled={isSavingAddress}
                  className="flex-1 border-2 border-primary-500 text-primary-500 py-3 rounded-xl font-black hover:bg-primary-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm Checkout Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center transform inline-block">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl mx-auto mb-4">
              🛒
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-2">Confirm Order?</h2>
            <p className="text-gray-500 text-sm mb-6">Placing order via <strong className="text-primary-600 uppercase">{paymentMethod === 'Razorpay' ? 'Secure Online Payment' : 'Cash on Delivery'}</strong>. Total Amount: <strong className="text-gray-900">₹{grandTotal.toFixed(2)}</strong></p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-2 rounded-lg font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={confirmOrder} disabled={isProcessing} className="flex-1 py-2 rounded-lg font-bold text-white bg-primary-500 hover:bg-primary-600 transition-colors flex justify-center items-center">
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
