import { useBuilderStore } from '@/stores/builder-store';
import type { FormField } from '@/types/fields';
import TextConfig from './configs/TextConfig';

const TYPE_LABELS: Record<FormField['type'], string> = {
  'single-line-text': 'Short Text',
  'multi-line-text': 'Long Text',
  number: 'Number',
  date: 'Date',
  'single-select': 'Single Select',
  'multi-select': 'Multi Select',
  'file-upload': 'File Upload',
  'section-header': 'Section',
  calculation: 'Calculation'
};

export default function ConfigPanel() {
  const field = useBuilderStore((s) => {
    if (!s.selectedFieldId) return null;
    return s.template?.fields.find((f) => f.id === s.selectedFieldId) ?? null;
  });
  const updateField = useBuilderStore((s) => s.updateField);

  if (!field) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-gray-400">Select a field to configure</p>
      </div>
    );
  }

  function update(updates: Partial<FormField>) {
    updateField(field!.id, updates);
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {TYPE_LABELS[field.type]}
      </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="field-label" className="block text-sm font-medium text-gray-700">
            Label
          </label>
          <input
            id="field-label"
            type="text"
            value={field.label}
            onChange={(e) => update({ label: e.target.value })}
            placeholder="Enter field label"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <hr className="border-gray-200" />

        {renderConfig(field, update)}
      </div>
    </div>
  );
}

function renderConfig(field: FormField, onChange: (updates: Partial<FormField>) => void) {
  switch (field.type) {
    case 'single-line-text':
    case 'multi-line-text':
      return <TextConfig field={field} onChange={onChange} />;
    default:
      return <p className="text-xs text-gray-400">Configuration coming soon</p>;
  }
}
