import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-500 text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-12 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center mb-1">
              <span className="text-orange-400 font-extrabold text-3xl leading-none">S</span>
              <span className="text-white font-bold text-3xl leading-none">toreWave</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-blue-100 font-bold mb-4">BEST IN QUALITY</p>
            <div className="space-y-1.5 text-xs text-blue-100">
              <p>📍 Madhapur Sri Harsha Mens PG, Hyderabad</p>
              <p>📞 Call Us: +91 6303359425</p>
              <p>✉️ veeradurgarao840@gmail.com</p>
              <p>🕒 9:00 AM – 11:00 PM, Mon – Sat</p>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Account</h4>
            <ul className="space-y-2.5 text-xs text-blue-100">
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Shipping Details</Link></li>
            </ul>
          </div>

          {/* Useful links */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Useful Links</h4>
            <ul className="space-y-2.5 text-xs text-blue-100">
              <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Help Center</h4>
            <ul className="space-y-2.5 text-xs text-blue-100">
              <li><Link to="/profile" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-100">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span>© 2025, All copy rights reserved, StoreWave Supermarkets Private Limited</span>
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
