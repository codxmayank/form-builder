import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useBuilderStore } from '@/stores/builder-store';
import { useTemplateStore } from '@/stores/template-store';
import ConfirmDialog from '@/components/ConfirmDialog';
import FieldPalette from './FieldPalette';
import BuilderCanvas from './BuilderCanvas';
import ConfigPanel from './ConfigPanel';
import PreviewOverlay from './components/PreviewOverlay';

export default function BuilderLayout() {
  const navigate = useNavigate();
  const template = useBuilderStore((s) => s.template);
  const title = useBuilderStore((s) => s.template?.title ?? '');
  const setTitle = useBuilderStore((s) => s.setTitle);
  const isDirty = useBuilderStore((s) => s.isDirty);
  const markClean = useBuilderStore((s) => s.markClean);
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTemplateStore();

  const [previewing, setPreviewing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'palette' | 'config' | null>(null);

  function save() {
    if (!template) return;
    const updated = { ...template, updatedAt: new Date().toISOString() };
    const exists = templates.some((t) => t.id === template.id);
    if (exists) {
      updateTemplate(updated);
    } else {
      addTemplate(updated);
    }
    markClean();
    navigate('/', { replace: true });
  }

  function confirmDelete() {
    if (!template) return;
    deleteTemplate(template.id);
    navigate('/');
  }

  return (
    <div className="flex h-[calc(100dvh-57px)] flex-col">
      {/* Toolbar — stacks on mobile, single row on sm+ */}
      <div className="border-b border-gray-200 bg-white px-3 py-2 sm:px-4 dark:border-gray-800 dark:bg-gray-950">
        {/* Row 1: title + desktop-only actions */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Form"
            className="max-w-md min-w-0 flex-1 border-none bg-transparent text-base font-semibold text-gray-900 placeholder-gray-400 focus:outline-none sm:text-lg dark:text-white dark:placeholder-gray-500"
            aria-label="Form title"
          />
          {/* Desktop actions — hidden on mobile */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              aria-label="Delete template"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4.5 w-4.5"
              >
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setPreviewing(true)}
              className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={save}
              className="relative rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Save
              {isDirty && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: mobile-only actions */}
        <div className="mt-2 flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMobilePanel(mobilePanel === 'palette' ? null : 'palette')}
              className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle field palette"
            >
              + Fields
            </button>
            <button
              type="button"
              onClick={() => setMobilePanel(mobilePanel === 'config' ? null : 'config')}
              className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle config panel"
            >
              Config
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
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
            <button
              type="button"
              onClick={() => setPreviewing(true)}
              className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={save}
              className="relative rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Save
              {isDirty && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-over panel */}
      {mobilePanel && (
        <div className="border-b border-gray-200 bg-white sm:hidden dark:border-gray-800 dark:bg-gray-950">
          <div className="max-h-64 overflow-y-auto">
            {mobilePanel === 'palette' ? <FieldPalette /> : <ConfigPanel />}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white sm:block dark:border-gray-800 dark:bg-gray-950">
          <FieldPalette />
        </aside>
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <BuilderCanvas />
        </div>
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white md:block dark:border-gray-800 dark:bg-gray-950">
          <ConfigPanel />
        </aside>
      </div>

      {previewing && template && (
        <PreviewOverlay
          title={template.title}
          fields={template.fields}
          onClose={() => setPreviewing(false)}
        />
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete template"
        message="This will permanently delete this template and all its responses. This can't be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
