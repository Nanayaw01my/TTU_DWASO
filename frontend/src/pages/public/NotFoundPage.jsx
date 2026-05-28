import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
        <div>
          <div className="text-9xl font-black text-primary-200 dark:text-primary-900 mb-4">404</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-4">Page Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary px-8 py-3 text-base">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
