import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/common/Navbar';
import ImageUploader from '../../components/common/ImageUploader';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data.product);
        reset({
          title: data.product.title,
          description: data.product.description,
          price: data.product.price,
          category: data.product.category,
          condition: data.product.condition,
          negotiable: data.product.negotiable,
          isAvailable: data.product.isAvailable,
        });
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, String(v));
      });
      if (replaceImages && newImages.length > 0) {
        newImages.forEach((file) => formData.append('images', file));
      }

      await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product updated!');
      navigate('/vendor/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="page-container py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/vendor/products" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="section-title">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current images */}
          {product?.images && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 dark:text-gray-100">Product Images</h2>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={replaceImages} onChange={(e) => setReplaceImages(e.target.checked)} className="rounded" />
                  Replace images
                </label>
              </div>

              {!replaceImages ? (
                <div className="flex gap-3 flex-wrap">
                  {product.images.map((img, i) => (
                    <img key={i} src={img} alt={`Product ${i+1}`} className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700" />
                  ))}
                </div>
              ) : (
                <ImageUploader maxFiles={5} onFilesChange={setNewImages} existingImages={[]} />
              )}
            </div>
          )}

          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">Product Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title <span className="text-red-500">*</span></label>
              <input {...register('title', { required: 'Title is required' })} className={`input-field ${errors.title ? 'border-red-500' : ''}`} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea {...register('description', { required: 'Description is required' })} rows={5} className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`} />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (GHS) <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" min="0" {...register('price', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select {...register('category', { required: true })} className="input-field">
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Condition</label>
                <select {...register('condition')} className="input-field">
                  {PRODUCT_CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input type="checkbox" {...register('negotiable')} className="rounded text-primary-600" />
                  Price is negotiable
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input type="checkbox" {...register('isAvailable')} className="rounded text-primary-600" />
                  Product is available
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link to="/vendor/products" className="btn-secondary flex-1 text-center py-3">Cancel</Link>
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
