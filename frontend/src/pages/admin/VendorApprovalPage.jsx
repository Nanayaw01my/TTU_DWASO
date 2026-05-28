import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';
import api from '../../utils/api';
import { formatDate, getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function VendorApprovalPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    api.get('/admin/vendors/pending')
      .then(({ data }) => setVendors(data.vendors))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (vendorId) => {
    setActionLoading(vendorId);
    try {
      await api.put(`/admin/vendors/approve/${vendorId}`);
      setVendors((prev) => prev.filter((v) => v._id !== vendorId));
      setSelectedVendor(null);
      toast.success('Vendor approved successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { toast.error('Please provide a rejection reason'); return; }
    setActionLoading(rejectModal._id);
    try {
      await api.put(`/admin/vendors/reject/${rejectModal._id}`, { reason: rejectReason });
      setVendors((prev) => prev.filter((v) => v._id !== rejectModal._id));
      setRejectModal(null);
      setRejectReason('');
      toast.success('Vendor rejected');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="page-container py-8">
        <div className="mb-6">
          <h1 className="section-title">Vendor Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''} pending review</p>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center"><Loader size="lg" /></div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">All caught up!</h3>
            <p className="text-gray-400 mt-1">No pending vendor applications</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {vendors.map((vendor) => (
              <div key={vendor._id} className="card p-5">
                <div className="flex items-start gap-4">
                  {vendor.passportPhoto ? (
                    <img src={vendor.passportPhoto} alt={vendor.fullName} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-black text-xl flex-shrink-0">
                      {vendor.fullName?.[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{vendor.businessName}</h3>
                    <p className="text-sm text-gray-500 truncate">{vendor.fullName} · {vendor.phone}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{vendor.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={getInstitutionBadgeClass(vendor.institutionType)}>{getInstitutionLabel(vendor.institutionType)}</span>
                      <span className="text-xs text-gray-400 truncate">{vendor.institution}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Applied {formatDate(vendor.createdAt)}</p>
                  </div>
                </div>

                {vendor.businessDescription && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">{vendor.businessDescription}</p>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-1 justify-center"
                  >
                    <EyeIcon className="h-4 w-4" /> Review
                  </button>
                  <button
                    onClick={() => handleApprove(vendor._id)}
                    disabled={actionLoading === vendor._id}
                    className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors flex-1 justify-center disabled:opacity-60"
                  >
                    <CheckIcon className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => setRejectModal(vendor)}
                    className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex-1 justify-center"
                  >
                    <XMarkIcon className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vendor detail modal */}
      <Modal isOpen={!!selectedVendor} onClose={() => setSelectedVendor(null)} title="Vendor Application" size="lg">
        {selectedVendor && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs mb-0.5">Full Name</p><p className="font-medium">{selectedVendor.fullName}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Business Name</p><p className="font-medium">{selectedVendor.businessName}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Email</p><p className="font-medium">{selectedVendor.email}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Phone</p><p className="font-medium">{selectedVendor.phone}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Region</p><p className="font-medium">{selectedVendor.region?.name}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Institution</p><p className="font-medium text-xs">{selectedVendor.institution}</p></div>
            </div>
            {selectedVendor.businessDescription && (
              <div><p className="text-gray-400 text-xs mb-0.5">Business Description</p><p className="text-sm">{selectedVendor.businessDescription}</p></div>
            )}
            {/* ID documents */}
            <div>
              <p className="text-gray-400 text-xs mb-2">Verification Documents</p>
              <div className="grid grid-cols-3 gap-3">
                {[['Ghana Card Front', selectedVendor.ghanaCardFront], ['Ghana Card Back', selectedVendor.ghanaCardBack], ['Passport Photo', selectedVendor.passportPhoto]].map(([label, url]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} alt={label} className="w-full h-28 object-cover rounded-xl hover:opacity-80 transition-opacity" />
                      </a>
                    ) : (
                      <div className="h-28 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-xs">Not uploaded</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { handleApprove(selectedVendor._id); setSelectedVendor(null); }}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <CheckIcon className="h-5 w-5" /> Approve Vendor
              </button>
              <button
                onClick={() => { setRejectModal(selectedVendor); setSelectedVendor(null); }}
                className="flex-1 btn-danger flex items-center justify-center gap-2"
              >
                <XMarkIcon className="h-5 w-5" /> Reject
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject modal */}
      <Modal isOpen={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }} title="Reject Vendor Application">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You are rejecting the application from <strong>{rejectModal?.businessName || rejectModal?.fullName}</strong>. Please provide a reason.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="e.g. Documents are unclear, please resubmit with better quality photos..."
            className="input-field resize-none"
          />
          <div className="flex gap-3">
            <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleReject} disabled={actionLoading === rejectModal?._id} className="btn-danger flex-1">
              {actionLoading === rejectModal?._id ? 'Rejecting...' : 'Confirm Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
