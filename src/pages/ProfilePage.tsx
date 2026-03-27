import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('Account Info');
  const [profileLoading, setProfileLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');

  // Fetch latest profile from server on mount
  useEffect(() => {
    if (!user) { setProfileLoading(false); return; }
    setProfileLoading(true);
    api.get('/user/me')
      .then(res => {
        if (res.data.user) {
          setName(res.data.user.name || '');
          setEmail(res.data.user.email || '');
        }
      })
      .catch(console.error)
      .finally(() => setProfileLoading(false));
  }, [user]);

  const handleSave = async () => {
    try {
      await api.put('/user/profile', { name, email });
      updateUser({ name, email });
      setIsEditing(false);
      setSaveMsg('Profile updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('Failed to save. Try again.');
    }
  };

  const tabs = [
    { id: 'Account Info', icon: '👤' },
    { id: 'My Order', icon: '📦' },
    { id: 'My Address', icon: '📍' },
    { id: 'Notifications', icon: '🔔' },
    { id: 'Logout', icon: '🚪' },
  ];

  return (
    <div className="bg-[#f8f9fa]">
      <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-64 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 font-bold mb-5 hover:text-[#0ea5e9] transition-colors text-sm"
          >
            ←  Back
          </button>

          {/* User avatar + name */}
          <div className="bg-[#0ea5e9] rounded-xl p-4 mb-3 flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
              {name?.trim() ? name.charAt(0).toUpperCase() : user?.phone?.slice(-2) ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{name || 'My Profile'}</p>
              <p className="text-xs text-green-200 truncate">+91 {user?.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => tab.id === 'Logout' ? (logout(), navigate('/login')) : setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3.5 font-semibold text-sm border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors ${activeTab === tab.id && tab.id !== 'Logout'
                    ? 'bg-[#0ea5e9] text-white'
                    : tab.id === 'Logout'
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-gray-600 hover:text-[#0ea5e9] hover:bg-green-50'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.id}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0">

          {/* Account Info */}
          {activeTab === 'Account Info' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-extrabold text-gray-900">Account Info</h1>
                {saveMsg && (
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${saveMsg.includes('success') ? 'bg-green-50 text-[#0ea5e9]' : 'bg-red-50 text-red-500'}`}>
                    {saveMsg}
                  </span>
                )}
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#0ea5e9] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#0284c7] transition-colors"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setIsEditing(false); }}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-[#0ea5e9] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#0284c7] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm">
                {/* Avatar strip */}
                <div className="w-full bg-green-50 rounded-xl h-28 mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-[#0ea5e9] rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-md">
                    {name?.trim() ? name.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Full Name *</label>
                    {profileLoading ? (
                      <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
                    ) : (
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30 focus:border-[#0ea5e9] bg-white disabled:bg-gray-50 disabled:text-gray-500 transition"
                      />
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Email Address *</label>
                    {profileLoading ? (
                      <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
                    ) : (
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your email address"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30 focus:border-[#0ea5e9] bg-white disabled:bg-gray-50 disabled:text-gray-500 transition"
                      />
                    )}
                  </div>

                  {/* Phone (read-only) */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                    <input
                      type="text"
                      value={user?.phone ? `+91 ${user.phone}` : ''}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-gray-400">Phone number is linked to your account and cannot be changed.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty states or Orders */}
          {activeTab === 'My Order' && (
            <OrdersTab />
          )}

          {activeTab === 'My Address' && (
            <AddressesTab />
          )}

          {activeTab === 'Notifications' && (
            <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[260px]">
              <span className="text-5xl mb-4">🔔</span>
              <h2 className="text-gray-800 font-bold mb-1 text-lg">{activeTab}</h2>
              <p className="text-sm text-gray-400">This section is currently empty.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/order/my-orders').then(res => {
      setOrders(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Loading Orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[260px]">
        <span className="text-5xl mb-4">📦</span>
        <h2 className="text-gray-800 font-bold mb-1 text-lg">No Orders Yet</h2>
        <p className="text-sm text-gray-400">You haven't placed any orders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-gray-900 mb-5">My Orders</h1>
      {orders.map(order => (
        <div key={order._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Order ID: {order._id}</p>
              <p className="text-[11px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="bg-green-50 text-[#0ea5e9] text-xs font-bold px-3 py-1.5 rounded-full border border-green-200">
              {order.status || 'Pending'}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex gap-4 items-center">
                <img src={item.image || 'https://placehold.co/40x40/f3f4f6/9ca3af?text=Pic'} alt={item.name} className="w-12 h-12 object-contain border border-gray-100 rounded p-1 shadow-sm" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
                </div>
                <p className="font-bold text-[#0ea5e9] text-sm hidden sm:block">₹{item.quantity * item.price}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-50">
            <div className="text-xs text-gray-500">
              <span className="font-bold text-gray-700">Deliver To:</span> {order.deliveryAddress?.fullName || 'N/A'}, {order.deliveryAddress?.addressLine1 || ''}
            </div>
            <p className="text-sm">Total: <span className="font-extrabold text-gray-900 text-lg">₹{order.totalAmount}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
}

const AddressesTab = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/addresses').then(res => {
      setAddresses(res.data.addresses || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Loading Addresses...</div>;

  if (addresses.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[260px]">
        <span className="text-5xl mb-4">📍</span>
        <h2 className="text-gray-800 font-bold mb-1 text-lg">No Address Found</h2>
        <p className="text-sm text-gray-400">Please add an address during checkout to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-gray-900 mb-5">My Delivery Addresses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm relative hover:border-[#0ea5e9] transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${addr.type === 'Home' ? 'bg-green-50 text-[#0ea5e9]' : 'bg-blue-50 text-blue-600'}`}>
                {addr.type || 'Other'}
              </span>
              <button className="text-gray-300 group-hover:text-gray-400 group-hover:scale-110 transition-all">✏️</button>
            </div>
            <p className="font-bold text-gray-800 text-sm mb-1">{addr.fullName}</p>
            <p className="text-xs text-gray-400 font-bold mb-3">+91 {addr.mobile}</p>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {addr.flatNo}, {addr.addressLine1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
