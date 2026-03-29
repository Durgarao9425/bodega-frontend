import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Import Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
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
import TrackOrderPage from './pages/TrackOrderPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { PrivacyPolicyPage, TermsPage, RefundPolicyPage, ShippingPolicyPage, ContactPage, AboutPage } from './pages/StaticPages';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

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
          <ScrollToTop />
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
            <Route
              path="/track-order"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TrackOrderPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Order Success */}
            <Route path="/order-success" element={<MainLayout><OrderSuccessPage /></MainLayout>} />

            {/* Static / Info Pages */}
            <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicyPage /></MainLayout>} />
            <Route path="/terms" element={<MainLayout><TermsPage /></MainLayout>} />
            <Route path="/refund-policy" element={<MainLayout><RefundPolicyPage /></MainLayout>} />
            <Route path="/shipping-policy" element={<MainLayout><ShippingPolicyPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />

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
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
