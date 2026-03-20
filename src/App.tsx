import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { useAuth } from './context/AuthContext';

// Import Components
import ProtectedRoute from './components/ProtectedRoute';
import GlobalLoader from './components/GlobalLoader';
import MainLayout from './components/MainLayout';

// Import Pages
import LoginPage from './pages/LoginPage';
import OTPPage from './pages/OTPPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import SubcategoriesPage from './pages/SubcategoriesPage';

// Inner component that uses auth context for global loader
const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();

  // Show branded loader while checking auth state (prevents flash of login page on refresh)
  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes - Anyone can browse! */}
            <Route path="/" element={<MainLayout><DashboardPage /></MainLayout>} />
            <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
            <Route path="/category/:categoryName" element={<MainLayout><ProductsPage /></MainLayout>} />
            <Route path="/category/:categoryName/subcategories" element={<MainLayout><SubcategoriesPage /></MainLayout>} />
            <Route path="/subcategories" element={<MainLayout><SubcategoriesPage /></MainLayout>} />
            <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OTPPage />} />

            {/* Protected Routes - Only logged in users can access */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CartPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProductsPage isWishlist={true} />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirects */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
