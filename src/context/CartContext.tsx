import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Cart, CartContextType } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';

// Create the cart context
const CartContext = createContext<CartContextType | null>(null);

// Cart Provider - manages all cart state and operations
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Prevent duplicate simultaneous fetches
  const [hasFetched, setHasFetched] = useState(false);

  // Calculate the total number of items in cart for the header badge
  const cartCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  // Fetch the current user's cart from the backend
  const fetchCart = useCallback(async () => {
    // Only fetch if user is logged in
    if (!token) {
      setCart(null);
      setHasFetched(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get('/cart');
      setCart(response.data.cart);
      setHasFetched(true);
    } catch (error) {
      console.error('Fetch cart failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Automatically fetch cart once on login/refresh – only when token changes
  useEffect(() => {
    if (token && !hasFetched) {
      fetchCart();
    }
    if (!token) {
      setCart(null);
      setHasFetched(false);
    }
  }, [token, hasFetched, fetchCart]);

  // Add a product to the cart (sets a specific quantity if item doesn't exist, or increments)
  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      setCart(response.data.cart); // Update cart state with response
    } catch (error) {
      console.error('Add to cart failed:', error);
      throw error; // Re-throw so the component can show an error message
    }
  };

  // Update quantity of a product in cart
  // If quantity <= 0 the backend will remove the item
  const updateQuantity = async (productId: string, quantity: number) => {
    // Optimistic UI update for immediate feedback
    setCart(prev => {
      if (!prev) return prev;
      if (quantity <= 0) {
        return {
          ...prev,
          items: prev.items.filter(item => item.product?._id !== productId),
          totalPrice: prev.items
            .filter(item => item.product?._id !== productId)
            .reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0),
        };
      }
      return {
        ...prev,
        items: prev.items.map(item =>
          item.product?._id === productId ? { ...item, quantity } : item
        ),
        totalPrice: prev.items
          .map(item => item.product?._id === productId ? { ...item, quantity } : item)
          .reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0),
      };
    });

    try {
      const response = await api.put('/cart/update', { productId, quantity });
      setCart(response.data.cart); // Sync with real server data
    } catch (error) {
      console.error('Update quantity failed:', error);
      fetchCart(); // Revert on failure
      throw error;
    }
  };

  // Remove a product from the cart completely
  const removeFromCart = async (productId: string) => {
    // Optimistic UI update
    setCart(prev => {
      if (!prev) return prev;
      const newItems = prev.items.filter(item => item.product?._id !== productId);
      return {
        ...prev,
        items: newItems,
        totalPrice: newItems.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0),
      };
    });

    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      setCart(response.data.cart);
    } catch (error) {
      console.error('Remove from cart failed:', error);
      fetchCart(); // Revert on failure
      throw error;
    }
  };

  // Clear all items from the cart
  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart(null);
    } catch (error) {
      console.error('Clear cart failed:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, cartCount, isLoading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
// Usage: const { cart, addToCart } = useCart();
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
};
