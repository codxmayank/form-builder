import type { FieldType } from '@/types/fields';
import { useBuilderStore } from '@/stores/builder-store';

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: 'single-line-text', label: 'Short Text', icon: 'Aa' },
  { type: 'multi-line-text', label: 'Long Text', icon: '¶' },
  { type: 'number', label: 'Number', icon: '#' },
  { type: 'date', label: 'Date', icon: '⏱' },
  { type: 'single-select', label: 'Single Select', icon: '◉' },
  { type: 'multi-select', label: 'Multi Select', icon: '☑' },
  { type: 'file-upload', label: 'File Upload', icon: '↑' },
  { type: 'section-header', label: 'Section', icon: 'H' },
  { type: 'calculation', label: 'Calculation', icon: 'Σ' }
];

export default function FieldPalette() {
  const addField = useBuilderStore((s) => s.addField);

  return (
    <div className="p-3">
      <h2 className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
        Field Types
      </h2>
      <div className="space-y-1">
        {FIELD_TYPES.map(({ type, label, icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => addField(type)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-100 text-sm font-medium text-gray-600">
              {icon}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
