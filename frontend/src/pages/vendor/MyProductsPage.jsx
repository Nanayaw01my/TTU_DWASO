import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';
import { formatPrice, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetch = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/my-products?page=${p}&limit=12`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(page); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="page-container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="section-title">My Products</h1>
          <Link to="/vendor/products/add" className="btn-primary flex items-center gap-2">
            <PlusIcon className="h-5 w-5" /> Add Product
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No products yet</h3>
            <p className="text-gray-400 mt-1 mb-5">Start listing items for your institution</p>
            <Link to="/vendor/products/add" className="btn-primary inline-block">Add First Product</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="card p-4 flex gap-4 items-center">
                <img src={p.images?.[0] || '/placeholder.jpg'} alt={p.title} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-sm font-bold text-primary-600">{formatPrice(p.price)}</span>
                    <span className="text-xs text-gray-400">· {p.category}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><EyeIcon className="h-3.5 w-3.5" />{p.views || 0} views</span>
                    <span className="text-xs text-gray-400">· {formatRelativeTime(p.createdAt)}</span>
                  </div>
                  <div className="mt-1.5">
                    <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    {p.isFlagged && <span className="ml-1.5 inline-flex text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">Flagged</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={`/products/${p._id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="View">
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  </Link>
                  <Link to={`/vendor/products/edit/${p._id}`} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit">
                    <PencilSquareIcon className="h-4 w-4 text-blue-500" />
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary py-2 px-4 disabled:opacity-40">Previous</button>
            <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {pagination.pages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages} className="btn-secondary py-2 px-4 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
