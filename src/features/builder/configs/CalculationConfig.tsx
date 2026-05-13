import type { CalculationField, AggregationType, FormField } from '@/types/fields';

const AGG_LABELS: Record<AggregationType, string> = {
  sum: 'Sum',
  average: 'Average',
  minimum: 'Minimum',
  maximum: 'Maximum'
};

export default function CalculationConfig({
  field,
  allFields,
  onChange
}: {
  field: CalculationField;
  allFields: FormField[];
  onChange: (updates: Partial<CalculationField>) => void;
}) {
  // Only number fields can be sources
  const numberFields = allFields.filter((f) => f.type === 'number' && f.id !== field.id);

  function toggleSource(fieldId: string) {
    const current = field.sourceFieldIds;
    if (current.includes(fieldId)) {
      onChange({ sourceFieldIds: current.filter((id) => id !== fieldId) });
    } else {
      onChange({ sourceFieldIds: [...current, fieldId] });
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Aggregation</label>
        <select
          value={field.aggregationType}
          onChange={(e) => onChange({ aggregationType: e.target.value as AggregationType })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          {Object.entries(AGG_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Source fields</label>
        {numberFields.length === 0 ? (
          <p className="mt-1 text-xs text-gray-400">Add number fields to the form first.</p>
        ) : (
          <div className="mt-2 space-y-1.5">
            {numberFields.map((f) => (
              <label key={f.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.sourceFieldIds.includes(f.id)}
                  onChange={() => toggleSource(f.id)}
                  className="rounded border-gray-300"
                />
                {f.label || `Untitled number`}
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="cfg-decimals" className="block text-sm font-medium text-gray-700">
          Decimal places
        </label>
        <select
          id="cfg-decimals"
          value={field.decimalPlaces}
          onChange={(e) => onChange({ decimalPlaces: Number(e.target.value) as 0 | 1 | 2 | 3 | 4 })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          {[0, 1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
