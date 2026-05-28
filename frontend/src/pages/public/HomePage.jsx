import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../../components/common/Navbar';
import ProductCard, { ProductCardSkeleton } from '../../components/common/ProductCard';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { name: 'Books', emoji: '📚', color: 'from-blue-400 to-blue-600' },
  { name: 'Electronics', emoji: '💻', color: 'from-purple-400 to-purple-600' },
  { name: 'Furniture', emoji: '🪑', color: 'from-amber-400 to-amber-600' },
  { name: 'Clothes', emoji: '👕', color: 'from-pink-400 to-pink-600' },
  { name: 'Food', emoji: '🍱', color: 'from-green-400 to-green-600' },
  { name: 'Nursing/Medical Supplies', emoji: '🩺', color: 'from-red-400 to-red-600' },
  { name: 'Teaching Materials', emoji: '✏️', color: 'from-teal-400 to-teal-600' },
  { name: 'Others', emoji: '🛍️', color: 'from-gray-400 to-gray-600' },
];

const FEATURES = [
  {
    icon: BuildingLibraryIcon,
    title: 'Institution-Locked',
    desc: 'Buy and sell only within your own institution. Safe, relevant, and community-focused.',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Verified Vendors',
    desc: 'All vendors undergo Ghana Card verification and admin approval before selling.',
    color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: ShoppingBagIcon,
    title: 'All Student Needs',
    desc: 'Books, electronics, furniture, food, nursing supplies, and teaching materials.',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get('/products?limit=8&sortBy=views&order=desc')
      .then(({ data }) => setFeaturedProducts(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/register';
    return { admin: '/admin/dashboard', vendor: '/vendor/dashboard', student: '/student/dashboard' }[user.role] || '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        </div>

        {/* Ghana flag accent strip */}
        <div className="h-1.5 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />

        <div className="page-container py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Ghana's Premier Campus Marketplace
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-balance">
              Buy & Sell Within{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-100">
                Your Campus
              </span>
            </h1>

            <p className="text-lg text-primary-100 mb-8 max-w-2xl leading-relaxed">
              TTU DWASO connects students, vendors, and institutions across all 16 regions of Ghana.
              Shop safely within your university, nursing college, or teacher training college.
            </p>

            {/* Search */}
            <div className="flex gap-3 max-w-lg mb-8">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && search.trim()) {
                      window.location.href = `/student/browse?search=${encodeURIComponent(search)}`;
                    }
                  }}
                />
              </div>
              <Link
                to={isAuthenticated ? `/student/browse?search=${encodeURIComponent(search)}` : '/login'}
                className="flex items-center gap-2 bg-white text-primary-700 font-bold px-5 py-3 rounded-xl hover:bg-primary-50 transition-colors whitespace-nowrap shadow-lg"
              >
                Search
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
              >
                {isAuthenticated ? 'My Dashboard' : 'Get Started'}
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
              >
                <div className={`p-3 rounded-xl ${feat.color} flex-shrink-0`}>
                  <feat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{feat.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Browse Categories</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Find exactly what you need on campus</p>
            </div>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.name} variants={itemVariants}>
                <Link
                  to={isAuthenticated ? `/student/browse?category=${encodeURIComponent(cat.name)}` : '/login'}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                    {cat.emoji}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Most viewed items across all institutions</p>
            </div>
            <Link
              to={isAuthenticated ? '/student/browse' : '/login'}
              className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBagIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No products yet</p>
              <p className="text-sm mt-1">Be the first to list something on TTU DWASO!</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats banner */}
      <section className="py-12 bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '16', label: 'Ghana Regions' },
              { value: '80+', label: 'Institutions' },
              { value: '3', label: 'User Roles' },
              { value: '8', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-primary-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-16">
          <div className="page-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-4">
                Ready to Start Trading on Campus?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Join thousands of students buying and selling within their institutions safely.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register?role=student" className="btn-primary text-base px-8 py-3">
                  Join as Student
                </Link>
                <Link to="/register?role=vendor" className="btn-secondary text-base px-8 py-3">
                  Become a Vendor
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">TD</span>
              </div>
              <span className="text-white font-black">TTU DWASO</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} TTU DWASO. The Campus Marketplace for Ghana.
            </p>
            <div className="flex gap-4 text-sm">
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          {/* Ghana flag strip */}
          <div className="mt-6 h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green rounded-full" />
        </div>
      </footer>
    </div>
  );
}
