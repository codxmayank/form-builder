import type { MultiSelectField } from '@/types/fields';

export default function MultiSelectRenderer({
  field,
  value = [],
  error,
  onChange
}: {
  field: MultiSelectField;
  value?: string[];
  error?: string;
  onChange: (val: string[]) => void;
}) {
  function toggle(optId: string) {
    if (value.includes(optId)) {
      onChange(value.filter((v) => v !== optId));
    } else {
      onChange([...value, optId]);
    }
  }

  const showCount = field.minSelections !== null || field.maxSelections !== null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
        {field.label || 'Untitled'}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="mt-1 space-y-2">
        {field.options.map((opt) => (
          <label key={opt.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={value.includes(opt.id)}
              onChange={() => toggle(opt.id)}
              className="rounded border-gray-300 text-blue-600"
            />
            {opt.label || 'Untitled option'}
          </label>
        ))}
      </div>

      {field.options.length === 0 && (
        <p className="mt-1 text-xs text-gray-400">No options configured</p>
      )}

      <div className="mt-1 flex justify-between">
        {error ? (
          <p id={`err-${field.id}`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : (
          <span />
        )}
        {showCount && (
          <p className="text-xs text-gray-400">
            {value.length} selected
            {field.maxSelections !== null ? ` / ${field.maxSelections} max` : ''}
          </p>
        )}
      </div>
    </div>
  );
}
