import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import RegionInstitutionSelect from '../../components/common/RegionInstitutionSelect';
import toast from 'react-hot-toast';

const FileInput = ({ label, name, required, onChange, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-3 hover:border-primary-400 transition-colors">
      <input
        type="file"
        name={name}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <PhotoIcon className="h-6 w-6 text-gray-400" />
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300">Choose file</p>
          {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
      </div>
    </div>
  </div>
);

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';

  const [role, setRole] = useState(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regionId, setRegionId] = useState('');
  const [institution, setInstitution] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [files, setFiles] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [errors2, setErrors2] = useState({});

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: defaultRole } });
  const password = watch('password');

  const handleFileChange = (name, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles((prev) => ({ ...prev, [name]: file }));
    setFilePreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  const validate = () => {
    const errs = {};
    if (!regionId) errs.region = 'Region is required';
    if (!institution) errs.institution = 'Institution is required';
    if (!files.ghanaCardFront) errs.ghanaCardFront = 'Ghana Card front is required';
    if (!files.ghanaCardBack) errs.ghanaCardBack = 'Ghana Card back is required';
    if (!files.passportPhoto) errs.passportPhoto = 'Passport photo / Student ID is required';
    setErrors2(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (data) => {
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('regionId', regionId);
      formData.append('institution', institution);
      formData.append('institutionType', institutionType);
      if (role === 'vendor') {
        formData.append('businessName', data.businessName);
        formData.append('businessDescription', data.businessDescription || '');
      }
      if (role === 'student' && data.studentId) {
        formData.append('studentId', data.studentId);
      }
      if (files.ghanaCardFront) formData.append('ghanaCardFront', files.ghanaCardFront);
      if (files.ghanaCardBack) formData.append('ghanaCardBack', files.ghanaCardBack);
      if (files.passportPhoto) formData.append('passportPhoto', files.passportPhoto);

      const result = await registerUser(formData);
      toast.success(result.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-950 dark:to-gray-900 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">TD</span>
            </div>
            <span className="font-black text-2xl text-gray-900 dark:text-white">
              TTU <span className="text-primary-600">DWASO</span>
            </span>
          </Link>
        </div>

        <div className="card p-8 shadow-xl">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Join the campus marketplace for Ghanaian students</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['student', 'vendor'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`p-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${
                  role === r
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                {r === 'student' ? '👨‍🎓 Student' : '🏪 Vendor / Seller'}
              </button>
            ))}
          </div>

          {role === 'vendor' && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                ⚠️ Vendor accounts require admin approval and identity verification before you can start selling.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Vendor-only: Business Name */}
            {role === 'vendor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('businessName', { required: role === 'vendor' ? 'Business name is required' : false })}
                    placeholder="e.g. Kwame's Book Store"
                    className={`input-field ${errors.businessName ? 'border-red-500' : ''}`}
                  />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Description</label>
                  <textarea
                    {...register('businessDescription')}
                    rows={3}
                    placeholder="Describe what you sell..."
                    className="input-field resize-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'At least 3 characters' } })}
                placeholder="Kofi Mensah Asante"
                className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  })}
                  placeholder="you@email.com"
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: { value: /^(\+233|0)[0-9]{9}$/, message: 'Valid Ghana number required (e.g. 0241234567)' },
                  })}
                  placeholder="0241234567"
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Student ID (Optional)
                </label>
                <input
                  {...register('studentId')}
                  placeholder="e.g. 20219001234"
                  className="input-field"
                />
              </div>
            )}

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'At least 8 characters' },
                    })}
                    placeholder="••••••••"
                    className={`input-field pr-12 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === password || 'Passwords do not match',
                  })}
                  placeholder="••••••••"
                  className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Region & Institution */}
            <RegionInstitutionSelect
              onRegionChange={setRegionId}
              onInstitutionChange={setInstitution}
              onInstitutionTypeChange={setInstitutionType}
              regionError={errors2.region}
              institutionError={errors2.institution}
            />

            {/* Document Uploads */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Identity Verification Documents</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FileInput
                    label="Ghana Card — Front"
                    name="ghanaCardFront"
                    required
                    onChange={(e) => handleFileChange('ghanaCardFront', e)}
                    hint="Clear photo of front side"
                  />
                  {filePreviews.ghanaCardFront && (
                    <img src={filePreviews.ghanaCardFront} alt="Ghana Card Front" className="mt-2 h-24 w-full object-cover rounded-lg" />
                  )}
                  {errors2.ghanaCardFront && <p className="text-red-500 text-xs mt-1">{errors2.ghanaCardFront}</p>}
                </div>

                <div>
                  <FileInput
                    label="Ghana Card — Back"
                    name="ghanaCardBack"
                    required
                    onChange={(e) => handleFileChange('ghanaCardBack', e)}
                    hint="Clear photo of back side"
                  />
                  {filePreviews.ghanaCardBack && (
                    <img src={filePreviews.ghanaCardBack} alt="Ghana Card Back" className="mt-2 h-24 w-full object-cover rounded-lg" />
                  )}
                  {errors2.ghanaCardBack && <p className="text-red-500 text-xs mt-1">{errors2.ghanaCardBack}</p>}
                </div>
              </div>

              <div>
                <FileInput
                  label={role === 'vendor' ? 'Passport Picture' : 'Passport Picture / Student ID'}
                  name="passportPhoto"
                  required
                  onChange={(e) => handleFileChange('passportPhoto', e)}
                  hint="Clear face photo or student ID card"
                />
                {filePreviews.passportPhoto && (
                  <img src={filePreviews.passportPhoto} alt="Passport" className="mt-2 h-28 w-32 object-cover rounded-xl" />
                )}
                {errors2.passportPhoto && <p className="text-red-500 text-xs mt-1">{errors2.passportPhoto}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                `Create ${role === 'vendor' ? 'Vendor' : 'Student'} Account`
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
