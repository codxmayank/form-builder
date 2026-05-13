import type { Condition, ConditionEffect, ConditionOperator, FormField } from '@/types/fields';
import { getOperatorsForFieldType, getOperatorLabel } from '@/lib/conditions';

const EFFECT_LABELS: Record<ConditionEffect, string> = {
  show: 'Show this field',
  hide: 'Hide this field',
  'mark-required': 'Make required',
  'mark-not-required': 'Make optional'
};

export default function ConditionEditor({
  conditions,
  allFields,
  currentFieldId,
  onChange
}: {
  conditions: Condition[];
  allFields: FormField[];
  currentFieldId: string;
  onChange: (conditions: Condition[]) => void;
}) {
  // Only fields that can be targeted (not self, not section-header/calculation)
  const targetableFields = allFields.filter(
    (f) => f.id !== currentFieldId && f.type !== 'section-header' && f.type !== 'calculation'
  );

  function addCondition() {
    if (targetableFields.length === 0) return;

    const target = targetableFields[0] as (typeof targetableFields)[number] | undefined;
    if (!target) return;
    const operators = getOperatorsForFieldType(target.type);

    const newCondition: Condition = {
      id: crypto.randomUUID(),
      targetFieldId: target.id,
      operator: operators[0] ?? 'equals',
      value: '',
      effect: 'show'
    };
    onChange([...conditions, newCondition]);
  }

  function updateCondition(id: string, patch: Partial<Condition>) {
    onChange(conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCondition(id: string) {
    onChange(conditions.filter((c) => c.id !== id));
  }

  function handleTargetChange(conditionId: string, newTargetId: string) {
    const targetField = allFields.find((f) => f.id === newTargetId);
    if (!targetField) return;

    const operators = getOperatorsForFieldType(targetField.type);
    updateCondition(conditionId, {
      targetFieldId: newTargetId,
      operator: operators[0] ?? 'equals',
      value: ''
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Conditions</h3>
        <button
          type="button"
          onClick={addCondition}
          disabled={targetableFields.length === 0}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300"
        >
          + Add
        </button>
      </div>

      {conditions.length === 0 && (
        <p className="text-xs text-gray-400">
          No conditions — field always follows default visibility.
        </p>
      )}

      {conditions.map((condition) => {
        const targetField = allFields.find((f) => f.id === condition.targetFieldId);
        const operators = targetField ? getOperatorsForFieldType(targetField.type) : [];

        return (
          <div
            key={condition.id}
            className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            {/* Effect */}
            <select
              value={condition.effect}
              onChange={(e) =>
                updateCondition(condition.id, { effect: e.target.value as ConditionEffect })
              }
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {Object.entries(EFFECT_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>

            {/* When target field... */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>when</span>
            </div>

            <select
              value={condition.targetFieldId}
              onChange={(e) => handleTargetChange(condition.id, e.target.value)}
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {targetableFields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label || `Untitled (${f.type})`}
                </option>
              ))}
            </select>

            {/* Operator */}
            <select
              value={condition.operator}
              onChange={(e) =>
                updateCondition(condition.id, {
                  operator: e.target.value as ConditionOperator,
                  value: ''
                })
              }
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {operators.map((op) => (
                <option key={op} value={op}>
                  {getOperatorLabel(op)}
                </option>
              ))}
            </select>

            {/* Value input — varies by target type and operator */}
            <ConditionValueInput
              condition={condition}
              targetField={targetField}
              onValueChange={(val) => updateCondition(condition.id, { value: val })}
            />

            <button
              type="button"
              onClick={() => removeCondition(condition.id)}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ConditionValueInput({
  condition,
  targetField,
  onValueChange
}: {
  condition: Condition;
  targetField: FormField | undefined;
  onValueChange: (val: string | number | string[]) => void;
}) {
  if (!targetField) return null;

  // Single/multi select: show checkboxes or dropdown of options
  if (targetField.type === 'single-select') {
    return (
      <select
        value={String(condition.value)}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Select a value</option>
        {targetField.options.map((opt) => (
          <option key={opt.id} value={opt.label}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (targetField.type === 'multi-select') {
    const selected = Array.isArray(condition.value) ? condition.value : [];
    return (
      <div className="space-y-1">
        {targetField.options.map((opt) => (
          <label key={opt.id} className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={selected.includes(opt.label)}
              onChange={(e) => {
                if (e.target.checked) {
                  onValueChange([...selected, opt.label]);
                } else {
                  onValueChange(selected.filter((s) => s !== opt.label));
                }
              }}
              className="rounded border-gray-300"
            />
            {opt.label}
          </label>
        ))}
        {targetField.options.length === 0 && (
          <p className="text-xs text-gray-400">No options defined yet</p>
        )}
      </div>
    );
  }

  if (condition.operator === 'is-within-range') {
    const [min = '', max = ''] = String(condition.value).split(',');
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={min}
          onChange={(e) => onValueChange(`${e.target.value},${max}`)}
          placeholder="Min"
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <span className="text-xs text-gray-400">to</span>
        <input
          type="number"
          value={max}
          onChange={(e) => onValueChange(`${min},${e.target.value}`)}
          placeholder="Max"
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    );
  }

  // Date fields
  if (targetField.type === 'date') {
    return (
      <input
        type="date"
        value={String(condition.value)}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    );
  }

  // Number fields (non-range)
  if (targetField.type === 'number') {
    return (
      <input
        type="number"
        value={String(condition.value)}
        onChange={(e) => onValueChange(e.target.value ? Number(e.target.value) : '')}
        placeholder="Value"
        className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    );
  }

  // Fallback: text input
  return (
    <input
      type="text"
      value={String(condition.value)}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder="Value"
      className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
    />
  );
}
