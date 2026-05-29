import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  TagIcon,
  EyeIcon,
  ChevronLeftIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatPrice, formatDate, getInstitutionBadgeClass, getInstitutionLabel } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/messages/${product.vendorId._id}`, { state: { product } });
  };

  if (loading) return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <p className="text-2xl font-bold text-gray-400">Product not found</p>
          <Link to="/" className="btn-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    </div>
  );

  const { title, description, price, category, images, condition, negotiable, views, createdAt, institution, institutionType, vendorId, region } = product;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="page-container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/student/browse" className="hover:text-primary-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-xs">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={images?.[activeImage] || '/placeholder.svg'}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.svg'; }}
              />
            </div>
            {images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-primary-500 scale-105' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img src={img} alt={`${title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={getInstitutionBadgeClass(institutionType)}>{getInstitutionLabel(institutionType)}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {category}
                </span>
                {condition && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    {condition}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                {title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1"><EyeIcon className="h-4 w-4" /> {views} views</span>
                <span>Listed {formatDate(createdAt)}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-primary-700 dark:text-primary-300">{formatPrice(price)}</span>
              {negotiable && (
                <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded-lg">
                  Negotiable
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPinIcon className="h-4 w-4 flex-shrink-0 text-primary-500" />
              <span>{institution} · {region?.name}</span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{description}</p>
            </div>

            {/* Vendor card */}
            {vendorId && (
              <div className="card p-5 flex items-center gap-4">
                {vendorId.passportPhoto ? (
                  <img src={vendorId.passportPhoto} alt={vendorId.fullName} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-black text-xl">
                    {vendorId.fullName?.[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-gray-900 dark:text-gray-100 truncate">
                      {vendorId.businessName || vendorId.fullName}
                    </p>
                    <CheckBadgeIcon className="h-4 w-4 text-primary-500 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{vendorId.institution}</p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleContact}
                className="flex-1 flex items-center justify-center gap-2 btn-primary py-3"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Chat with Seller
              </button>
              {vendorId?.phone && (
                <a
                  href={`tel:${vendorId.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 btn-secondary py-3"
                >
                  <PhoneIcon className="h-5 w-5" />
                  Call Seller
                </a>
              )}
            </div>

            {!isAuthenticated && (
              <p className="text-xs text-center text-gray-400">
                <Link to="/login" className="text-primary-600 font-medium hover:underline">Log in</Link> to contact the seller
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
