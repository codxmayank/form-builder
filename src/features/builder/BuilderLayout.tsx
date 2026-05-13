import { useBuilderStore } from '@/stores/builder-store';
import FieldPalette from './FieldPalette';
import BuilderCanvas from './BuilderCanvas';
import ConfigPanel from './ConfigPanel';

export default function BuilderLayout() {
  const title = useBuilderStore((s) => s.template?.title ?? '');
  const setTitle = useBuilderStore((s) => s.setTitle);
  const isDirty = useBuilderStore((s) => s.isDirty);

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Form"
          className="w-64 border-none bg-transparent text-lg font-semibold text-gray-900 placeholder-gray-400 focus:outline-none"
          aria-label="Form title"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
          <button
            type="button"
            className="relative rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Save
            {isDirty && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          <FieldPalette />
        </aside>
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <BuilderCanvas />
        </div>
        <aside className="w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white">
          <ConfigPanel />
        </aside>
      </div>
    </div>
  );
}
