import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  TagIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/common/DashboardLayout';
import ProductCard, { ProductCardSkeleton } from '../../components/common/ProductCard';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';

const CATEGORIES = [
  { name: 'Books', emoji: '📚', color: 'from-blue-500 to-indigo-600' },
  { name: 'Electronics', emoji: '💻', color: 'from-sky-500 to-cyan-600' },
  { name: 'Furniture', emoji: '🪑', color: 'from-amber-500 to-orange-600' },
  { name: 'Clothes', emoji: '👕', color: 'from-pink-500 to-rose-600' },
  { name: 'Food', emoji: '🍱', color: 'from-green-500 to-emerald-600' },
  { name: 'Nursing/Medical Supplies', emoji: '🩺', color: 'from-red-500 to-rose-600' },
  { name: 'Teaching Materials', emoji: '✏️', color: 'from-teal-500 to-cyan-600' },
  { name: 'Others', emoji: '🛍️', color: 'from-gray-500 to-slate-600' },
];

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

  const totalCategories = CATEGORIES.length;

  return (
    <DashboardLayout>
      <div className="page-container py-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-sky-600 to-emerald-600 rounded-2xl p-6 text-white mb-8 shadow-lg shadow-sky-500/20">
          {/* Ghana flag strip at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
          <div className="flex items-start justify-between pt-1">
            <div>
              <p className="text-sky-100/80 text-sm font-medium mb-1">Welcome back,</p>
              <h1 className="text-2xl font-black mb-3">{user?.fullName}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                  {getInstitutionLabel(user?.institutionType)}
                </span>
                <span className="text-sky-100/80 text-sm">{user?.institution}</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0">
              🎓
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="dashboard-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-sky-500">
              <ShoppingBagIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{products.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Products Available</p>
            </div>
          </div>
          <div className="dashboard-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100">—</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
            </div>
          </div>
          <div className="dashboard-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-teal-500">
              <TagIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{totalCategories}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <Link
            to="/student/browse"
            className="flex items-center gap-3 p-4 card hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2.5 rounded-xl bg-sky-500 group-hover:bg-sky-600 transition-colors">
              <ShoppingBagIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Browse Products</p>
              <p className="text-xs text-gray-400">Find items at your campus</p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
          </Link>
          <Link
            to="/messages"
            className="flex items-center gap-3 p-4 card hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500 group-hover:bg-emerald-600 transition-colors">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Messages</p>
              <p className="text-xs text-gray-400">Chat with vendors</p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
          </Link>
        </div>

        {/* Recent Products */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent at {user?.institution}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Latest listings from vendors</p>
          </div>
          <Link to="/student/browse" className="flex items-center gap-1 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors">
            View All <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 card mb-10">
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No products yet</h3>
            <p className="text-gray-400 mt-1 text-sm">No vendors have listed products at your institution yet.</p>
          </div>
        )}

        {/* Explore by Category */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Explore by Category</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Find exactly what you need on campus</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/student/browse?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1.5 hover:border-sky-200 dark:hover:border-sky-800/50 transition-all duration-300 text-center"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {cat.emoji}
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
