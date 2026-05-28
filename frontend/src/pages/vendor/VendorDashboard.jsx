import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ShoppingBagIcon, EyeIcon, ChatBubbleLeftRightIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/common/Navbar';
import { ProductCardSkeleton } from '../../components/common/ProductCard';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatRelativeTime, getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

const StatCard = ({ value, label, icon: Icon, color }) => (
  <div className="dashboard-card flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

export default function VendorDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalViews: 0, available: 0 });

  useEffect(() => {
    api.get('/products/my-products?limit=6')
      .then(({ data }) => {
        setProducts(data.products);
        const total = data.pagination?.total || data.products.length;
        const totalViews = data.products.reduce((sum, p) => sum + (p.views || 0), 0);
        const available = data.products.filter((p) => p.isAvailable).length;
        setStats({ total, totalViews, available });
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="page-container py-20 text-center">
          <div className="max-w-md mx-auto card p-10">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-3">Pending Approval</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Your vendor account is under review. Our admin team will verify your documents and approve your account shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Vendor Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={getInstitutionBadgeClass(user?.institutionType)}>{getInstitutionLabel(user?.institutionType)}</span>
              <span className="text-sm text-gray-500">{user?.institution}</span>
            </div>
          </div>
          <Link to="/vendor/products/add" className="btn-primary flex items-center gap-2 w-fit">
            <PlusIcon className="h-5 w-5" /> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard value={stats.total} label="Total Listings" icon={ShoppingBagIcon} color="bg-primary-500" />
          <StatCard value={stats.available} label="Available Now" icon={PlusIcon} color="bg-green-500" />
          <StatCard value={stats.totalViews} label="Total Views" icon={EyeIcon} color="bg-purple-500" />
        </div>

        {/* Business info */}
        <div className="card p-6 mb-8">
          <div className="flex items-center gap-4">
            {user?.passportPhoto ? (
              <img src={user.passportPhoto} alt={user.fullName} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-black text-2xl">
                {user?.fullName?.[0]}
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">{user?.businessName}</h2>
              <p className="text-gray-500 text-sm">{user?.businessDescription}</p>
              <p className="text-xs text-gray-400 mt-1">{user?.phone} · {user?.email}</p>
            </div>
          </div>
        </div>

        {/* Products list */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Products</h2>
          <Link to="/vendor/products" className="text-sm font-semibold text-primary-600 hover:underline">Manage All</Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 card">
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No products yet</h3>
            <p className="text-gray-400 mt-1 text-sm mb-5">Start listing items to reach students at {user?.institution}</p>
            <Link to="/vendor/products/add" className="btn-primary inline-flex items-center gap-2">
              <PlusIcon className="h-5 w-5" /> Add First Product
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="card p-4 flex items-center gap-4">
                <img
                  src={p.images?.[0] || '/placeholder.jpg'}
                  alt={p.title}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>{formatPrice(p.price)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><EyeIcon className="h-3.5 w-3.5" />{p.views || 0}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(p.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleAvailability(p._id, p.isAvailable)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      p.isAvailable
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
      </div>
    </div>
  );
}
