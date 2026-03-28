import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-700 text-white">
      {/* Top promo bar */}
      <div className="bg-primary-800 py-3 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-wrap gap-6 items-center justify-center sm:justify-between text-xs text-primary-100 font-medium">
          <span>🚚 Free delivery on orders above ₹199</span>
          <span>⏰ Delivery within 30 minutes</span>
          <span>🌿 100% Fresh & Quality Guaranteed</span>
          <span>🔒 Secure Payments via Razorpay</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-12 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2">
            <div className="flex items-center mb-1">
              <span className="text-orange-400 font-extrabold text-3xl leading-none">S</span>
              <span className="text-white font-bold text-3xl leading-none">toreWave</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-primary-200 font-bold mb-4">Your Daily Grocery, Delivered Fast</p>
            <p className="text-xs text-primary-200 leading-relaxed mb-4 max-w-xs">
              StoreWave delivers fresh groceries, daily essentials, and household products to your doorstep in under 30 minutes. Quality you can trust, prices you'll love.
            </p>
            <div className="space-y-1.5 text-xs text-primary-200">
              <p>📍 Madhapur, Hyderabad, Telangana – 500081</p>
              <p>📞 <a href="tel:+916303359425" className="hover:text-white transition-colors">+91 6303359425</a></p>
              <p>✉️ <a href="mailto:support@storewave.in" className="hover:text-white transition-colors">support@storewave.in</a></p>
              <p>🕒 9:00 AM – 11:00 PM, Mon – Sun</p>
            </div>
            {/* Social Links */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: 'f', label: 'Facebook', href: 'https://facebook.com' },
                { icon: '▶', label: 'YouTube', href: 'https://youtube.com' },
                { icon: '✦', label: 'Instagram', href: 'https://instagram.com' },
                { icon: '𝕏', label: 'Twitter/X', href: 'https://twitter.com' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop by Category */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Shop</h4>
            <ul className="space-y-2.5 text-xs text-primary-200">
              {[
                { label: 'Fresh Fruits & Veggies', to: '/category/Fruits & Vegetables' },
                { label: 'Groceries & Staples', to: '/category/Groceries' },
                { label: 'Dairy & Eggs', to: '/category/Dairy & Eggs' },
                { label: 'Snacks & Munchies', to: '/category/Snacks' },
                { label: 'Beverages', to: '/category/Beverages' },
                { label: 'Bakery', to: '/category/Bakery' },
                { label: 'Households', to: '/category/Households' },
                { label: 'Trending Now 🔥', to: '/products' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">My Account</h4>
            <ul className="space-y-2.5 text-xs text-primary-200">
              {[
                { label: '👤 Profile', to: '/profile' },
                { label: '❤️ Wishlist', to: '/wishlist' },
                { label: '🛒 My Cart', to: '/cart' },
                { label: '📦 My Orders', to: '/profile' },
                { label: '🚚 Track Order', to: '/track-order' },
                { label: '📍 My Addresses', to: '/profile' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Info */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 uppercase tracking-wide">Help & Info</h4>
            <ul className="space-y-2.5 text-xs text-primary-200">
              {[
                { label: 'About StoreWave', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Privacy Policy', to: '/privacy-policy' },
                { label: 'Terms & Conditions', to: '/terms' },
                { label: 'Refund Policy', to: '/refund-policy' },
                { label: 'Shipping Policy', to: '/shipping-policy' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>

            {/* Payment Badges */}
            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-widest text-primary-300 font-bold mb-3">Secure Payments</p>
              <div className="flex flex-wrap gap-2">
                {['UPI', 'Visa', 'Mastercard', 'Rupay', 'COD'].map(p => (
                  <span key={p} className="bg-white/10 border border-white/20 text-[9px] font-bold px-2 py-1 rounded text-primary-100 tracking-wide">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-300">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span>© 2025 StoreWave Supermarkets Private Limited. All rights reserved.</span>
            <span className="text-[10px] opacity-70 italic">Developed by Durgarao Goriparthi · Made with ❤️ in India</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
