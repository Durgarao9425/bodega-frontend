import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const TrackOrderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.order;

  const [orderId, setOrderId] = useState(orderData?._id || '');
  const [status, setStatus] = useState<string | null>(orderData?.status || null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    // Dummy logic for tracking
    if (orderId.length > 5) {
      setStatus('Shipped');
    } else {
      setStatus('Processing');
    }
  };

  const steps = [
    { label: 'Order Placed', time: '2:15 PM', done: true },
    { label: 'Processing', time: '2:45 PM', done: true },
    { label: 'Packed', time: '3:10 PM', done: true },
    { label: 'On the Way', time: '3:30 PM', done: status === 'Shipped' || status === 'Delivered' },
    { label: 'Delivered', time: 'Expected by 4:00 PM', done: status === 'Delivered' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="max-w-[800px] mx-auto px-4 py-10 w-full flex-1">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <span className="text-primary-500">🚚</span> Track Your Order
          </h1>

          <form onSubmit={handleTrack} className="flex gap-4 mb-10">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Enter Order ID" 
                className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-primary-500 transition-all font-bold text-gray-700"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
              />
            </div>
            <button className="bg-primary-500 text-white font-black px-10 py-4 rounded-2xl hover:bg-primary-600 transition-all shadow-lg active:scale-95">
              Track
            </button>
          </form>

          {status && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-2xl font-black text-primary-600">{status}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                  <p className="text-xl font-black text-gray-800">In 25 Minutes</p>
                </div>
              </div>

              <div className="relative pl-8 space-y-10 border-l-4 border-gray-100 ml-4">
                {steps.map((step, i) => (
                    <div key={i} className="relative">
                        <div className={`absolute -left-[42px] top-0 w-6 h-6 rounded-full border-4 border-white shadow-md ${step.done ? 'bg-primary-500' : 'bg-gray-300'}`} />
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`font-black text-lg ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                                <p className="text-sm text-gray-500 font-medium">Your items have been {step.label.toLowerCase()}</p>
                            </div>
                            <p className="text-sm font-bold text-gray-400">{step.time}</p>
                        </div>
                    </div>
                ))}
              </div>

              <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">📦</div>
                    <div>
                        <p className="font-black text-gray-800">Support Helper</p>
                        <p className="text-xs text-gray-500">Need help with your delivery?</p>
                    </div>
                </div>
                <button className="bg-white text-primary-600 font-bold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm">
                    Chat with us
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => navigate('/profile')} 
          className="mt-8 text-gray-400 font-bold hover:text-primary-500 transition-colors flex items-center gap-2 mx-auto"
        >
          ← Back to My Orders
        </button>
      </main>
    </div>
  );
};

export default TrackOrderPage;
