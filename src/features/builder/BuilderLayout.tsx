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
    if (!exists) navigate(`/builder/${template.id}`, { replace: true });
  }

  function confirmDelete() {
    if (!template) return;
    deleteTemplate(template.id);
    navigate('/');
  }

  return (
    <div className="flex h-[calc(100dvh-57px)] flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2 sm:px-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Form"
          className="w-40 border-none bg-transparent text-base font-semibold text-gray-900 placeholder-gray-400 focus:outline-none sm:w-64 sm:text-lg"
          aria-label="Form title"
        />
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile-only panel toggles */}
          <button
            type="button"
            onClick={() => setMobilePanel(mobilePanel === 'palette' ? null : 'palette')}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:hidden"
            aria-label="Toggle field palette"
          >
            + Fields
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel(mobilePanel === 'config' ? null : 'config')}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:hidden"
            aria-label="Toggle config panel"
          >
            Config
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 sm:px-3 sm:text-sm"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setPreviewing(true)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-4 sm:text-sm"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={save}
            className="relative rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 sm:px-4 sm:text-sm"
          >
            Save
            {isDirty && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-over panel */}
      {mobilePanel && (
        <div className="border-b border-gray-200 bg-white sm:hidden">
          <div className="max-h-72 overflow-y-auto sm:max-h-80">
            {mobilePanel === 'palette' ? <FieldPalette /> : <ConfigPanel />}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white sm:block">
          <FieldPalette />
        </aside>
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <BuilderCanvas />
        </div>
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white md:block">
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
