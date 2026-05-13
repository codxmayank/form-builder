import type { DateField } from '@/types/fields';

export default function DateRenderer({
  field,
  value = '',
  error,
  onChange
}: {
  field: DateField;
  value?: string;
  error?: string;
  onChange: (val: string) => void;
}) {
  const inputClasses = `w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none dark:bg-gray-900 dark:text-white ${
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
  }`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
        {field.label || 'Untitled'}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={field.minDate ?? undefined}
        max={field.maxDate ?? undefined}
        className={`mt-1 ${inputClasses}`}
        aria-invalid={!!error}
        aria-describedby={error ? `err-${field.id}` : undefined}
      />

      {error && (
        <p id={`err-${field.id}`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
