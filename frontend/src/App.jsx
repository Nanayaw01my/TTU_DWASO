import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

// Public pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductDetailsPage from './pages/public/ProductDetailsPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseProducts from './pages/student/BrowseProducts';

// Vendor pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import AddProductPage from './pages/vendor/AddProductPage';
import EditProductPage from './pages/vendor/EditProductPage';
import MyProductsPage from './pages/vendor/MyProductsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorApprovalPage from './pages/admin/VendorApprovalPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ProductModerationPage from './pages/admin/ProductModerationPage';
import RegionManagementPage from './pages/admin/RegionManagementPage';

// Shared
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';
import MessagesPage from './pages/shared/MessagesPage';

function App() {
  const { loading, logout } = useAuth();

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, [logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />

      {/* Student */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/browse" element={<BrowseProducts />} />
      </Route>

      {/* Vendor */}
      <Route element={<ProtectedRoute allowedRoles={['vendor', 'admin']} />}>
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/products" element={<MyProductsPage />} />
        <Route path="/vendor/products/add" element={<AddProductPage />} />
        <Route path="/vendor/products/edit/:id" element={<EditProductPage />} />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/vendors" element={<VendorApprovalPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/products" element={<ProductModerationPage />} />
        <Route path="/admin/regions" element={<RegionManagementPage />} />
      </Route>

      {/* Shared - authenticated */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'vendor', 'admin']} />}>
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:userId" element={<MessagesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
