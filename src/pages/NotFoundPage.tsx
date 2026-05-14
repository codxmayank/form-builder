import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Go to Home
      </Link>
    </div>
  );
}
