import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTemplateStore } from '@/stores/template-store';
import { getInstancesByTemplate } from '@/lib/storage';
import ConfirmDialog from '@/components/ConfirmDialog';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function TemplatesList() {
  const templates = useTemplateStore((s) => s.templates);
  const loadTemplates = useTemplateStore((s) => s.loadTemplates);
  const deleteTemplate = useTemplateStore((s) => s.deleteTemplate);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  if (templates.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">No templates yet</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create your first form template to get started.
        </p>
        <Link
          to="/builder/new"
          className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          New Template
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => {
          const responses = getInstancesByTemplate(t.id).length;
          return (
            <div
              key={t.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/builder/${t.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/builder/${t.id}`);
                }
              }}
              className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500"
            >
              <h3 className="truncate font-medium text-gray-900 dark:text-white">
                {t.title || 'Untitled Form'}
              </h3>
              <div className="mt-2 flex gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{t.fields.length} fields</span>
                <span>{responses} responses</span>
              </div>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Updated {timeAgo(t.updatedAt)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to={`/fill/${t.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  New Response
                </Link>
                <Link
                  to={`/instances/${t.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Responses{responses > 0 && ` (${responses})`}
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingId(t.id);
                  }}
                  className="rounded bg-red-50 p-1.5 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                  aria-label="Delete template"
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
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={deletingId !== null}
        title="Delete template"
        message="This will permanently delete this template and all its responses."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (deletingId) deleteTemplate(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
}
