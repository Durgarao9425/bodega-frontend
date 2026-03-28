import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, paymentId, method } = (location.state as any) || {};

  // If no order data, redirect home
  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  const orderId = order?.order?._id || order?._id || 'N/A';
  const total = order?.order?.totalAmount || order?.totalAmount || 0;
  const itemCount = order?.order?.items?.length || order?.items?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Success Banner */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 px-8 py-10 text-center text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full" />

          <div className="relative z-10">
            {/* Animated checkmark */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black mb-1">Order Confirmed! 🎉</h1>
            <p className="text-primary-100 text-sm font-medium">
              {method === 'Razorpay' ? 'Payment received. Your order is being prepared!' : 'Your Cash on Delivery order is confirmed!'}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="px-8 py-6 space-y-4">
          {/* Order Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
              <p className="font-bold text-gray-800 text-sm truncate">{orderId.slice(-10).toUpperCase()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
              <p className="font-extrabold text-primary-600 text-base">₹{total.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{method === 'Razorpay' ? '💳' : '💵'}</span>
                <p className="font-bold text-gray-800 text-xs truncate">{method === 'Razorpay' ? 'Online (Razorpay)' : 'Cash on Delivery'}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Items</p>
              <p className="font-bold text-gray-800 text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
            </div>
          </div>

          {/* Payment ID if online */}
          {paymentId && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-3">
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">Transaction ID</p>
              <p className="font-mono text-xs text-primary-700 break-all">{paymentId}</p>
            </div>
          )}

          {/* Delivery Timeline */}
          <div className="border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Estimated Delivery</p>
            <div className="flex gap-3 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-[9px] font-bold text-primary-500 text-center">Confirmed</p>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">📦</div>
                <p className="text-[9px] font-bold text-gray-400 text-center">Packed</p>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">🚚</div>
                <p className="text-[9px] font-bold text-gray-400 text-center">Shipped</p>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">🏠</div>
                <p className="text-[9px] font-bold text-gray-400 text-center">Delivered</p>
              </div>
            </div>
            <p className="text-center font-bold text-gray-600 text-xs mt-3">Expected within <span className="text-primary-600">30-45 minutes</span></p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              to="/profile"
              className="flex-1 text-center border-2 border-primary-500 text-primary-600 font-bold py-3 rounded-xl hover:bg-primary-50 transition-all text-sm"
            >
              📦 My Orders
            </Link>
            <Link
              to="/"
              className="flex-1 text-center bg-primary-500 text-white font-bold py-3 rounded-xl hover:bg-primary-600 transition-all text-sm shadow-md"
            >
              🛍️ Continue Shopping
            </Link>
          </div>

          <p className="text-center text-[10px] text-gray-400 pt-1">
            A confirmation will be sent to your registered mobile number. Thank you for shopping with <span className="font-bold text-primary-500">StoreWave</span>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
