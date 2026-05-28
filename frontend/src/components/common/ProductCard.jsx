import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { formatPrice, formatRelativeTime, getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const { _id, title, price, images, category, institution, institutionType, condition, views, createdAt, vendorId } = product;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden group hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/products/${_id}`}>
        <div className="relative h-52 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={images?.[0] || '/placeholder.jpg'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2 left-2">
            <span className={getInstitutionBadgeClass(institutionType)}>
              {getInstitutionLabel(institutionType)}
            </span>
          </div>
          {condition && condition !== 'Good' && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                {condition}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-1">{category}</p>
        <Link to={`/products/${_id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{institution}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-primary-700 dark:text-primary-300">
            {formatPrice(price)}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <EyeIcon className="h-3.5 w-3.5" />
            <span>{views || 0}</span>
          </div>
        </div>

        {vendorId && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 truncate">
            By {vendorId.businessName || vendorId.fullName} · {formatRelativeTime(createdAt)}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-52" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-20" />
      <div className="skeleton h-5 w-4/5" />
      <div className="skeleton h-3 w-3/5" />
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-24" />
        <div className="skeleton h-3 w-12" />
      </div>
    </div>
  </div>
);

export default ProductCard;
