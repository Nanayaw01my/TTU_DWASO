import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, BuildingLibraryIcon, TagIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/common/Navbar';
import ProductCard, { ProductCardSkeleton } from '../../components/common/ProductCard';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=8&sortBy=createdAt&order=desc')
      .then(({ data }) => setProducts(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="page-container py-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-200 text-sm font-medium mb-1">Welcome back,</p>
              <h1 className="text-2xl font-black mb-2">{user?.fullName}</h1>
              <div className="flex items-center gap-2">
                <span className={getInstitutionBadgeClass(user?.institutionType)}>
                  {getInstitutionLabel(user?.institutionType)}
                </span>
                <span className="text-primary-200 text-sm">{user?.institution}</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              👨‍🎓
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: ShoppingBagIcon, label: 'Browse Products', to: '/student/browse', color: 'bg-blue-500' },
            { icon: ChatBubbleLeftRightIcon, label: 'Messages', to: '/messages', color: 'bg-green-500' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-3 p-5 card hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`${item.color} p-3 rounded-xl`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Products */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent at {user?.institution}</h2>
          <Link to="/student/browse" className="text-sm font-semibold text-primary-600 hover:underline">View All</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No products yet</h3>
            <p className="text-gray-400 mt-1 text-sm">No vendors have listed products at your institution yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
