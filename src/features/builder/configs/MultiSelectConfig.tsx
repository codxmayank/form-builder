import type { MultiSelectField, SelectOption } from '@/types/fields';

export default function MultiSelectConfig({
  field,
  onChange
}: {
  field: MultiSelectField;
  onChange: (updates: Partial<MultiSelectField>) => void;
}) {
  function addOption() {
    const option: SelectOption = { id: crypto.randomUUID(), label: '' };
    onChange({ options: [...field.options, option] });
  }

  function updateOption(id: string, label: string) {
    onChange({ options: field.options.map((o) => (o.id === id ? { ...o, label } : o)) });
  }

  function removeOption(id: string) {
    onChange({ options: field.options.filter((o) => o.id !== id) });
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onChange({ required: e.target.checked })}
          className="rounded border-gray-300"
        />
        Required
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="cfg-minsel"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Min selections
          </label>
          <input
            id="cfg-minsel"
            type="number"
            min={0}
            value={field.minSelections ?? ''}
            onChange={(e) =>
              onChange({ minSelections: e.target.value ? Number(e.target.value) : null })
            }
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="cfg-maxsel"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Max selections
          </label>
          <input
            id="cfg-maxsel"
            type="number"
            min={0}
            value={field.maxSelections ?? ''}
            onChange={(e) =>
              onChange({ maxSelections: e.target.value ? Number(e.target.value) : null })
            }
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</span>
          <button
            type="button"
            onClick={addOption}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            + Add
          </button>
        </div>
        {field.options.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500">No options yet. Add one above.</p>
        )}
        <div className="space-y-2">
          {field.options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type="text"
                value={opt.label}
                onChange={(e) => updateOption(opt.id, e.target.value)}
                placeholder="Option label"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeOption(opt.id)}
                className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                aria-label="Remove option"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
