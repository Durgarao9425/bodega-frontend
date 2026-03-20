import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#007F2D] text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-12 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center mb-1">
              <span className="text-orange-400 font-extrabold text-3xl leading-none">B</span>
              <span className="text-white font-bold text-3xl leading-none">odegaa</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-green-200 font-bold mb-4">BEST IN QUALITY</p>
            <div className="space-y-1.5 text-xs text-green-100">
              <p>📍 Matrusri Nagar, Miyapur, Hyderabad, 500049</p>
              <p>📞 Call Us: +91 8886541155</p>
              <p>✉️ supermarketsbodegaa@gmail.com</p>
              <p>🕒 9:00 AM – 6:00 PM, Mon – Sat</p>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Account</h4>
            <ul className="space-y-2.5 text-xs text-green-200">
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Shipping Details</Link></li>
            </ul>
          </div>

          {/* Useful links */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Useful Links</h4>
            <ul className="space-y-2.5 text-xs text-green-200">
              <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Help Center</h4>
            <ul className="space-y-2.5 text-xs text-green-200">
              <li><Link to="/profile" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-green-600 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-200">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span>© 2025, All copy rights reserved, Bodegaa Supermarkets Private Limited</span>
            <span className="text-[10px] opacity-80 italic font-medium">Developed By Durgarao Goriparthi</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
