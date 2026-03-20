import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Login Page - User enters their phone number
// This is the first page the user sees
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // State for the phone number input
  const [phone, setPhone] = useState('');
  // Loading state while API call is in progress
  const [isLoading, setIsLoading] = useState(false);
  // Error message to show the user
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phone number (must be 10 digits for Indian numbers)
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setIsLoading(true);

      // Call the backend to send OTP
      const response = await api.post('/auth/send-otp', { phone });

      // Navigate to OTP verification page
      // We pass phone and otp (for demo) via router state
      navigate('/verify-otp', {
        state: {
          phone,
          otp: response.data.otp, // In real app, this wouldn't be sent!
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding (visible on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#007F2D] to-[#005c20] flex-col items-center justify-center p-12 text-white">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-5xl font-bold mb-2">bodegaa</h1>
          <p className="text-primary-100 text-xl">Your Neighbourhood Store</p>
        </div>

        {/* Features */}
        <div className="space-y-4 w-full max-w-sm">
          {[
            { icon: '⚡', text: '30-minute delivery' },
            { icon: '🥦', text: 'Fresh groceries daily' },
            { icon: '💰', text: 'Best prices guaranteed' },
            { icon: '📱', text: 'Easy phone number login' },
          ].map((feature) => (
            <div key={feature.text} className="flex items-center gap-3 bg-white bg-opacity-20 rounded-xl p-4">
              <span className="text-2xl">{feature.icon}</span>
              <span className="font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="text-5xl mb-3 flex justify-center">
              <span className="p-3 bg-[#007F2D] rounded-2xl shadow-lg">🛒</span>
            </div>
            <h1 className="text-4xl font-black text-[#007F2D] tracking-tight">bodegaa</h1>
            <p className="text-gray-500 font-medium">Your Neighbourhood Store</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-800 mb-2">Login</h2>
              <p className="text-gray-500 text-sm">
                Enter your phone number to receive a secure OTP
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Phone Number
                </label>
                <div className="flex border-2 border-gray-100 rounded-2xl overflow-hidden focus-within:border-[#007F2D] focus-within:ring-4 focus-within:ring-[#007F2D]/10 transition-all duration-300 bg-gray-50">
                  {/* Country Code */}
                  <span className="bg-white px-2 flex items-center text-gray-600 font-bold text-sm border-r border-gray-100">
                    IN +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(value);
                    }}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-4 py-4 outline-none text-gray-800 text-base font-medium bg-transparent"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-4 rounded-2xl flex items-center gap-2 animate-shake">
                  <span className="text-base">⚠️</span> {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className={`
                  w-full py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 shadow-lg
                  ${isLoading || phone.length < 10
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-[#007F2D] hover:bg-[#006e27] hover:shadow-[#007F2D]/30 active:scale-[0.98]'
                  }
                `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Get OTP <span className="text-xl">→</span>
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              By continuing, you agree to our Terms of Service & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
