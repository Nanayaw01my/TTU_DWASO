const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

const Loader = ({ size = 'md', className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div
      className={`${sizes[size]} border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin`}
    />
  </div>
);

export default Loader;
