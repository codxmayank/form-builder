import { Link, Outlet } from 'react-router';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <header
        className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
        role="banner"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
            FormCraft
          </Link>
          <nav className="flex items-center gap-3" aria-label="Main navigation">
            <ThemeToggle />
            <Link
              to="/builder/new"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              New Template
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
