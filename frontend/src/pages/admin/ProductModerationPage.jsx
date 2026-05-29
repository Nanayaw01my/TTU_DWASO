import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, CheckIcon, EyeIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../utils/api';
import { formatPrice, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductModerationPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('flagged');

  const fetch = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'flagged' ? '/admin/products/flagged' : '/products?limit=20';
      const { data } = await api.get(endpoint);
      setProducts(tab === 'flagged' ? data.products : data.products);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [tab]);

  const handleUnflag = async (id) => {
    try {
      await api.put(`/admin/products/unflag/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product unflagged');
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <DashboardLayout>
      <div className="page-container py-8">
        <h1 className="section-title mb-6">Product Moderation</h1>

        <div className="flex gap-2 mb-6">
          {['flagged', 'all'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === t ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t === 'flagged' ? '🚩 Flagged Products' : '📦 All Products'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-5xl mb-4">{tab === 'flagged' ? '✅' : '📦'}</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
              {tab === 'flagged' ? 'No flagged products' : 'No products found'}
            </h3>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="card p-4 flex gap-4 items-center">
                <img src={p.images?.[0] || '/placeholder.jpg'} alt={p.title} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    By {p.vendorId?.businessName || p.vendorId?.fullName} · {p.institution} · {formatRelativeTime(p.createdAt)}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-sm font-bold text-primary-600">{formatPrice(p.price)}</span>
                    <span className="text-xs text-gray-400">· {p.category}</span>
                  </div>
                  {p.flagReason && (
                    <p className="text-xs text-red-500 mt-1 bg-red-50 dark:bg-red-900/20 rounded-lg px-2 py-1">
                      🚩 Flag reason: {p.flagReason}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Link to={`/products/${p._id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="View">
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  </Link>
                  {p.isFlagged && (
                    <button onClick={() => handleUnflag(p._id)} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Unflag">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
