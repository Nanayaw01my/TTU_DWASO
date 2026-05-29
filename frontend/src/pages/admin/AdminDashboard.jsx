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
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../utils/api';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const StatCard = ({ label, value, icon: Icon, color, to }) => {
  const content = (
    <div className={`dashboard-card flex items-center gap-4 transition-all ${to ? 'hover:shadow-md cursor-pointer' : ''}`}>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{value ?? '—'}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
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

  return (
    <DashboardLayout>
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Platform overview and management</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/vendors" className="btn-primary text-sm py-2 px-4">Review Vendors</Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Students" value={stats.totalStudents} icon={UsersIcon} color="bg-blue-500" to="/admin/users?role=student" />
          <StatCard label="Total Vendors" value={stats.totalVendors} icon={BuildingLibraryIcon} color="bg-purple-500" to="/admin/users?role=vendor" />
          <StatCard label="Pending Approvals" value={stats.pendingVendors} icon={ClockIcon} color="bg-amber-500" to="/admin/vendors" />
          <StatCard label="Total Products" value={stats.totalProducts} icon={ShoppingBagIcon} color="bg-green-500" to="/admin/products" />
          <StatCard label="Approved Vendors" value={stats.approvedVendors} icon={CheckCircleIcon} color="bg-teal-500" />
          <StatCard label="Flagged Products" value={stats.flaggedProducts} icon={ExclamationTriangleIcon} color="bg-red-500" to="/admin/products" />
          <StatCard label="Suspended Users" value={stats.suspendedUsers} icon={UserMinusIcon} color="bg-gray-500" />
          <StatCard label="Regions" value={16} icon={ChartBarIcon} color="bg-indigo-500" to="/admin/regions" />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { to: '/admin/vendors', label: '⏳ Pending Vendors', desc: `${stats.pendingVendors || 0} awaiting` },
            { to: '/admin/users', label: '👥 User Management', desc: `${(stats.totalStudents || 0) + (stats.totalVendors || 0)} total users` },
            { to: '/admin/products', label: '🚩 Product Review', desc: `${stats.flaggedProducts || 0} flagged` },
            { to: '/admin/regions', label: '🗺️ Regions & Institutions', desc: '16 regions' },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="card p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
              <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent vendors */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">Recent Vendors</h2>
              <Link to="/admin/vendors" className="text-xs text-primary-600 hover:underline font-semibold">View All</Link>
            </div>
            <div className="space-y-3">
              {data?.recentVendors?.length > 0 ? data.recentVendors.map((v) => (
                <div key={v._id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                    {v.fullName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{v.businessName || v.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{v.institution}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${v.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {v.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-gray-400 py-4 text-center">No vendors yet</p>
              )}
            </div>
          </div>

          {/* Recent products */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-gray-100">Recent Products</h2>
              <Link to="/admin/products" className="text-xs text-primary-600 hover:underline font-semibold">View All</Link>
            </div>
            <div className="space-y-3">
              {data?.recentProducts?.length > 0 ? data.recentProducts.map((p) => (
                <div key={p._id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <img src={p.images?.[0] || '/placeholder.jpg'} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.vendorId?.businessName || p.vendorId?.fullName} · {formatRelativeTime(p.createdAt)}</p>
                  </div>
                  {p.isFlagged && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 flex-shrink-0">Flagged</span>
                  )}
                </div>
              )) : (
                <p className="text-sm text-gray-400 py-4 text-center">No products yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
