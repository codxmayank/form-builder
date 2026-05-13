import { useLocation, useNavigate } from 'react-router';
import { useCallback } from 'react';
import TemplatesList from '@/features/templates/TemplatesList';
import Toast from '@/components/Toast';

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const showSaved = (location.state as { saved?: boolean } | null)?.saved === true;

  const hideToast = useCallback(() => {
    navigate(location.pathname, { replace: true, state: {} });
  }, [navigate, location.pathname]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Templates</h1>
      <div className="mt-6">
        <TemplatesList />
      </div>
      {showSaved && (
        <Toast message="Template saved successfully" variant="success" onClose={hideToast} />
      )}
    </div>
  );
}
