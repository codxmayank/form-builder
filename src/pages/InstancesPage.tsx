import { useParams, Link, Navigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTemplateStore } from '@/stores/template-store';
import { getInstancesByTemplate, getInstances, saveInstances } from '@/lib/storage';
import { exportPdf, exportAllSubmissionsPdf } from '@/lib/pdf-export';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { FormInstance, FormTemplate } from '@/types/template';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export default function InstancesPage() {
  const { templateId } = useParams();
  const loadTemplates = useTemplateStore((s) => s.loadTemplates);
  const templates = useTemplateStore((s) => s.templates);
  const [instances, setInstances] = useState<FormInstance[]>(() =>
    templateId ? getInstancesByTemplate(templateId) : []
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const template = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId]
  );

  if (templates.length > 0 && !template) return <Navigate to="/" replace />;

  function deleteInstance(id: string) {
    const all = getInstances().filter((i) => i.id !== id);
    saveInstances(all);
    setInstances((prev) => prev.filter((i) => i.id !== id));
    setDeletingId(null);
  }

  function downloadPdf(instance: FormInstance) {
    if (!template) return;
    exportPdf(template as FormTemplate, instance.values);
  }

  function exportAllPdf() {
    if (!template || instances.length === 0) return;
    exportAllSubmissionsPdf(template as FormTemplate, instances);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            Submissions
          </h1>
          <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
            {template?.title || 'Untitled Form'}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {instances.length > 0 && (
            <button
              type="button"
              onClick={exportAllPdf}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Export All PDF
            </button>
          )}
          <Link
            to={`/fill/${templateId}`}
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white hover:bg-gray-800 sm:px-4 sm:py-2 sm:text-sm dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Fill again
          </Link>
          <Link
            to={`/builder/${templateId}`}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Edit template
          </Link>
        </div>
      </div>

      {instances.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-gray-400 dark:text-gray-500">No submissions yet.</p>
          <Link
            to={`/fill/${templateId}`}
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Fill this form &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">#</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                  Submitted
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                  Fields filled
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {instances.map((instance, idx) => {
                const filledCount = Object.values(instance.values).filter(
                  (v) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0)
                ).length;

                return (
                  <tr key={instance.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatDate(instance.submittedAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{filledCount}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/fill/${templateId}/${instance.id}`}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => downloadPdf(instance)}
                          className="text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(instance.id)}
                          className="text-red-500 hover:text-red-600"
                          aria-label="Delete submission"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deletingId}
        title="Delete submission"
        message="This will permanently remove this submission."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deletingId && deleteInstance(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </main>
  );
}
