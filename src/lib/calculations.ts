import type { AggregationType } from '@/types/fields';
import type { FieldValue } from '@/types/template';

export function calculate(
  sourceValues: FieldValue[],
  aggregationType: AggregationType,
  decimalPlaces: number
): number | null {
  const nums = sourceValues.filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));

  if (nums.length === 0) return null;

  let result: number;

  switch (aggregationType) {
    case 'sum':
      result = nums.reduce((a, b) => a + b, 0);
      break;
    case 'average':
      result = nums.reduce((a, b) => a + b, 0) / nums.length;
      break;
    case 'minimum':
      result = Math.min(...nums);
      break;
    case 'maximum':
      result = Math.max(...nums);
      break;
  }

  // Avoid floating point weirdness
  const factor = 10 ** decimalPlaces;
  return Math.round(result * factor) / factor;
}
