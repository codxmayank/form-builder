import type { CalculationField } from '@/types/fields';

const AGG_LABELS = {
  sum: 'Sum',
  average: 'Average',
  minimum: 'Min',
  maximum: 'Max'
} as const;

export default function CalculationRenderer({
  field,
  value
}: {
  field: CalculationField;
  value?: number | null;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900">
        {field.label || 'Calculation'}
      </label>
      <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-gray-900 tabular-nums">
            {value != null ? value.toFixed(field.decimalPlaces) : '—'}
          </span>
          <span className="text-xs text-gray-400">({AGG_LABELS[field.aggregationType]})</span>
        </div>
      </div>
    </div>
  );
}
