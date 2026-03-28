import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

// Structure shared with Dashboard for consistency
const CATEGORY_DATA: Record<string, { name: string, img: string }[]> = {
  'Groceries': [
    { name: 'Aata, Maida & Besan', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400&h=400&fit=crop' },
    { name: 'Dals & Pulses', img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=400&h=400&fit=crop' },
    { name: 'Masala & Spices', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&h=400&fit=crop' },
    { name: 'Oil & Ghee', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400&h=400&fit=crop' },
    { name: 'Rice & Grains', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&h=400&fit=crop' },
  ],
  'Households': [
    { name: 'Breakfast & cereals', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&h=400&fit=crop' },
    { name: 'Detergents & Cleaning', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=400&h=400&fit=crop' },
    { name: 'Facewash & skincare', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&h=400&fit=crop' },
    { name: 'Hair care', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400&h=400&fit=crop' },
    { name: 'Oral care', img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=400&h=400&fit=crop' },
    { name: 'Pasta & noodles', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&h=400&fit=crop' },
    { name: 'Soaps & body wash', img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=400&h=400&fit=crop' },
  ],
  'Fruits & Vegetables': [
    { name: 'Fruits', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&h=400&fit=crop' },
    { name: 'Vegetables', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=400&h=400&fit=crop' },
    { name: 'Fresh Fruits', img: 'https://images.unsplash.com/photo-1457296898342-cdd24585d095?q=80&w=400&h=400&fit=crop' },
  ],
  'Dairy': [
    { name: 'Milk', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&h=400&fit=crop' },
    { name: 'Butter & Cheese', img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=400&h=400&fit=crop' },
    { name: 'Eggs', img: 'https://images.unsplash.com/photo-1506976773555-b38a08c5c7db?q=80&w=400&h=400&fit=crop' },
  ],
  'Snacks': [
    { name: 'Chips & Crisps', img: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=400&h=400&fit=crop' },
    { name: 'Biscuits & Cookies', img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=400&fit=crop' },
  ],
  'Beverages': [
    { name: 'Tea & Coffee', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab752?q=80&w=400&h=400&fit=crop' },
    { name: 'Soft Drinks', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&h=400&fit=crop' },
  ],
  'Bakery': [
    { name: 'Bread & Pav', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&h=400&fit=crop' },
    { name: 'Cakes & Muffins', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=400&h=400&fit=crop' },
  ],
  'Dry Fruits': [
    { name: 'Premium Nuts', img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=400&h=400&fit=crop' },
    { name: 'Dates', img: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=400&h=400&fit=crop' },
  ],
};

const DEFAULT_ITEMS = [
  { name: 'Detergents & Cleaning', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=400&h=400' },
  { name: 'Breakfast & cereals', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&h=400' },
  { name: 'Facewash & skincare', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&h=400' },
];

const SubcategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName: string }>();

  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : '';
  
  // Case-insensitive lookup for category data
  const normalizedCategory = Object.keys(CATEGORY_DATA).find(
    key => key.toLowerCase() === decodedCategory.toLowerCase()
  );
  
  const items = normalizedCategory ? CATEGORY_DATA[normalizedCategory] : DEFAULT_ITEMS;

  return (
    <div className="bg-white">
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-primary-500 text-center mb-8 tracking-wide">
          Shop by subcategories
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
          {items.map(sub => (
            <div
              key={sub.name}
              onClick={() => navigate(`/category/${encodeURIComponent(decodedCategory || 'All')}?subcategory=${encodeURIComponent(sub.name)}`)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl mb-4">
                <img
                  src={sub.img}
                  alt={sub.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => (e.target as HTMLImageElement).src = `https://placehold.co/400x400/f0fdf4/007F2D?text=${encodeURIComponent(sub.name.slice(0, 10))}`}
                />
              </div>
              <p className="font-bold text-gray-800 text-sm md:text-base text-center group-hover:text-primary-500 transition-colors leading-tight">
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
