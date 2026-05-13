import type { FileUploadField, FileMetadata } from '@/types/fields';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUploadRenderer({
  field,
  value = [],
  error,
  onChange
}: {
  field: FileUploadField;
  value?: FileMetadata[];
  error?: string;
  onChange: (val: FileMetadata[]) => void;
}) {
  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: FileMetadata[] = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type
    }));

    onChange([...value, ...newFiles]);
    e.target.value = ''; // reset so same file can be re-added
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  const accept = field.allowedFileTypes.length > 0 ? field.allowedFileTypes.join(',') : undefined;
  const atLimit = field.maxFiles !== null && value.length >= field.maxFiles;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
        {field.label || 'Untitled'}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="mt-1">
        <input
          type="file"
          accept={accept}
          multiple={field.maxFiles !== 1}
          onChange={handleFiles}
          disabled={atLimit}
          className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50 dark:text-gray-400 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
          aria-invalid={!!error}
          aria-describedby={error ? `err-${field.id}` : undefined}
        />
      </div>

      {value.length > 0 && (
        <ul className="mt-2 space-y-1">
          {value.map((file, i) => (
            <li
              key={file.id}
              className="flex items-center justify-between rounded bg-gray-50 px-3 py-1.5 text-sm dark:bg-gray-900"
            >
              <span className="truncate text-gray-700 dark:text-gray-300">{file.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  aria-label={`Remove ${file.name}`}
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
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p id={`err-${field.id}`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
