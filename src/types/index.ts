// =============================================
// TypeScript Types / Interfaces
// These define the shape of our data objects
// =============================================

// User type - what we get after login
export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
}

// Product type - matches our MongoDB Product model
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: string;
  subcategory?: string;
  image: string;
  unit: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
}

// Cart item - a product with a quantity
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

// Cart - the full cart with items and total
export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

// Auth context - what we share across the app
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Cart context - what we share for cart operations
export interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}
