import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../../components/common/Navbar';
import ProductCard, { ProductCardSkeleton } from '../../components/common/ProductCard';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

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

const FEATURES = [
  {
    icon: BuildingLibraryIcon,
    title: 'Institution-Locked',
    desc: 'Buy and sell only within your own institution. Safe, relevant, and community-focused.',
    gradient: 'from-violet-500 to-indigo-600',
    glow: 'shadow-violet-500/20',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Verified Vendors',
    desc: 'All vendors undergo Ghana Card verification and admin approval before selling.',
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'shadow-indigo-500/20',
  },
  {
    icon: ShoppingBagIcon,
    title: 'All Student Needs',
    desc: 'Books, electronics, furniture, food, nursing supplies, and teaching materials.',
    gradient: 'from-violet-500 to-blue-500',
    glow: 'shadow-violet-500/20',
  },
];

const STATS = [
  { value: '16', label: 'Ghana Regions' },
  { value: '80+', label: 'Institutions' },
  { value: '3', label: 'User Roles' },
  { value: '8', label: 'Categories' },
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/20 rounded-full filter blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-indigo-500/15 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="page-container py-24 relative">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-8 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                Campus Marketplace Platform
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
                Buy & Sell Within{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300">
                  Your Campus
                </span>
              </h1>

              <p className="text-lg text-slate-300/70 mb-10 max-w-2xl leading-relaxed">
                CAMPUS DWASO connects students, vendors, and institutions across all 16 regions of Ghana.
                Shop safely within your university, nursing college, or teacher training college.
              </p>

              {/* Search bar */}
              <div className="flex gap-3 max-w-xl mb-10">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-violet-400/60 focus:bg-white/15 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && search.trim()) {
                        window.location.href = `/student/browse?search=${encodeURIComponent(search)}`;
                      }
                    }}
                  />
                </div>
                <Link
                  to={isAuthenticated ? `/student/browse?search=${encodeURIComponent(search)}` : '/login'}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 whitespace-nowrap shadow-lg shadow-violet-500/30 hover:shadow-violet-400/40 hover:-translate-y-0.5"
                >
                  Search
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 bg-white text-violet-700 font-bold px-7 py-3.5 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  {isAuthenticated ? 'My Dashboard' : 'Get Started'}
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-violet-900 to-indigo-900 text-white py-10">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-br from-white to-violet-200">
                  {stat.value}
                </div>
                <div className="text-violet-200 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-3">Why CAMPUS DWASO?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Built specifically for Ghanaian campus communities — secure, verified, and community-focused.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group relative p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800/50"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 shadow-lg ${feat.glow}`}>
                  <feat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{feat.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50 dark:bg-slate-950">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
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
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1.5 hover:border-violet-200 dark:hover:border-violet-800/50 transition-all duration-300 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {cat.emoji}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="page-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Most viewed items across all institutions</p>
            </div>
            <Link
              to={isAuthenticated ? '/student/browse' : '/login'}
              className="flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
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
            <div className="text-center py-20 text-gray-400">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <ShoppingBagIcon className="h-10 w-10 opacity-40" />
              </div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No products yet</p>
              <p className="text-sm mt-1">Be the first to list something on CAMPUS DWASO!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>
          <div className="page-container text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                Ready to Start Trading{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-blue-300">
                  on Campus?
                </span>
              </h2>
              <p className="text-slate-300/70 mb-10 text-lg">
                Join thousands of students buying and selling within their institutions safely.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register?role=student"
                  className="btn-primary text-base px-8 py-3.5"
                >
                  Join as Student
                </Link>
                <Link
                  to="/register?role=vendor"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200 text-base"
                >
                  Become a Vendor
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 pt-12 pb-6">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-white font-black text-sm">CD</span>
              </div>
              <div>
                <span className="text-white font-black text-lg tracking-tight">
                  CAMPUS <span className="text-violet-400">DWASO</span>
                </span>
                <p className="text-gray-500 text-xs">Campus Marketplace Ghana</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} CAMPUS DWASO. The Campus Marketplace for Ghana.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" />
        </div>
      </footer>
    </div>
  );
}
