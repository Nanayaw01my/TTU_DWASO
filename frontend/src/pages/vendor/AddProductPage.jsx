import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/common/DashboardLayout';
import ImageUploader from '../../components/common/ImageUploader';
import api from '../../utils/api';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AddProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (imageFiles.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('category', data.category);
      formData.append('condition', data.condition);
      formData.append('negotiable', data.negotiable ? 'true' : 'false');
      imageFiles.forEach((file) => formData.append('images', file));

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product listed successfully!');
      navigate('/vendor/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/vendor/products" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="section-title">Add New Product</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">List an item for sale at your institution</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Images */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Product Images</h2>
            <ImageUploader maxFiles={5} onFilesChange={setImageFiles} />
          </div>

          {/* Basic Info */}
          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">Product Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'At least 5 characters' } })}
                placeholder="e.g. Introduction to Biochemistry Textbook"
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'At least 20 characters' } })}
                rows={5}
                placeholder="Describe your product in detail — condition, any defects, why you're selling..."
                className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Price (GHS) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
                  placeholder="0.00"
                  className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                >
                  <option value="">Select category</option>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Condition</label>
                <select {...register('condition')} className="input-field">
                  {PRODUCT_CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <input type="checkbox" id="negotiable" {...register('negotiable')} className="w-4 h-4 rounded text-primary-600 border-gray-300" />
                <label htmlFor="negotiable" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Price is negotiable
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link to="/vendor/products" className="btn-secondary flex-1 text-center py-3">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Uploading...
                </span>
              ) : 'List Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
