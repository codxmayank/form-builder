import { useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useBuilderStore } from '@/stores/builder-store';
import { SortableField } from './components/SortableField';

export default function BuilderCanvas() {
  const fields = useBuilderStore((s) => s.template?.fields ?? []);
  const selectedFieldId = useBuilderStore((s) => s.selectedFieldId);
  const selectField = useBuilderStore((s) => s.selectField);
  const removeField = useBuilderStore((s) => s.removeField);
  const duplicateField = useBuilderStore((s) => s.duplicateField);
  const reorderFields = useBuilderStore((s) => s.reorderFields);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fieldIds = useMemo(() => fields.map((f) => f.id), [fields]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const fromIndex = fields.findIndex((f) => f.id === active.id);
      const toIndex = fields.findIndex((f) => f.id === over.id);
      if (fromIndex !== -1 && toIndex !== -1) {
        reorderFields(fromIndex, toIndex);
      }
    },
    [fields, reorderFields]
  );

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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 p-4">
          {fields.map((field) => (
            <SortableField
              key={field.id}
              field={field}
              isSelected={field.id === selectedFieldId}
              onSelect={() => selectField(field.id)}
              onRemove={() => removeField(field.id)}
              onDuplicate={() => duplicateField(field.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
