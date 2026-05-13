import type { NumberField } from '@/types/fields';

export default function NumberConfig({
  field,
  onChange
}: {
  field: NumberField;
  onChange: (updates: Partial<NumberField>) => void;
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="cfg-min"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Min value
          </label>
          <input
            id="cfg-min"
            type="number"
            value={field.minValue ?? ''}
            onChange={(e) => onChange({ minValue: e.target.value ? Number(e.target.value) : null })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="cfg-max"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Max value
          </label>
          <input
            id="cfg-max"
            type="number"
            value={field.maxValue ?? ''}
            onChange={(e) => onChange({ maxValue: e.target.value ? Number(e.target.value) : null })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="cfg-decimals"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Decimal places
        </label>
        <select
          id="cfg-decimals"
          value={field.decimalPlaces}
          onChange={(e) =>
            onChange({ decimalPlaces: Number(e.target.value) as NumberField['decimalPlaces'] })
          }
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        >
          {[0, 1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="cfg-prefix"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Prefix
          </label>
          <input
            id="cfg-prefix"
            type="text"
            value={field.prefix}
            onChange={(e) => onChange({ prefix: e.target.value })}
            placeholder="e.g. $"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="cfg-suffix"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Suffix
          </label>
          <input
            id="cfg-suffix"
            type="text"
            value={field.suffix}
            onChange={(e) => onChange({ suffix: e.target.value })}
            placeholder="e.g. kg"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}
