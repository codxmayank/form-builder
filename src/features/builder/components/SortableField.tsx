import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FormField } from '@/types/fields';
import { CanvasField } from './CanvasField';

interface Props {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export function SortableField({ field, isSelected, onSelect, onRemove, onDuplicate }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CanvasField
        field={field}
        isSelected={isSelected}
        onSelect={onSelect}
        onRemove={onRemove}
        onDuplicate={onDuplicate}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
