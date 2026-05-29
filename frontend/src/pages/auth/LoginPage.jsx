import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, BuildingLibraryIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LEFT_STATS = [
  { value: '80+', label: 'Institutions' },
  { value: '16', label: 'Ghana Regions' },
  { value: '8', label: 'Categories' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const redirectMap = {
    admin: '/admin/dashboard',
    vendor: '/vendor/dashboard',
    student: '/student/dashboard',
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      const from = location.state?.from?.pathname || redirectMap[user.role] || '/';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — sky/emerald gradient brand side */}
      <div className="hidden lg:flex lg:w-[45%] flex-col bg-gradient-to-br from-sky-900 via-slate-800 to-emerald-900 relative overflow-hidden">
        {/* Ghana flag strip */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 flex-shrink-0" />

        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-between p-12 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <span className="text-white font-black text-sm">CD</span>
            </div>
            <div>
              <span className="font-black text-white text-xl tracking-tight leading-tight block">
                CAMPUS <span className="text-sky-400">DWASO</span>
              </span>
              <span className="text-sky-300/60 text-xs">Campus Marketplace</span>
            </div>
          </Link>

          {/* Main copy */}
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Ghana's Campus{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-emerald-300">
                Marketplace
              </span>
            </h2>
            <p className="text-sky-100/70 text-base leading-relaxed mb-10">
              Buy and sell within your institution safely. Verified vendors, secure payments, and everything a student needs.
            </p>

            {/* Feature pills */}
            <div className="space-y-3 mb-10">
              {[
                { icon: ShieldCheckIcon, text: 'Verified vendors with Ghana Card' },
                { icon: BuildingLibraryIcon, text: 'Institution-locked marketplace' },
                { icon: ShoppingBagIcon, text: 'Books, electronics, food & more' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-sky-300" />
                  </div>
                  <span className="text-sky-100/80 text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {LEFT_STATS.map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                  <div className="text-sky-300/70 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom ghana strip */}
          <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full" />
        </div>
      </div>

      {/* Right panel — clean white form */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-950">
        {/* Mobile Ghana strip */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 lg:hidden" />

        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            {/* Mobile logo */}
            <div className="text-center mb-10 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-black">CD</span>
                </div>
                <span className="font-black text-2xl text-gray-900 dark:text-white">
                  CAMPUS <span className="text-sky-600 dark:text-sky-400">DWASO</span>
                </span>
              </Link>
              <p className="text-gray-400 mt-2 text-sm">Campus Marketplace Ghana</p>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Welcome back</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' },
                  })}
                  placeholder="you@institution.edu.gh"
                  className={`input-field ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    placeholder="••••••••"
                    className={`input-field pr-12 ${errors.password ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
