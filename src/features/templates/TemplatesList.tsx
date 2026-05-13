import { useEffect } from 'react';
import { Link } from 'react-router';
import { useTemplateStore } from '@/stores/template-store';
import { getInstancesByTemplate } from '@/lib/storage';

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TemplatesList() {
  const templates = useTemplateStore((s) => s.templates);
  const loadTemplates = useTemplateStore((s) => s.loadTemplates);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  if (templates.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-medium text-gray-900">No templates yet</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create your first form template to get started.
        </p>
        <Link
          to="/builder/new"
          className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          New Template
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => {
        const instanceCount = getInstancesByTemplate(template.id).length;

        return (
          <Link
            key={template.id}
            to={`/builder/${template.id}`}
            className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
          >
            <h3 className="font-medium text-gray-900">{template.title || 'Untitled Form'}</h3>
            <div className="mt-2 flex gap-3 text-sm text-gray-500">
              <span>{template.fields.length} fields</span>
              <span>{instanceCount} responses</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Updated {formatRelativeTime(template.updatedAt)}
            </p>
            <Link
              to={`/fill/${template.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-3 inline-block rounded bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              New Response
            </Link>
          </Link>
        );
      })}
    </div>
  );
}
