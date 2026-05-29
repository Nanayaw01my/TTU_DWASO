import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/common/DashboardLayout';
import ProductCard, { ProductCardSkeleton } from '../../components/common/ProductCard';
import api from '../../utils/api';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function BrowseProducts() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [regions, setRegions] = useState([]);
  const [selectedRegionInstitutions, setSelectedRegionInstitutions] = useState([]);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    region: '',
    institution: '',
  });

  useEffect(() => {
    api.get('/regions').then(({ data }) => setRegions(data.regions || []));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      params.set('limit', '12');

      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', condition: '', minPrice: '', maxPrice: '', sortBy: 'createdAt', order: 'desc', page: 1, region: '', institution: '' });
    setSelectedRegionInstitutions([]);
  };

  const hasActiveFilters = filters.search || filters.category || filters.condition || filters.minPrice || filters.maxPrice || filters.region || filters.institution;

  return (
    <DashboardLayout>
      <div className="page-container py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="section-title">Browse all campus products</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Products from all institutions across Ghana
          </p>
        </div>

        {/* Search bar + filter toggle */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-yellow-50 border-yellow-400 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300'
                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-yellow-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="card p-5 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Region</label>
                <select value={filters.region} onChange={(e) => {
                  const r = regions.find(r => r._id === e.target.value);
                  setSelectedRegionInstitutions(r?.institutions || []);
                  setFilters(prev => ({ ...prev, region: e.target.value, institution: '', page: 1 }));
                }} className="input-field">
                  <option value="">All Regions</option>
                  {regions.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Institution</label>
                <select value={filters.institution} onChange={(e) => updateFilter('institution', e.target.value)} className="input-field" disabled={!filters.region}>
                  <option value="">All Institutions</option>
                  {selectedRegionInstitutions.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Category</label>
                <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className="input-field">
                  <option value="">All Categories</option>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Condition</label>
                <select value={filters.condition} onChange={(e) => updateFilter('condition', e.target.value)} className="input-field">
                  <option value="">Any Condition</option>
                  {PRODUCT_CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Min Price (GHS)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Max Price (GHS)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="No limit"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Sort by</label>
                <select value={`${filters.sortBy}-${filters.order}`} onChange={(e) => {
                  const [sortBy, order] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sortBy, order, page: 1 }));
                }} className="input-field py-1.5 text-sm w-auto">
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="views-desc">Most Viewed</option>
                </select>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium">
                  <XMarkIcon className="h-4 w-4" /> Clear All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-zinc-500 mb-4">
            {pagination.total || 0} product{pagination.total !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No products found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              {hasActiveFilters ? 'Try adjusting your filters' : 'No products available yet'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => updateFilter('page', filters.page - 1)}
              disabled={filters.page === 1}
              className="btn-secondary py-2 px-4 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-500 px-4">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => updateFilter('page', filters.page + 1)}
              disabled={filters.page === pagination.pages}
              className="btn-secondary py-2 px-4 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
