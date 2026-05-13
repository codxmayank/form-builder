// TODO: replace with real fill-mode renderers once those are built
export default function PreviewOverlay({
  title,
  fields,
  onClose
}: {
  title: string;
  fields: { id: string; type: string; label: string }[];
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
          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.id} className="rounded-lg border border-gray-200 px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{f.label || 'Untitled field'}</p>
                <p className="text-xs text-gray-400">{f.type}</p>
              </div>
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
