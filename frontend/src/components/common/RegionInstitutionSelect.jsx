import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';
import Loader from './Loader';

const RegionInstitutionSelect = ({ onRegionChange, onInstitutionChange, onInstitutionTypeChange, regionError, institutionError }) => {
  const [regions, setRegions] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  useEffect(() => {
    api.get('/regions')
      .then(({ data }) => setRegions(data.regions))
      .catch(() => {})
      .finally(() => setLoadingRegions(false));
  }, []);

  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedInstitution('');
    onRegionChange(regionId);
    onInstitutionChange('');
    if (onInstitutionTypeChange) onInstitutionTypeChange('');

    if (!regionId) {
      setInstitutions([]);
      return;
    }

    setLoadingInstitutions(true);
    try {
      const { data } = await api.get(`/regions/${regionId}/institutions`);
      setInstitutions(data.institutions);
    } catch {
      setInstitutions([]);
    } finally {
      setLoadingInstitutions(false);
    }
  };

  const handleInstitutionChange = (e) => {
    const name = e.target.value;
    setSelectedInstitution(name);
    onInstitutionChange(name);
    const inst = institutions.find((i) => i.name === name);
    if (inst && onInstitutionTypeChange) onInstitutionTypeChange(inst.type);
  };

  const groupedInstitutions = institutions.reduce((acc, inst) => {
    if (!acc[inst.type]) acc[inst.type] = [];
    acc[inst.type].push(inst);
    return acc;
  }, {});

  const groupLabels = {
    UNIVERSITY: '🎓 Universities',
    NURSING: '🏥 Nursing Training Colleges',
    TEACHER: '📚 Teacher Training Colleges',
  };

  return (
    <div className="space-y-4">
      {/* Region */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Region <span className="text-red-500">*</span>
        </label>
        {loadingRegions ? (
          <div className="input-field flex items-center gap-2">
            <Loader size="sm" /> <span className="text-gray-400 text-sm">Loading regions...</span>
          </div>
        ) : (
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className={`input-field ${regionError ? 'border-red-500 focus:ring-red-500' : ''}`}
          >
            <option value="">Select your region</option>
            {regions.map((r) => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        )}
        {regionError && <p className="text-red-500 text-xs mt-1">{regionError}</p>}
      </div>

      {/* Institution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Institution <span className="text-red-500">*</span>
        </label>
        {loadingInstitutions ? (
          <div className="input-field flex items-center gap-2">
            <Loader size="sm" /> <span className="text-gray-400 text-sm">Loading institutions...</span>
          </div>
        ) : (
          <select
            value={selectedInstitution}
            onChange={handleInstitutionChange}
            disabled={!selectedRegion || institutions.length === 0}
            className={`input-field ${institutionError ? 'border-red-500 focus:ring-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="">
              {!selectedRegion ? 'Select a region first' : institutions.length === 0 ? 'No institutions found' : 'Select your institution'}
            </option>
            {Object.entries(groupedInstitutions).map(([type, insts]) => (
              <optgroup key={type} label={groupLabels[type] || type}>
                {insts.map((inst) => (
                  <option key={inst._id} value={inst.name}>
                    {inst.name} [{type}]
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        )}
        {institutionError && <p className="text-red-500 text-xs mt-1">{institutionError}</p>}

        {/* Institution type badges legend */}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="badge-university">University</span>
          <span className="badge-nursing">Nursing College</span>
          <span className="badge-teacher">Teacher Training</span>
        </div>
      </div>
    </div>
  );
};

export default RegionInstitutionSelect;
