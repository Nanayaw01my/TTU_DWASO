import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = {
    admin: '/admin/dashboard',
    vendor: '/vendor/dashboard',
    student: '/student/dashboard',
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-md group-hover:shadow-primary-500/30 transition-shadow">
              <span className="text-white font-black text-sm">TD</span>
            </div>
            <span className="font-black text-xl text-gray-900 dark:text-white tracking-tight">
              TTU <span className="text-primary-600">DWASO</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              Home
            </Link>

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={dashboardPath[user.role]}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Dashboard
                </Link>
                <Link to="/messages" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Link>
                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {user.passportPhoto ? (
                      <img src={user.passportPhoto} alt={user.fullName} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-52 card p-2 shadow-lg"
                      >
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{user.fullName}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <Link
                          to={dashboardPath[user.role]}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                        >
                          <UserCircleIcon className="h-4 w-4" /> Dashboard
                        </Link>
                        <button
                          onClick={() => { setProfileOpen(false); handleLogout(); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1">
              {dark ? <SunIcon className="h-5 w-5 text-amber-400" /> : <MoonIcon className="h-5 w-5 text-gray-600" />}
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? <SunIcon className="h-5 w-5 text-amber-400" /> : <MoonIcon className="h-5 w-5 text-gray-600" />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 py-3 space-y-1"
            >
              <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Home</Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-primary-600 dark:text-primary-400">Register</Link>
                </>
              ) : (
                <>
                  <Link to={dashboardPath[user.role]} onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Dashboard</Link>
                  <Link to="/messages" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Messages</Link>
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
