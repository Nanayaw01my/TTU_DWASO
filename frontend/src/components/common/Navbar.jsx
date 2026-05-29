import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
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
    <nav className="sticky top-0 z-40 bg-black border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <span className="text-black font-black text-sm">CD</span>
            </div>
            <span className="font-black text-lg text-white tracking-tight">
              Campus<span className="text-yellow-400">Dwaso</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className="text-sm font-medium text-zinc-300 hover:text-yellow-400 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all"
            >
              Home
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-zinc-300 hover:text-yellow-400 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-black font-bold text-sm py-2 px-4 rounded-xl hover:bg-yellow-300 transition-colors"
                >
                  Join Free
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={dashboardPath[user.role]}
                  className="text-sm font-medium text-zinc-300 hover:text-yellow-400 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all"
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-zinc-300 hover:text-yellow-400" />
                </Link>
                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    {user.passportPhoto ? (
                      <img
                        src={user.passportPhoto}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-zinc-400" />
                    )}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-xl shadow-black/50"
                      >
                        <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                          <p className="font-semibold text-sm text-white truncate">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
                        </div>
                        <Link
                          to={dashboardPath[user.role]}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-yellow-400 transition-colors"
                        >
                          <UserCircleIcon className="h-4 w-4" /> Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-900/20 text-sm text-red-400 transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-white" />
              )}
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
              className="md:hidden border-t border-zinc-800 py-3 space-y-1"
            >
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400"
              >
                Home
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-yellow-400"
                  >
                    Join Free
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={dashboardPath[user.role]}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400"
                  >
                    Messages
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20"
                  >
                    Logout
                  </button>
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
