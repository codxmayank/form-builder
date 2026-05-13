import type { SingleLineTextField, MultiLineTextField } from '@/types/fields';

type TextField = SingleLineTextField | MultiLineTextField;

export default function TextRenderer({
  field,
  value = '',
  error,
  onChange
}: {
  field: TextField;
  value?: string;
  error?: string;
  onChange: (val: string) => void;
}) {
  const charCount = value.length;
  const showCount = field.maxLength !== null || field.minLength !== null;

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

      <div className="mt-1">
        {field.type === 'multi-line-text' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `err-${field.id}` : undefined}
          />
        ) : (
          <div className="flex items-center gap-1">
            {field.prefix && <span className="text-sm text-gray-500">{field.prefix}</span>}
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              className={inputClasses}
              aria-invalid={!!error}
              aria-describedby={error ? `err-${field.id}` : undefined}
            />
            {field.suffix && <span className="text-sm text-gray-500">{field.suffix}</span>}
          </div>
        )}
      </div>

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
            {charCount}
            {field.maxLength !== null ? ` / ${field.maxLength}` : ''}
          </p>
        )}
      </div>
    </div>
  );
}
