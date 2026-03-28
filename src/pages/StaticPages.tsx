import React from 'react';
import { useNavigate } from 'react-router-dom';

interface StaticPageProps {
  title: string;
  icon: string;
  sections: { heading: string; content: string }[];
}

const StaticPage: React.FC<StaticPageProps> = ({ title, icon, sections }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-500 font-bold mb-6 hover:underline text-sm">
          ← Back
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 px-8 py-8 text-white">
            <div className="text-4xl mb-3">{icon}</div>
            <h1 className="text-2xl font-black">{title}</h1>
            <p className="text-primary-100 text-sm mt-1">StoreWave · Last updated: March 2025</p>
          </div>
          <div className="px-8 py-8 space-y-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-base font-extrabold text-gray-800 mb-2">{i + 1}. {s.heading}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => (
  <StaticPage
    title="Privacy Policy"
    icon="🔒"
    sections={[
      { heading: 'Information We Collect', content: 'We collect information you provide when you register, such as your name, phone number, and email address. We also collect your delivery addresses and order history to provide a personalized shopping experience.' },
      { heading: 'How We Use Your Information', content: 'Your information is used to process orders, send order confirmations, deliver products to the correct address, and improve our services. We do not sell your personal data to third parties.' },
      { heading: 'Payment Security', content: 'All payments are processed securely through Razorpay, a PCI-DSS compliant payment gateway. StoreWave does not store your credit/debit card information on our servers.' },
      { heading: 'Cookies', content: 'We use cookies to maintain your session, remember your cart, and improve your browsing experience. You can disable cookies in your browser settings, but some features may not work correctly.' },
      { heading: 'Data Retention', content: 'We retain your personal data for as long as your account is active or as needed to provide services. You can request deletion of your data by contacting our support team.' },
      { heading: 'Contact Us', content: 'If you have questions about this Privacy Policy, please contact us at privacy@storewave.in or through the Help & Support section in your profile.' },
    ]}
  />
);

export const TermsPage: React.FC = () => (
  <StaticPage
    title="Terms & Conditions"
    icon="📋"
    sections={[
      { heading: 'Acceptance of Terms', content: 'By accessing and using StoreWave, you accept and agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our service.' },
      { heading: 'Use of Service', content: 'StoreWave is an online grocery delivery platform. You agree to use this service only for lawful purposes and not to use the platform in any way that could damage or impair the service.' },
      { heading: 'Account Registration', content: 'You must register with your valid phone number. You are responsible for maintaining the confidentiality of your account and for all activities under your account.' },
      { heading: 'Orders & Payments', content: 'All orders placed through StoreWave are subject to acceptance. We reserve the right to cancel orders due to product unavailability, pricing errors, or suspicious activity. Payments are processed securely through Razorpay.' },
      { heading: 'Delivery Policy', content: 'We aim to deliver within 30-45 minutes for orders placed within our service area. Delivery times may vary during peak hours, public holidays, or adverse weather conditions.' },
      { heading: 'Returns & Refunds', content: 'If you receive damaged or wrong items, please report within 24 hours via the app. Refunds are processed within 5-7 business days to your original payment method.' },
      { heading: 'Limitation of Liability', content: 'StoreWave shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid for the specific order.' },
    ]}
  />
);

export const RefundPolicyPage: React.FC = () => (
  <StaticPage
    title="Refund Policy"
    icon="💰"
    sections={[
      { heading: 'Eligibility for Refunds', content: 'Refunds are available if you received damaged, expired, or incorrect items. You must report the issue within 24 hours of delivery with photo evidence through the app or by contacting support.' },
      { heading: 'Non-Refundable Items', content: 'Perishable goods (fruits, vegetables, dairy) are non-refundable unless damaged at delivery. Open or used products, and items reported after 24 hours, are not eligible.' },
      { heading: 'Refund Process', content: 'Once approved, refunds are processed within 5-7 business days. For online payments (Razorpay), funds are returned to your original payment method. For COD orders, refunds are issued as store credits.' },
      { heading: 'Order Cancellation', content: 'Orders can be cancelled within 5 minutes of placement. After this window, the order may already be in processing and cannot be cancelled. Contact support immediately if needed.' },
      { heading: 'Contact for Refunds', content: 'Email us at refunds@storewave.in or call +91-9876543210. Please have your Order ID ready when contacting support.' },
    ]}
  />
);

export const ShippingPolicyPage: React.FC = () => (
  <StaticPage
    title="Shipping & Delivery"
    icon="🚚"
    sections={[
      { heading: 'Delivery Areas', content: 'StoreWave currently delivers within city limits. Enter your pincode at checkout to check if delivery is available in your area. We are continuously expanding to new areas.' },
      { heading: 'Delivery Time', content: 'We promise delivery within 30 minutes for most orders. During peak hours (8-10 AM, 5-8 PM) and weekends, delivery may take up to 45-60 minutes.' },
      { heading: 'Delivery Charges', content: 'Free delivery on orders above ₹199. A delivery charge of ₹25 applies on orders below ₹199. Express delivery (15 minutes) incurs an additional charge of ₹50.' },
      { heading: 'Delivery Tracking', content: 'Track your order in real-time via the Track Order feature in your profile. You will also receive SMS updates at each stage of delivery.' },
      { heading: 'Missed Deliveries', content: 'Our delivery partner will attempt delivery once. If you are unavailable, the order may be left with a neighbor (with consent) or returned to the warehouse for re-scheduling.' },
    ]}
  />
);

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-500 font-bold mb-6 hover:underline text-sm">← Back</button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 px-8 py-8 text-white">
            <div className="text-4xl mb-3">📞</div>
            <h1 className="text-2xl font-black">Contact Us</h1>
            <p className="text-primary-100 text-sm mt-1">We're here to help 24/7</p>
          </div>
          <div className="px-8 py-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: '📧', label: 'Email Support', value: 'support@storewave.in', note: 'Response within 2 hours' },
              { icon: '📱', label: 'Phone Support', value: '+91-9876543210', note: 'Available 8 AM – 10 PM' },
              { icon: '💬', label: 'WhatsApp', value: '+91-9876543210', note: 'Quick responses' },
              { icon: '🏢', label: 'Head Office', value: 'Hyderabad, Telangana', note: 'India – 500001' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-extrabold text-gray-800 text-sm">{item.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="px-8 pb-8">
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
              <p className="text-sm font-bold text-primary-700 mb-1">🕐 Support Hours</p>
              <p className="text-xs text-gray-500">Monday – Sunday: 8:00 AM to 10:00 PM IST. For urgent issues, use WhatsApp for faster response.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AboutPage: React.FC = () => (
  <StaticPage
    title="About StoreWave"
    icon="🌊"
    sections={[
      { heading: 'Our Story', content: 'StoreWave was founded in 2023 with a simple mission: make grocery shopping effortless. We believe everyone deserves access to fresh, quality products delivered right to their doorstep in under 30 minutes.' },
      { heading: 'Our Mission', content: 'To become India\'s most trusted hyperlocal grocery delivery platform by offering the widest selection, best prices, and fastest delivery — consistently, every single day.' },
      { heading: 'What We Offer', content: 'From fresh fruits and vegetables to household essentials, personal care products, dairy, snacks, and beverages — StoreWave stocks over 5,000+ products across 20+ categories to meet all your daily needs.' },
      { heading: 'Quality Promise', content: 'Every product on StoreWave is sourced from verified suppliers and quality-checked before dispatch. We partner only with brands that meet our strict quality and freshness standards.' },
      { heading: 'Our Team', content: 'We are a team of passionate entrepreneurs, engineers, and delivery heroes based in Hyderabad. Our network of dark stores ensures last-mile delivery within 30 minutes across the city.' },
      { heading: 'Sustainability', content: 'We are committed to sustainable practices — from eco-friendly packaging to route optimization that reduces carbon emissions. Every order you place, we plant a tree. 🌱' },
    ]}
  />
);
