import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ links, title }) => {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="card p-4 sticky top-20">
        {title && (
          <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-2">
            {title}
          </h2>
        )}
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              {link.icon && <link.icon className="h-5 w-5 flex-shrink-0" />}
              <span>{link.label}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1 font-bold">
                  {link.badge > 99 ? '99+' : link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
