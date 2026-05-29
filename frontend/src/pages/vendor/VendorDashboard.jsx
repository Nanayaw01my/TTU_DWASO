import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  ShoppingBagIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatRelativeTime, getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

const StatCard = ({ value, label, icon: Icon, color, highlight }) => (
  <div className={`dashboard-card flex items-center gap-4 ${highlight ? 'ring-2 ring-amber-400/50' : ''}`}>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{value ?? 0}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const TIPS = [
  'Add clear, well-lit photos to increase views by up to 3x',
  'Write a detailed description with condition and usage history',
  'Price competitively — check similar listings in your institution',
  'Respond to messages quickly to build trust with buyers',
];

export default function VendorDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalViews: 0, available: 0, pending: 0 });

  useEffect(() => {
    api.get('/products/my-products?limit=6')
      .then(({ data }) => {
        setProducts(data.products);
        const total = data.pagination?.total || data.products.length;
        const totalViews = data.products.reduce((sum, p) => sum + (p.views || 0), 0);
        const available = data.products.filter((p) => p.isAvailable).length;
        const pending = data.products.filter((p) => !p.isAvailable).length;
        setStats({ total, totalViews, available, pending });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleAvailability = async (productId, current) => {
    try {
      await api.put(`/products/${productId}`, { isAvailable: String(!current) });
      setProducts((prev) => prev.map((p) => p._id === productId ? { ...p, isAvailable: !current } : p));
      toast.success(`Product marked as ${!current ? 'available' : 'unavailable'}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!user?.isApproved) {
    return (
      <DashboardLayout>
        <div className="page-container py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="card p-10">
              <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-4xl mx-auto mb-6">
                ⏳
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-3">Pending Approval</h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                Your vendor account is under review. Our admin team will verify your documents and approve your account shortly.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 text-left">
                <p className="text-amber-800 dark:text-amber-300 text-sm font-semibold mb-2">What happens next?</p>
                <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-400">
                  <li>• Admin team reviews your Ghana Card and documents</li>
                  <li>• You'll be notified when approved</li>
                  <li>• Then you can start listing products</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">{user?.businessName || 'Vendor Dashboard'}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={getInstitutionBadgeClass(user?.institutionType)}>{getInstitutionLabel(user?.institutionType)}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{user?.institution}</span>
            </div>
          </div>
          <Link to="/vendor/products/add" className="btn-primary flex items-center gap-2 w-fit">
            <PlusIcon className="h-5 w-5" /> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard value={stats.total} label="Total Products" icon={ShoppingBagIcon} color="bg-violet-500" />
          <StatCard value={stats.available} label="Available" icon={CheckCircleIcon} color="bg-indigo-500" />
          <StatCard value={stats.totalViews} label="Total Views" icon={EyeIcon} color="bg-blue-500" />
          <StatCard value={stats.pending} label="Unavailable" icon={PlusIcon} color="bg-gray-400" />
        </div>

        {/* Business profile card */}
        <div className="card p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Business Profile</h3>
          <div className="flex items-center gap-4">
            {user?.passportPhoto ? (
              <img src={user.passportPhoto} alt={user.fullName} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                {user?.fullName?.[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">{user?.businessName}</h2>
              {user?.businessDescription && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 line-clamp-2">{user?.businessDescription}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-2">
                {user?.phone && <span className="text-xs text-gray-400">{user.phone}</span>}
                {user?.email && <span className="text-xs text-gray-400">{user.email}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Products list */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Products</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your latest listings</p>
          </div>
          <Link to="/vendor/products" className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
            Manage All
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 mb-8">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 card mb-8">
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No products yet</h3>
            <p className="text-gray-400 mt-1 text-sm mb-5">Start listing items to reach students at {user?.institution}</p>
            <Link to="/vendor/products/add" className="btn-primary inline-flex items-center gap-2">
              <PlusIcon className="h-5 w-5" /> Add First Product
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {products.map((p) => (
              <div key={p._id} className="card p-4 flex items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={p.images?.[0] || '/placeholder.svg'}
                    alt={p.title}
                    className="w-20 h-20 object-cover rounded-xl"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.svg'; }}
                  />
                  <p className="text-[9px] text-gray-400 break-all w-20 mt-1">{p.images?.[0] || 'NO IMAGE'}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{formatPrice(p.price)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><EyeIcon className="h-3.5 w-3.5" />{p.views || 0} views</span>
                    <span>·</span>
                    <span>{formatRelativeTime(p.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleAvailability(p._id, p.isAvailable)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      p.isAvailable
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {p.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                  <Link to={`/vendor/products/edit/${p._id}`} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <PencilSquareIcon className="h-4 w-4 text-gray-500" />
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <span className="text-red-500 text-lg leading-none">×</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick tips */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Tips for selling more</h3>
          </div>
          <ul className="space-y-2">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
