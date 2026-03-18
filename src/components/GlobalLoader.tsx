import React from 'react';

/**
 * GlobalLoader — shown while AuthContext is still checking localStorage.
 * Prevents a flash of the login page on refresh.
 */
const GlobalLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-end">
          <span className="text-orange-500 font-extrabold text-5xl leading-none">B</span>
          <span className="text-[#007F2D] font-bold text-5xl leading-none tracking-tight">odegaa</span>
        </div>
        <span className="text-[10px] uppercase tracking-[4px] text-gray-400 font-bold">BEST IN QUALITY</span>

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-[#007F2D]/20 border-t-[#007F2D] rounded-full animate-spin mt-2" />
      </div>
    </div>
  );
};

export default GlobalLoader;
