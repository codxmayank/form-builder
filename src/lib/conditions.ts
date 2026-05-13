import type { Condition, ConditionEffect, FormField } from '@/types/fields';
import type { FieldValue } from '@/types/template';

/**
 * Evaluate a single condition against a field value.
 * Returns true if the condition is "met".
 */
function evaluateCondition(condition: Condition, value: FieldValue): boolean {
  const { operator } = condition;
  const expected = condition.value;

  // Treat null/undefined as empty
  if (value == null) {
    // Only "does-not-equal" / "contains-none-of" pass on empty
    return operator === 'does-not-equal' || operator === 'contains-none-of';
  }

  switch (operator) {
    // --- text / single-select ---
    case 'equals':
      return String(value) === String(expected);
    case 'does-not-equal':
      return String(value) !== String(expected);
    case 'contains':
      return String(value).toLowerCase().includes(String(expected).toLowerCase());

    // --- number ---
    case 'is-greater-than':
      return Number(value) > Number(expected);
    case 'is-less-than':
      return Number(value) < Number(expected);
    case 'is-within-range': {
      // expected is stored as "min,max"
      const [min, max] = String(expected).split(',').map(Number);
      const n = Number(value);
      return n >= (min ?? 0) && n <= (max ?? 0);
    }

    // --- date ---
    case 'is-before':
      return String(value) < String(expected);
    case 'is-after':
      return String(value) > String(expected);

    // --- multi-select ---
    case 'contains-any-of': {
      const selected = value as string[];
      const targets = expected as string[];
      return targets.some((t) => selected.includes(t));
    }
    case 'contains-all-of': {
      const selected = value as string[];
      const targets = expected as string[];
      return targets.every((t) => selected.includes(t));
    }
    case 'contains-none-of': {
      const selected = value as string[];
      const targets = expected as string[];
      return !targets.some((t) => selected.includes(t));
    }

    default:
      return false;
  }
}

/**
 * Resolve the effective visibility + required state for a field
 * based on its conditions and the current form values.
 */
export function resolveFieldState(
  field: FormField,
  values: Record<string, FieldValue>
): { visible: boolean; required: boolean } {
  // If any condition uses "show", the field should be hidden by default
  // (only shown when the condition is met). Vice versa for "hide".
  const hasShowCondition = field.conditions.some((c) => c.effect === 'show');
  const hasHideCondition = field.conditions.some((c) => c.effect === 'hide');
  let visible = hasShowCondition
    ? false
    : hasHideCondition
      ? true
      : field.defaultVisibility === 'visible';
  let required =
    'required' in field ? (field as { required: boolean }).required : field.defaultRequired;

  for (const condition of field.conditions) {
    const targetValue = values[condition.targetFieldId] ?? null;
    const met = evaluateCondition(condition, targetValue);

    if (!met) continue;

    const effectMap: Record<ConditionEffect, () => void> = {
      show: () => {
        visible = true;
      },
      hide: () => {
        visible = false;
      },
      'mark-required': () => {
        required = true;
      },
      'mark-not-required': () => {
        required = false;
      }
    };

    effectMap[condition.effect]();
  }

  return { visible, required };
}

/**
 * Get operators that make sense for a given field type.
 */
export function getOperatorsForFieldType(type: FormField['type']) {
  switch (type) {
    case 'single-line-text':
    case 'multi-line-text':
      return ['equals', 'does-not-equal', 'contains'] as const;
    case 'number':
      return [
        'equals',
        'does-not-equal',
        'is-greater-than',
        'is-less-than',
        'is-within-range'
      ] as const;
    case 'single-select':
      return ['equals', 'does-not-equal'] as const;
    case 'multi-select':
      return ['contains-any-of', 'contains-all-of', 'contains-none-of'] as const;
    case 'date':
      return ['equals', 'is-before', 'is-after'] as const;
    default:
      return [] as const;
  }
}

const OPERATOR_LABELS: Record<string, string> = {
  equals: 'equals',
  'does-not-equal': 'does not equal',
  contains: 'contains',
  'is-greater-than': 'is greater than',
  'is-less-than': 'is less than',
  'is-within-range': 'is within range',
  'is-before': 'is before',
  'is-after': 'is after',
  'contains-any-of': 'contains any of',
  'contains-all-of': 'contains all of',
  'contains-none-of': 'contains none of'
};

export function getOperatorLabel(operator: string) {
  return OPERATOR_LABELS[operator] ?? operator;
}
