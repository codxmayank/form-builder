import type { DateField } from '@/types/fields';

export default function DateConfig({
  field,
  onChange
}: {
  field: DateField;
  onChange: (updates: Partial<DateField>) => void;
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

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={field.prefillToday}
          onChange={(e) => onChange({ prefillToday: e.target.checked })}
          className="rounded border-gray-300"
        />
        Pre-fill with today&apos;s date
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cfg-mindate" className="block text-sm font-medium text-gray-700">
            Earliest date
          </label>
          <input
            id="cfg-mindate"
            type="date"
            value={field.minDate ?? ''}
            onChange={(e) => onChange({ minDate: e.target.value || null })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cfg-maxdate" className="block text-sm font-medium text-gray-700">
            Latest date
          </label>
          <input
            id="cfg-maxdate"
            type="date"
            value={field.maxDate ?? ''}
            onChange={(e) => onChange({ maxDate: e.target.value || null })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
