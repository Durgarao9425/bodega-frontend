import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const SUB_CATEGORIES_DATA = [
  { name: 'Detergents & Cleaning', path: '/products?search=cleaning', img: 'https://images.unsplash.com/photo-1584824486509-11459466a200?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Snacks & Beverages', path: '/products?search=snacks', img: 'https://images.unsplash.com/photo-1621939514649-280e220a6a16?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Soaps & Handwash', path: '/products?search=soap', img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Pooja Items', path: '/products?search=pooja', img: 'https://images.unsplash.com/photo-1604652716182-de2f8ab96e1f?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Hair care', path: '/products?search=hair', img: 'https://images.unsplash.com/photo-1608248593842-8d76a5ebaf65?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Pasta & Noodles', path: '/products?search=pasta', img: 'https://images.unsplash.com/photo-1612845347250-9833cb9e2a63?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Sauces & Spreads', path: '/products?search=sauce', img: 'https://images.unsplash.com/photo-1608151816518-8f85f1c4e7ab?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Cereals & Breakfast', path: '/products?search=cereal', img: 'https://images.unsplash.com/photo-1521655160-5f212261ce5d?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Dental Care', path: '/products?search=dental', img: 'https://images.unsplash.com/photo-1606811841689-1052bd2a6321?auto=format&fit=crop&q=80&w=400&h=400' },
  { name: 'Face Wash & Scrubs', path: '/products?search=face', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400&h=400' },
];

const SubcategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-[#007F2D] text-center mb-8 tracking-wide">
          Shop by subcategories
        </h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-8">
          {SUB_CATEGORIES_DATA.map(sub => (
            <div 
              key={sub.name} 
              onClick={() => navigate(sub.path)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md mb-3">
                <img 
                  src={sub.img} 
                  alt={sub.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => (e.target as HTMLImageElement).src = `https://placehold.co/400x400/f0fdf4/007F2D?text=${encodeURIComponent(sub.name)}`}
                />
              </div>
              <p className="font-bold text-gray-800 text-sm md:text-base text-center group-hover:text-[#007F2D] transition-colors line-clamp-2 px-1">
                {sub.name}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SubcategoriesPage;
