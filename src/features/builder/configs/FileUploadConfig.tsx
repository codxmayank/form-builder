import type { FileUploadField } from '@/types/fields';

export default function FileUploadConfig({
  field,
  onChange
}: {
  field: FileUploadField;
  onChange: (updates: Partial<FileUploadField>) => void;
}) {
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

      <div>
        <label
          htmlFor="cfg-filetypes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Allowed file types
        </label>
        <input
          id="cfg-filetypes"
          type="text"
          value={field.allowedFileTypes.join(', ')}
          onChange={(e) =>
            onChange({
              allowedFileTypes: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            })
          }
          placeholder="e.g. .pdf, .jpg, .png"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Comma-separated. Leave empty to allow all.
        </p>
      </div>

      <div>
        <label
          htmlFor="cfg-maxfiles"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Max files
        </label>
        <input
          id="cfg-maxfiles"
          type="number"
          min={1}
          value={field.maxFiles ?? ''}
          onChange={(e) => onChange({ maxFiles: e.target.value ? Number(e.target.value) : null })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </div>
    </div>
  );
}
