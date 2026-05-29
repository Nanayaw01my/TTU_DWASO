import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HomeIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  UsersIcon,
  ClockIcon,
  FlagIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = {
  student: [
    { to: '/student/dashboard', end: true, label: 'Dashboard', icon: HomeIcon },
    { to: '/student/browse', label: 'Browse Products', icon: ShoppingBagIcon },
    { to: '/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
  ],
  vendor: [
    { to: '/vendor/dashboard', end: true, label: 'Dashboard', icon: HomeIcon },
    { to: '/vendor/products', label: 'My Products', icon: ShoppingBagIcon },
    { to: '/vendor/products/add', label: 'Add Product', icon: PlusIcon },
    { to: '/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
  ],
  admin: [
    { to: '/admin/dashboard', end: true, label: 'Dashboard', icon: HomeIcon },
    { to: '/admin/vendors', label: 'Vendor Approvals', icon: ClockIcon },
    { to: '/admin/users', label: 'Users', icon: UsersIcon },
    { to: '/admin/products', label: 'Products', icon: FlagIcon },
    { to: '/admin/regions', label: 'Regions', icon: MapPinIcon },
    { to: '/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
  ],
};

function SidebarInner({ onLinkClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const links = NAV_LINKS[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-black border-r border-zinc-800">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-400/30 flex-shrink-0">
          <span className="text-black font-black text-sm">CD</span>
        </div>
        <div className="min-w-0">
          <span className="font-black text-white text-lg tracking-tight leading-tight block">
            CAMPUS <span className="text-yellow-400">DWASO</span>
          </span>
          <p className="text-zinc-500 text-xs capitalize leading-tight">{user?.role} portal</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-400/10 text-yellow-400 border-l-2 border-yellow-400'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-yellow-400' : ''}`} />
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-zinc-800 flex-shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 mb-1"
        >
          {dark ? (
            <SunIcon className="h-4 w-4 text-amber-400" />
          ) : (
            <MoonIcon className="h-4 w-4" />
          )}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
            {user?.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.fullName}</p>
            <p className="text-zinc-400 text-xs capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-yellow-400 transition-colors flex-shrink-0"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Desktop sidebar — fixed */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col z-30">
        <SidebarInner />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden flex flex-col"
            >
              <SidebarInner onLinkClick={() => setSidebarOpen(false)} />
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top header bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <span className="text-black font-black text-xs">CD</span>
            </div>
            <span className="font-black text-gray-900 dark:text-white text-sm">
              CAMPUS <span className="text-yellow-500 dark:text-yellow-400">DWASO</span>
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={toggle}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {dark ? (
                <SunIcon className="h-5 w-5 text-amber-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-black font-bold text-sm">
              {user?.fullName?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
