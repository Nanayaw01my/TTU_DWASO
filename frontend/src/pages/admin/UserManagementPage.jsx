import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, NoSymbolIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';
import api from '../../utils/api';
import { formatDate, getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function UserManagementPage() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [suspendModal, setSuspendModal] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (role) params.set('role', role);
      if (search) params.set('search', search);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, role]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetch();
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) { toast.error('Reason required'); return; }
    try {
      await api.put(`/admin/users/suspend/${suspendModal._id}`, { reason: suspendReason });
      setUsers((prev) => prev.map((u) => u._id === suspendModal._id ? { ...u, isSuspended: true, suspendedReason: suspendReason } : u));
      setSuspendModal(null);
      setSuspendReason('');
      toast.success('User suspended');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUnsuspend = async (userId) => {
    try {
      await api.put(`/admin/users/unsuspend/${userId}`);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isSuspended: false } : u));
      toast.success('User unsuspended');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Delete ${userName}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const roleColors = { student: 'bg-blue-100 text-blue-700', vendor: 'bg-purple-100 text-purple-700', admin: 'bg-gray-100 text-gray-700' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="page-container py-8">
        <div className="mb-6">
          <h1 className="section-title">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.total || 0} total users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="input-field pl-11"
            />
          </form>
          <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="input-field w-auto">
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="vendor">Vendors</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  {['User', 'Role', 'Institution', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">No users found</td>
                  </tr>
                ) : users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                          {user.fullName?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-36">{user.fullName}</p>
                          <p className="text-xs text-gray-400 truncate max-w-36">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-40 truncate">{user.institution}</td>
                    <td className="px-4 py-3">
                      {user.isSuspended ? (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">Suspended</span>
                      ) : user.isApproved ? (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {user.role !== 'admin' && (
                          <>
                            {user.isSuspended ? (
                              <button onClick={() => handleUnsuspend(user._id)} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Unsuspend">
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                              </button>
                            ) : (
                              <button onClick={() => setSuspendModal(user)} className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors" title="Suspend">
                                <NoSymbolIcon className="h-4 w-4 text-amber-500" />
                              </button>
                            )}
                            <button onClick={() => handleDelete(user._id, user.fullName)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary py-2 px-4 disabled:opacity-40">Previous</button>
            <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {pagination.pages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages} className="btn-secondary py-2 px-4 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>

      <Modal isOpen={!!suspendModal} onClose={() => { setSuspendModal(null); setSuspendReason(''); }} title="Suspend User">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Suspend <strong>{suspendModal?.fullName}</strong>? They will be unable to access the platform.
          </p>
          <textarea
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            rows={3}
            placeholder="Reason for suspension..."
            className="input-field resize-none"
          />
          <div className="flex gap-3">
            <button onClick={() => { setSuspendModal(null); setSuspendReason(''); }} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleSuspend} className="btn-danger flex-1">Suspend User</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
