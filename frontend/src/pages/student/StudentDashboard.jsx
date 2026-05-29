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
import toast from 'react-hot-toast';

const CATEGORIES = [
  { name: 'Books', emoji: '📚' },
  { name: 'Electronics', emoji: '💻' },
  { name: 'Furniture', emoji: '🪑' },
  { name: 'Clothes', emoji: '👕' },
  { name: 'Food', emoji: '🍱' },
  { name: 'Nursing/Medical Supplies', emoji: '🩺' },
  { name: 'Teaching Materials', emoji: '✏️' },
  { name: 'Others', emoji: '🛍️' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Location switcher state
  const [regions, setRegions] = useState([]);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [switchRegion, setSwitchRegion] = useState('');
  const [switchInstitution, setSwitchInstitution] = useState('');
  const [switchInstitutions, setSwitchInstitutions] = useState([]);
  const [switchLoading, setSwitchLoading] = useState(false);

  useEffect(() => {
    api.get('/products?limit=8&sortBy=createdAt&order=desc')
      .then(({ data }) => setProducts(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get('/regions').then(({ data }) => setRegions(data.regions || []));
  }, []);

  const totalCategories = CATEGORIES.length;

  return (
    <DashboardLayout>
      <div className="page-container py-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-6 text-black mb-8 shadow-lg shadow-yellow-400/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-black/60 text-sm font-medium mb-1">Welcome back,</p>
              <h1 className="text-2xl font-black mb-3">{user?.fullName}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/10 text-black border border-black/20">
                  {getInstitutionLabel(user?.institutionType)}
                </span>
                <span className="text-black/70 text-sm">{user?.institution}</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-black/10 flex items-center justify-center text-3xl flex-shrink-0">
              🎓
            </div>
          </div>
        </div>

        {/* Location switcher card */}
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-0.5">Your Location</p>
              <p className="font-bold text-zinc-900 dark:text-white">{user?.institution}</p>
              <p className="text-sm text-zinc-500">{user?.region?.name}</p>
            </div>
            <button onClick={() => setSwitcherOpen(!switcherOpen)} className="text-sm font-semibold text-yellow-500 hover:text-yellow-400">
              Switch
            </button>
          </div>
          {switcherOpen && (
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
              <select className="input-field" value={switchRegion} onChange={(e) => {
                setSwitchRegion(e.target.value);
                setSwitchInstitution('');
                const r = regions.find(r => r._id === e.target.value);
                setSwitchInstitutions(r?.institutions || []);
              }}>
                <option value="">Select Region</option>
                {regions.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
              <select className="input-field" value={switchInstitution} onChange={(e) => setSwitchInstitution(e.target.value)} disabled={!switchRegion}>
                <option value="">Select Institution</option>
                {switchInstitutions.map(i => <option key={i.name} value={i.name}>{i.name} ({i.type})</option>)}
              </select>
              <button
                disabled={!switchRegion || !switchInstitution || switchLoading}
                onClick={async () => {
                  setSwitchLoading(true);
                  try {
                    const inst = switchInstitutions.find(i => i.name === switchInstitution);
                    await api.put('/auth/update-location', {
                      region: switchRegion,
                      institution: switchInstitution,
                      institutionType: inst?.type,
                    });
                    toast.success('Location updated!');
                    setSwitcherOpen(false);
                    window.location.reload();
                  } catch {
                    toast.error('Failed to update location');
                  } finally {
                    setSwitchLoading(false);
                  }
                }}
                className="btn-primary w-full"
              >
                {switchLoading ? 'Updating...' : 'Save Location'}
              </button>
            </div>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="dashboard-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-400">
              <ShoppingBagIcon className="h-6 w-6 text-black" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{products.length}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Products Available</p>
            </div>
          </div>
          <div className="dashboard-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-400">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-black" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">—</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Unread Messages</p>
            </div>
          </div>
          <div className="dashboard-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-zinc-800">
              <TagIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{totalCategories}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Categories</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <Link
            to="/student/browse"
            className="flex items-center gap-3 p-4 card hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2.5 rounded-xl bg-yellow-400 group-hover:bg-yellow-300 transition-colors">
              <ShoppingBagIcon className="h-5 w-5 text-black" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Browse Products</p>
              <p className="text-xs text-zinc-400">Find items across all campuses</p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-zinc-400 ml-auto" />
          </Link>
          <Link
            to="/messages"
            className="flex items-center gap-3 p-4 card hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2.5 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Messages</p>
              <p className="text-xs text-zinc-400">Chat with vendors</p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-zinc-400 ml-auto" />
          </Link>
        </div>

        {/* Recent Products */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Recent Products</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Latest listings from vendors</p>
          </div>
          <Link to="/student/browse" className="flex items-center gap-1 text-sm font-semibold text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors">
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
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-zinc-300 mb-4" />
            <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">No products yet</h3>
            <p className="text-zinc-400 mt-1 text-sm">No vendors have listed products yet.</p>
          </div>
        )}

        {/* Explore by Category */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Explore by Category</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Find exactly what you need on campus</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/student/browse?category=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden flex flex-col justify-between p-5 rounded-2xl bg-zinc-900 border-2 border-zinc-800 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/10 hover:-translate-y-1.5 transition-all duration-300 min-h-[110px]"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">{cat.emoji}</span>
                <div className="flex items-end justify-between mt-3">
                  <span className="text-xs font-bold text-white leading-tight">{cat.name}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400 text-lg">→</span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-yellow-400/5 blur-xl group-hover:scale-150 transition-transform duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
