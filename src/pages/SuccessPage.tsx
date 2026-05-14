import { useParams, Link } from 'react-router';
import { getTemplates } from '@/lib/storage';
import { getInstances } from '@/lib/storage';
import { exportPdf } from '@/lib/pdf-export';

export default function SuccessPage() {
  const { templateId, instanceId } = useParams();

  function handleExportPdf() {
    const template = getTemplates().find((t) => t.id === templateId);
    const instance = getInstances().find((i) => i.id === instanceId);
    if (!template || !instance) return;
    exportPdf(template, instance.values);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
        <svg
          className="h-8 w-8 text-green-600 dark:text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submission Successful!</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Your response has been recorded. Thank you for filling out the form.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handleExportPdf}
          className="cursor-pointer rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Export as PDF
        </button>
        <Link
          to={`/fill/${templateId}`}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Submit Another
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
