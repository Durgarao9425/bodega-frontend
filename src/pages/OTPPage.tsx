import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// OTP Verification Page
// User enters the 6-digit OTP they received
const OTPPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { fetchCart } = useCart();

  // Get phone and demo OTP from navigation state (passed from LoginPage)
  const { phone, otp: demoOtp } = (location.state as { phone: string; otp?: string }) || {};

  // If someone navigates here directly without going through login
  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  // State for each digit of the 6-digit OTP
  // We use an array of 6 strings for individual input boxes
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Countdown timer for OTP expiry (5 minutes = 300 seconds)
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);

  // Refs for each input box - so we can auto-focus the next one
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Format seconds into mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handle individual OTP digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(-1);

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-move to next input when a digit is entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key - move to previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste - fill all 6 boxes at once
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtpDigits(newDigits);
    // Focus last filled input
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  // Handle OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otp = otpDigits.join('');
    if (otp.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/auth/verify-otp', { phone, otp });

      // Save user and token to context (and localStorage)
      login(response.data.user, response.data.token);

      // Fetch the user's cart after login
      await fetchCart();

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      await api.post('/auth/send-otp', { phone });
      setCountdown(300);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-500 mb-6 transition-colors"
        >
          ← Back to Login
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📱</div>
            <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter the 6-digit OTP sent to
            </p>
            <p className="font-semibold text-gray-800">+91 {phone}</p>
          </div>

          {/* Demo OTP Notice - only in development */}
          {demoOtp && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-center">
              <p className="text-xs text-blue-600 font-medium">🧪 Demo Mode</p>
              <p className="text-sm text-blue-800 font-bold mt-1">Your OTP: {demoOtp}</p>
              <p className="text-xs text-blue-500">(In production, this would be sent via SMS)</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input Boxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter OTP
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    className={`
                      w-12 h-12 text-center text-xl font-bold rounded-xl border-2 outline-none transition-colors
                      ${digit
                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                        : 'border-gray-200 text-gray-800 focus:border-primary-400'
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {!canResend ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in <span className="font-bold text-primary-500">{formatTime(countdown)}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary-500 font-semibold text-sm hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl text-center">
                ⚠️ {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otpDigits.join('').length < 6}
              className={`
                w-full py-3 rounded-xl text-white font-semibold text-sm transition-all
                ${isLoading || otpDigits.join('').length < 6
                  ? 'bg-primary-300 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 active:scale-95'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </span>
              ) : (
                'Verify & Login ✓'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
