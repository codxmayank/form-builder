import type { SingleSelectField } from '@/types/fields';

export default function SingleSelectRenderer({
  field,
  value = '',
  error,
  onChange
}: {
  field: SingleSelectField;
  value?: string;
  error?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900">
        {field.label || 'Untitled'}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="mt-1">
        {field.displayType === 'dropdown' && (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            aria-invalid={!!error}
            aria-describedby={error ? `err-${field.id}` : undefined}
          >
            <option value="">Select an option</option>
            {field.options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label || 'Untitled option'}
              </option>
            ))}
          </select>
        )}

        {field.displayType === 'radio' && (
          <div className="space-y-2" role="radiogroup" aria-label={field.label}>
            {field.options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={field.id}
                  value={opt.id}
                  checked={value === opt.id}
                  onChange={() => onChange(opt.id)}
                  className="border-gray-300 text-blue-600"
                />
                {opt.label || 'Untitled option'}
              </label>
            ))}
          </div>
        )}

        {field.displayType === 'tiles' && (
          <div className="flex flex-wrap gap-2">
            {field.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange(value === opt.id ? '' : opt.id)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  value === opt.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt.label || 'Untitled'}
              </button>
            ))}
          </div>
        )}
      </div>

      {field.options.length === 0 && (
        <p className="mt-1 text-xs text-gray-400">No options configured</p>
      )}

      {error && (
        <p id={`err-${field.id}`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
