import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  ShoppingBagIcon,
  BuildingLibraryIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  UserMinusIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../utils/api';
import { formatRelativeTime } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const StatCard = ({ label, value, icon: Icon, color, to, highlight }) => {
  const content = (
    <div className={`dashboard-card flex items-center gap-4 transition-all ${to ? 'hover:shadow-md cursor-pointer hover:-translate-y-0.5' : ''} ${highlight ? 'ring-2 ring-amber-400/50 dark:ring-amber-500/30' : ''}`}>
      <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{value ?? '—'}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data: d }) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="min-h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>
    </DashboardLayout>
  );

  const stats = data?.stats || {};
  const hasPendingVendors = (stats.pendingVendors || 0) > 0;
  const hasFlaggedProducts = (stats.flaggedProducts || 0) > 0;
  const needsAttention = hasPendingVendors || hasFlaggedProducts;

  return (
    <DashboardLayout>
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {new Date().toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/admin/vendors" className="btn-primary text-sm py-2 px-4 w-fit">Review Vendors</Link>
        </div>

        {/* Stats grid — row 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard label="Total Students" value={stats.totalStudents} icon={UsersIcon} color="bg-yellow-400" to="/admin/users?role=student" />
          <StatCard label="Total Vendors" value={stats.totalVendors} icon={BuildingLibraryIcon} color="bg-amber-500" to="/admin/users?role=vendor" />
          <StatCard
            label="Pending Approvals"
            value={stats.pendingVendors}
            icon={ClockIcon}
            color={hasPendingVendors ? 'bg-amber-500' : 'bg-amber-400'}
            to="/admin/vendors"
            highlight={hasPendingVendors}
          />
          <StatCard label="Total Products" value={stats.totalProducts} icon={ShoppingBagIcon} color="bg-zinc-700" to="/admin/products" />
        </div>
        {/* Stats grid — row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Approved Vendors" value={stats.approvedVendors} icon={CheckCircleIcon} color="bg-zinc-600" />
          <StatCard
            label="Flagged Products"
            value={stats.flaggedProducts}
            icon={ExclamationTriangleIcon}
            color={hasFlaggedProducts ? 'bg-red-500' : 'bg-red-400'}
            to="/admin/products"
            highlight={hasFlaggedProducts}
          />
          <StatCard label="Suspended Users" value={stats.suspendedUsers} icon={UserMinusIcon} color="bg-zinc-500" />
          <StatCard label="Regions" value={16} icon={ChartBarIcon} color="bg-zinc-700" to="/admin/regions" />
        </div>

        {/* Action Required section */}
        {needsAttention && (
          <div className="card p-6 mb-8 border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              Action Required
            </h2>
            <div className="space-y-3">
              {hasPendingVendors && (
                <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-amber-200 dark:border-amber-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {stats.pendingVendors} vendor{stats.pendingVendors > 1 ? 's' : ''} awaiting approval
                      </p>
                      <p className="text-xs text-zinc-400">Review documents and approve or reject vendor accounts</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/vendors"
                    className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex-shrink-0 ml-4"
                  >
                    Review <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              )}
              {hasFlaggedProducts && (
                <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-red-200 dark:border-red-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {stats.flaggedProducts} flagged product{stats.flaggedProducts > 1 ? 's' : ''} need review
                      </p>
                      <p className="text-xs text-zinc-400">Products reported by users or flagged by the system</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/products"
                    className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex-shrink-0 ml-4"
                  >
                    Review <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent vendors + products tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent vendors */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-zinc-900 dark:text-zinc-100">Recent Vendors</h2>
              <Link to="/admin/vendors" className="text-xs text-yellow-500 dark:text-yellow-400 hover:underline font-semibold">View All</Link>
            </div>
            <div className="space-y-3">
              {data?.recentVendors?.length > 0 ? data.recentVendors.map((v) => (
                <div key={v._id} className="flex items-center gap-3 py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-bold text-sm flex-shrink-0">
                    {v.fullName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{v.businessName || v.fullName}</p>
                    <p className="text-xs text-zinc-400 truncate">{v.institution}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${v.isApproved ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {v.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-zinc-400 py-6 text-center">No vendors yet</p>
              )}
            </div>
          </div>

          {/* Recent products */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-zinc-900 dark:text-zinc-100">Recent Products</h2>
              <Link to="/admin/products" className="text-xs text-yellow-500 dark:text-yellow-400 hover:underline font-semibold">View All</Link>
            </div>
            <div className="space-y-3">
              {data?.recentProducts?.length > 0 ? data.recentProducts.map((p) => (
                <div key={p._id} className="flex items-center gap-3 py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                  <img src={p.images?.[0] || '/placeholder.svg'} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={(e) => { e.target.src = '/placeholder.svg'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{p.title}</p>
                    <p className="text-xs text-zinc-400">{p.vendorId?.businessName || p.vendorId?.fullName} · {formatRelativeTime(p.createdAt)}</p>
                  </div>
                  {p.isFlagged && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex-shrink-0">Flagged</span>
                  )}
                </div>
              )) : (
                <p className="text-sm text-zinc-400 py-6 text-center">No products yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Platform health */}
        <div className="card p-6">
          <h2 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">Platform Health</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: 'Approval Rate',
                value: stats.totalVendors ? `${Math.round(((stats.approvedVendors || 0) / stats.totalVendors) * 100)}%` : '—',
                color: 'text-yellow-600 dark:text-yellow-400',
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
              },
              {
                label: 'Pending Queue',
                value: stats.pendingVendors || 0,
                color: hasPendingVendors ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-600 dark:text-zinc-400',
                bg: hasPendingVendors ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-zinc-50 dark:bg-zinc-800',
              },
              {
                label: 'Flagged Content',
                value: stats.flaggedProducts || 0,
                color: hasFlaggedProducts ? 'text-red-600 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400',
                bg: hasFlaggedProducts ? 'bg-red-50 dark:bg-red-900/20' : 'bg-zinc-50 dark:bg-zinc-800',
              },
              {
                label: 'Suspended Users',
                value: stats.suspendedUsers || 0,
                color: 'text-zinc-600 dark:text-zinc-400',
                bg: 'bg-zinc-50 dark:bg-zinc-800',
              },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} rounded-xl p-4 text-center`}>
                <p className={`text-2xl font-black mb-1 ${item.color}`}>{item.value}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
