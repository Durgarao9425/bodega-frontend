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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="text-4xl mb-2">🛒</div>
            <h1 className="text-3xl font-bold text-primary-500">bodegaa</h1>
            <p className="text-gray-500">Your Neighbourhood Store</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Up / Login</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Enter your phone number to receive an OTP
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-primary-500 transition-colors">
                  {/* Country Code */}
                  <span className="bg-gray-100 px-4 flex items-center text-gray-600 font-medium text-sm border-r border-gray-200">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      // Only allow digits, max 10 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(value);
                    }}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-4 py-3 outline-none text-gray-800 text-sm"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className={`
                  w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200
                  ${isLoading || phone.length < 10
                    ? 'bg-[#007F2D]/50 cursor-not-allowed'
                    : 'bg-[#007F2D] hover:bg-[#006e27] active:scale-95'
                  }
                `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </span>
                ) : (
                  'Get OTP →'
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
