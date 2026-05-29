import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  PlusCircleIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import ProductCard, { ProductCardSkeleton } from '../../components/common/ProductCard';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { name: 'Books', emoji: '📚', shortName: 'Books' },
  { name: 'Electronics', emoji: '💻', shortName: 'Electronics' },
  { name: 'Furniture', emoji: '🪑', shortName: 'Furniture' },
  { name: 'Clothes', emoji: '👗', shortName: 'Clothes' },
  { name: 'Food', emoji: '🍱', shortName: 'Food' },
  { name: 'Nursing/Medical Supplies', emoji: '🩺', shortName: 'Medical' },
  { name: 'Teaching Materials', emoji: '✏️', shortName: 'Teaching' },
  { name: 'Others', emoji: '🛍️', shortName: 'Others' },
];

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const getDashboardPath = () => {
    if (!user) return '/register';
    return (
      { admin: '/admin/dashboard', vendor: '/vendor/dashboard', student: '/student/dashboard' }[
        user.role
      ] || '/'
    );
  };

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=8&sortBy=createdAt&order=desc'),
      api.get('/products?limit=8&sortBy=views&order=desc'),
      api.get('/regions'),
    ])
      .then(([rec, trend, reg]) => {
        setFeaturedProducts(rec.data.products || []);
        setTrendingProducts(trend.data.products || []);
        setRegions(reg.data.regions || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 pb-16 sm:pb-0">
      {/* ── Sticky Navbar ── */}
      <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <span className="text-black font-black text-sm">CD</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              Campus<span className="text-yellow-400">Dwaso</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl text-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-zinc-300 font-medium text-sm px-3 py-2">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl text-sm"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Search ── */}
      <section className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-8 pb-10 px-4">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1 text-yellow-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
            Ghana's Campus Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2">
            Find anything on
            <br />
            <span className="text-yellow-400">your campus</span>
          </h1>
          <p className="text-zinc-400 text-sm">
            80+ institutions · 16 regions · thousands of listings
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-1.5 pl-2 border-r border-zinc-200 pr-3 min-w-0 shrink-0">
              <MapPinIcon className="h-4 w-4 text-yellow-500 shrink-0" />
              <select
                className="text-sm font-medium text-zinc-700 bg-transparent focus:outline-none max-w-[90px] cursor-pointer"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">All Ghana</option>
                {regions.map((r) => (
                  <option key={r._id || r} value={r.name || r}>
                    {r.name || r}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Search for products, books, electronics..."
              className="flex-1 text-sm text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none px-2 min-w-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = isAuthenticated
                    ? `/student/browse?search=${encodeURIComponent(search)}`
                    : '/login';
                }
              }}
            />
            <Link
              to={
                isAuthenticated
                  ? `/student/browse?search=${encodeURIComponent(search)}`
                  : '/login'
              }
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all shrink-0 flex items-center gap-1"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide">
            <span className="text-zinc-500 text-xs shrink-0">Popular:</span>
            {['Textbooks', 'Laptops', 'Uniforms', 'Food', 'Notes'].map((term) => (
              <Link
                key={term}
                to={isAuthenticated ? `/student/browse?search=${term}` : '/login'}
                className="shrink-0 text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full hover:bg-yellow-400/10 hover:text-yellow-400 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Pills ── */}
      <section className="bg-zinc-950 py-4 border-b border-zinc-800">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 max-w-7xl mx-auto">
          {['All', 'Books', 'Electronics', 'Furniture', 'Clothes', 'Food', 'Medical', 'Teaching', 'Others'].map(
            (cat, i) => (
              <Link
                key={cat}
                to={
                  cat === 'All'
                    ? isAuthenticated
                      ? '/student/browse'
                      : '/login'
                    : isAuthenticated
                    ? `/student/browse?category=${encodeURIComponent(cat)}`
                    : '/login'
                }
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  i === 0
                    ? 'bg-yellow-400 text-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </Link>
            )
          )}
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-zinc-900">Browse Categories</h2>
            <Link
              to={isAuthenticated ? '/student/browse' : '/login'}
              className="text-yellow-500 text-sm font-semibold"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={
                  isAuthenticated
                    ? `/student/browse?category=${encodeURIComponent(cat.name)}`
                    : '/login'
                }
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-2xl group-hover:bg-yellow-400/10 group-hover:scale-105 transition-all duration-200 border border-zinc-200 group-hover:border-yellow-400/50">
                  {cat.emoji}
                </div>
                <span className="text-xs font-medium text-zinc-600 text-center leading-tight group-hover:text-yellow-500 transition-colors">
                  {cat.shortName || cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Now ── */}
      <section className="bg-zinc-950 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white">Trending Now</span>
              <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                Hot
              </span>
            </div>
            <Link
              to={isAuthenticated ? '/student/browse?sortBy=views&order=desc' : '/login'}
              className="text-yellow-500 text-sm font-semibold"
            >
              See all →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {trendingProducts.map((p) => (
              <Link key={p._id} to={`/products/${p._id}`} className="shrink-0 w-44 sm:w-52">
                <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-yellow-400/50 transition-all hover:-translate-y-1 duration-200">
                  <div className="relative h-36 bg-zinc-800">
                    <img
                      src={p.images?.[0] || '/placeholder.svg'}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                      Trending
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-semibold truncate">{p.title}</p>
                    <p className="text-yellow-400 font-black text-base mt-0.5">
                      GHS {p.price?.toFixed(2)}
                    </p>
                    <p className="text-zinc-500 text-[11px] mt-1 truncate">{p.institution}</p>
                  </div>
                </div>
              </Link>
            ))}
            {trendingProducts.length === 0 && !loading && (
              <p className="text-zinc-500 text-sm">No trending products yet</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Recommended For You ── */}
      <section className="bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-zinc-900">Recommended</h2>
            <Link
              to={isAuthenticated ? '/student/browse' : '/login'}
              className="text-yellow-500 text-sm font-semibold"
            >
              See all →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
              {featuredProducts.length === 0 && (
                <p className="col-span-full text-zinc-500 text-sm text-center py-8">
                  No products listed yet. Be the first to sell!
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-zinc-950 py-10 px-4 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-black text-white mb-6 text-center">
            How Campus Dwaso Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Create Account',
                desc: 'Register as a student or vendor with your institution details',
                icon: '🎓',
              },
              {
                step: '02',
                title: 'Browse & Buy',
                desc: 'Search products from any campus across Ghana',
                icon: '🛍️',
              },
              {
                step: '03',
                title: 'List & Sell',
                desc: 'Vendors list items and connect with buyers directly',
                icon: '💰',
              },
            ].map((item) => (
              <div key={item.step} className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-yellow-400 font-black text-xs">STEP {item.step}</span>
                </div>
                <h3 className="text-white font-bold mb-1">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-yellow-400 py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-black mb-2">Ready to start selling?</h2>
          <p className="text-black/70 text-sm mb-5">
            Join thousands of campus vendors already on Campus Dwaso
          </p>
          <Link
            to="/register"
            className="inline-block bg-black text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-zinc-900 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black border-t border-zinc-800 px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center">
              <span className="text-black font-black text-xs">CD</span>
            </div>
            <span className="text-white font-black text-base tracking-tight">
              Campus<span className="text-yellow-400">Dwaso</span>
            </span>
          </div>
          <p className="text-zinc-500 text-xs text-center">
            © {new Date().getFullYear()} Campus Dwaso · Ghana's Campus Marketplace
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>

      {/* ── Fixed Bottom Navigation (mobile only) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-black border-t border-zinc-800">
        <div className="flex items-center justify-around px-2 py-2">
          <Link to="/" className="flex flex-col items-center gap-0.5 px-3 py-1 group">
            <HomeIcon className="h-5 w-5 text-yellow-400" />
            <span className="text-[10px] text-yellow-400 font-semibold">Home</span>
          </Link>
          <Link
            to={isAuthenticated ? '/student/browse' : '/login'}
            className="flex flex-col items-center gap-0.5 px-3 py-1 group"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400 group-hover:text-yellow-400" />
            <span className="text-[10px] text-zinc-400 group-hover:text-yellow-400 font-medium">
              Browse
            </span>
          </Link>
          <Link
            to={isAuthenticated ? '/vendor/products/add' : '/login'}
            className="flex flex-col items-center gap-0.5 -mt-4"
          >
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/30">
              <PlusCircleIcon className="h-6 w-6 text-black" />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 font-medium">Sell</span>
          </Link>
          <Link
            to={isAuthenticated ? '/student/messages' : '/login'}
            className="flex flex-col items-center gap-0.5 px-3 py-1 group"
          >
            <ChatBubbleLeftIcon className="h-5 w-5 text-zinc-400 group-hover:text-yellow-400" />
            <span className="text-[10px] text-zinc-400 group-hover:text-yellow-400 font-medium">
              Messages
            </span>
          </Link>
          <Link
            to={isAuthenticated ? getDashboardPath() : '/login'}
            className="flex flex-col items-center gap-0.5 px-3 py-1 group"
          >
            <UserCircleIcon className="h-5 w-5 text-zinc-400 group-hover:text-yellow-400" />
            <span className="text-[10px] text-zinc-400 group-hover:text-yellow-400 font-medium">
              Profile
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default HomePage;
