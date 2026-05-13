import { memo, type HTMLAttributes } from 'react';
import type { FormField } from '@/types/fields';

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

interface Props {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
}

export const CanvasField = memo(function CanvasField({
  field,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  dragHandleProps
}: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative cursor-pointer rounded-lg border-2 p-4 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
            aria-label="Drag to reorder"
            {...dragHandleProps}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </button>
          <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {TYPE_LABELS[field.type]}
          </span>
          <span className="truncate text-sm text-gray-900">{field.label || 'Untitled field'}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Duplicate field"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
            aria-label="Remove field"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});
