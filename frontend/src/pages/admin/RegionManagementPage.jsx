import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/common/DashboardLayout';
import Modal from '../../components/common/Modal';
import api from '../../utils/api';
import { getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function RegionManagementPage() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [addInstModal, setAddInstModal] = useState(null);
  const [newInst, setNewInst] = useState({ name: '', type: 'UNIVERSITY' });

  useEffect(() => {
    api.get('/regions/full')
      .then(({ data }) => setRegions(data.regions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddInstitution = async () => {
    if (!newInst.name.trim()) { toast.error('Institution name is required'); return; }
    try {
      const { data } = await api.post(`/regions/${addInstModal._id}/institutions`, newInst);
      setRegions((prev) => prev.map((r) => r._id === addInstModal._id ? data.region : r));
      setAddInstModal(null);
      setNewInst({ name: '', type: 'UNIVERSITY' });
      toast.success('Institution added');
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteInstitution = async (regionId, instId) => {
    if (!confirm('Remove this institution?')) return;
    try {
      await api.delete(`/regions/${regionId}/institutions/${instId}`);
      setRegions((prev) => prev.map((r) =>
        r._id === regionId ? { ...r, institutions: r.institutions.filter((i) => i._id !== instId) } : r
      ));
      toast.success('Institution removed');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <DashboardLayout>
      <div className="page-container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">Regions & Institutions</h1>
            <p className="text-sm text-gray-500 mt-1">{regions.length} regions · {regions.reduce((sum, r) => sum + r.institutions.length, 0)} institutions</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {regions.map((region) => (
              <div key={region._id} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === region._id ? null : region._id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 font-black text-sm">
                      {region.code}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-gray-100">{region.name}</p>
                      <p className="text-xs text-gray-400">{region.institutions?.length || 0} institutions</p>
                    </div>
                  </div>
                  <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${expanded === region._id ? 'rotate-180' : ''}`} />
                </button>

                {expanded === region._id && (
                  <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Institutions</p>
                      <button
                        onClick={() => setAddInstModal(region)}
                        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <PlusIcon className="h-4 w-4" /> Add Institution
                      </button>
                    </div>
                    <div className="space-y-2">
                      {region.institutions?.map((inst) => (
                        <div key={inst._id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={getInstitutionBadgeClass(inst.type)}>{getInstitutionLabel(inst.type)}</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{inst.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteInstitution(region._id, inst._id)}
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0 ml-2"
                          >
                            <TrashIcon className="h-3.5 w-3.5 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal isOpen={!!addInstModal} onClose={() => setAddInstModal(null)} title={`Add Institution to ${addInstModal?.name}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Institution Name</label>
            <input
              value={newInst.name}
              onChange={(e) => setNewInst((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. New University College"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
            <select
              value={newInst.type}
              onChange={(e) => setNewInst((prev) => ({ ...prev, type: e.target.value }))}
              className="input-field"
            >
              <option value="UNIVERSITY">University</option>
              <option value="NURSING">Nursing Training College</option>
              <option value="TEACHER">Teacher Training College</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAddInstModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleAddInstitution} className="btn-primary flex-1">Add Institution</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
