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
              className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
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
                  className="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                >
                  Delete
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
