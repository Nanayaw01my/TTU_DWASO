import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ImageUploader = ({ maxFiles = 5, onFilesChange, existingImages = [] }) => {
  const [previews, setPreviews] = useState(existingImages.map((url) => ({ url, file: null })));
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const remaining = maxFiles - previews.length;

    if (selected.length > remaining) {
      toast.error(`You can only add ${remaining} more image(s). Max ${maxFiles} total.`);
      return;
    }

    const newPreviews = selected.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    const updated = [...previews, ...newPreviews];
    setPreviews(updated);
    onFilesChange(updated.map((p) => p.file).filter(Boolean));
    e.target.value = '';
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onFilesChange(updated.map((p) => p.file).filter(Boolean));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AnimatePresence>
          {previews.map((preview, index) => (
            <motion.div
              key={preview.url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700"
            >
              <img src={preview.url} alt={`preview-${index}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full font-medium">
                  Cover
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {previews.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 flex flex-col items-center justify-center gap-2 transition-colors group"
          >
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
              <PlusIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <span className="text-xs text-gray-400 group-hover:text-primary-600 font-medium">Add Photo</span>
          </button>
        )}
      </div>

      {previews.length === 0 && (
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload images</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each · Max {maxFiles} images</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-gray-400">
        {previews.length}/{maxFiles} images · First image will be the cover photo
      </p>
    </div>
  );
};

export default ImageUploader;
