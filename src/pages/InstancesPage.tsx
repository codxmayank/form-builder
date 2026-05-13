import { useParams, Link, Navigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTemplateStore } from '@/stores/template-store';
import { getInstancesByTemplate, getInstances, saveInstances } from '@/lib/storage';
import { exportPdf } from '@/lib/pdf-export';
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

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            Submissions
          </h1>
          <p className="mt-1 text-sm text-gray-500">{template?.title || 'Loading...'}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/fill/${templateId}`}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Fill again
          </Link>
          <Link
            to={`/builder/${templateId}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Edit template
          </Link>
        </div>
      </div>

      {instances.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-gray-400">No submissions yet.</p>
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
                <th className="px-4 py-3 font-medium text-gray-600">#</th>
                <th className="px-4 py-3 font-medium text-gray-600">Submitted</th>
                <th className="px-4 py-3 font-medium text-gray-600">Fields filled</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {instances.map((instance, idx) => {
                const filledCount = Object.values(instance.values).filter(
                  (v) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0)
                ).length;

                return (
                  <tr key={instance.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(instance.submittedAt)}</td>
                    <td className="px-4 py-3 text-gray-500">{filledCount}</td>
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
                          className="text-xs font-medium text-gray-600 hover:text-gray-800"
                        >
                          PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(instance.id)}
                          className="text-xs font-medium text-red-500 hover:text-red-600"
                        >
                          Delete
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
