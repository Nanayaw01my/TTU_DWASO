import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { formatPrice, formatRelativeTime, getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const { _id, title, price, images, category, institution, institutionType, condition, views, createdAt, vendorId } = product;

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden group bg-white dark:bg-gray-900"
    >
      <Link to={`/products/${_id}`}>
        <div className="relative h-56 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={images?.[0] || '/placeholder.jpg'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Institution badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className={`${getInstitutionBadgeClass(institutionType)} shadow-sm`}>
              {getInstitutionLabel(institutionType)}
            </span>
          </div>

          {/* Condition badge */}
          {condition && condition !== 'Good' && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 shadow-sm">
                {condition}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Category label */}
        <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1.5">
          {category}
        </p>

        {/* Title */}
        <Link to={`/products/${_id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-2 mb-3 leading-snug text-[15px]">
            {title}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-black text-gray-900 dark:text-white">
              GHS {typeof price === 'number' ? price.toFixed(2) : formatPrice(price)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            <EyeIcon className="h-3.5 w-3.5" />
            <span>{views || 0}</span>
          </div>
        </div>

        {/* Bottom row — vendor + institution + time */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-50 dark:border-gray-800 pt-3">
          <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate flex-1">{institution}</span>
          {vendorId && (
            <>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <span className="truncate text-gray-400 dark:text-gray-500">
                {formatRelativeTime(createdAt)}
              </span>
            </>
          )}
        </div>
        {vendorId && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
            By {vendorId.businessName || vendorId.fullName}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="card overflow-hidden bg-white dark:bg-gray-900">
    <div className="skeleton h-56" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-16 rounded-full" />
      <div className="skeleton h-5 w-4/5" />
      <div className="skeleton h-4 w-3/5" />
      <div className="flex justify-between items-center pt-1">
        <div className="skeleton h-6 w-28" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="skeleton h-3 w-2/3 mt-2" />
    </div>
  </div>
);

export default ProductCard;
