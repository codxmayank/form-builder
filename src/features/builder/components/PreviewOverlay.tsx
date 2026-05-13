import type { FormField } from '@/types/fields';
import TextRenderer from '@/features/fill/renderers/TextRenderer';
import NumberRenderer from '@/features/fill/renderers/NumberRenderer';
import DateRenderer from '@/features/fill/renderers/DateRenderer';
import SingleSelectRenderer from '@/features/fill/renderers/SingleSelectRenderer';
import MultiSelectRenderer from '@/features/fill/renderers/MultiSelectRenderer';
import FileUploadRenderer from '@/features/fill/renderers/FileUploadRenderer';
import SectionHeaderRenderer from '@/features/fill/renderers/SectionHeaderRenderer';

export default function PreviewOverlay({
  title,
  fields,
  onClose
}: {
  title: string;
  fields: FormField[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title || 'Untitled Form'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close preview"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-gray-400">No fields to preview.</p>
        ) : (
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.id}>{renderPreviewField(f)}</div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function renderPreviewField(field: FormField) {
  switch (field.type) {
    case 'single-line-text':
    case 'multi-line-text':
      return <TextRenderer field={field} onChange={() => {}} />;
    case 'number':
      return <NumberRenderer field={field} onChange={() => {}} />;
    case 'date':
      return <DateRenderer field={field} onChange={() => {}} />;
    case 'single-select':
      return <SingleSelectRenderer field={field} onChange={() => {}} />;
    case 'multi-select':
      return <MultiSelectRenderer field={field} onChange={() => {}} />;
    case 'file-upload':
      return <FileUploadRenderer field={field} onChange={() => {}} />;
    case 'section-header':
      return <SectionHeaderRenderer field={field} />;
    default:
      return (
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <p className="text-sm font-medium text-gray-900">{field.label || 'Untitled field'}</p>
          <p className="text-xs text-gray-400">{field.type}</p>
        </div>
      );
  }
}
