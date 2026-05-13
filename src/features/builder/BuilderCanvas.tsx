import { useBuilderStore } from '@/stores/builder-store';
import { CanvasField } from './components/CanvasField';

export default function BuilderCanvas() {
  const fields = useBuilderStore((s) => s.template?.fields ?? []);
  const selectedFieldId = useBuilderStore((s) => s.selectedFieldId);
  const selectField = useBuilderStore((s) => s.selectField);
  const removeField = useBuilderStore((s) => s.removeField);
  const duplicateField = useBuilderStore((s) => s.duplicateField);

  if (fields.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-400">No fields yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Click a field type from the palette to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {fields.map((field) => (
        <CanvasField
          key={field.id}
          field={field}
          isSelected={field.id === selectedFieldId}
          onSelect={() => selectField(field.id)}
          onRemove={() => removeField(field.id)}
          onDuplicate={() => duplicateField(field.id)}
        />
      ))}
    </div>
  );
}
