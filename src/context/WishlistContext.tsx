import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();

  // Fetch wishlist from backend (stored per user in MongoDB)
  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await api.get('/user/me');
      if (res.data.user && res.data.user.wishlist) {
        setWishlistItems(res.data.user.wishlist);
      }
    } catch (error) {
      console.error('Error fetching profile/wishlist', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Auto-fetch wishlist on login; clear on logout
  useEffect(() => {
    if (user && token) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user, token, fetchWishlist]);

  // Toggle wishlist item with optimistic update
  const toggleWishlist = useCallback(async (productId: string) => {
    if (!user) return; // Prevent if not logged in

    // Optimistic UI update
    setWishlistItems(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      return [...prev, productId];
    });

    try {
      const res = await api.post('/user/wishlist', { productId });
      // Sync with server response (ensure consistency)
      setWishlistItems(res.data.wishlist);
    } catch (error) {
      console.error('Failed to toggle wishlist server-side', error);
      // Revert if failed by refetching
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  const isInWishlist = useCallback((productId: string) => wishlistItems.includes(productId), [wishlistItems]);
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, isLoading, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
