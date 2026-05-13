import type { NumberField } from '@/types/fields';

export default function NumberRenderer({
  field,
  value = '',
  error,
  onChange
}: {
  field: NumberField;
  value?: string | number;
  error?: string;
  onChange: (val: string) => void;
}) {
  const step = field.decimalPlaces > 0 ? 1 / Math.pow(10, field.decimalPlaces) : 1;

  const inputClasses = `w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900">
        {field.label || 'Untitled'}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="mt-1 flex items-center gap-1">
        {field.prefix && <span className="text-sm text-gray-500">{field.prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={step}
          min={field.minValue ?? undefined}
          max={field.maxValue ?? undefined}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `err-${field.id}` : undefined}
        />
        {field.suffix && <span className="text-sm text-gray-500">{field.suffix}</span>}
      </div>

      {error && (
        <p id={`err-${field.id}`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
