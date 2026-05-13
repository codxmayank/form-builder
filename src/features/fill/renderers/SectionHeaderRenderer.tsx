import type { SectionHeaderField } from '@/types/fields';

const sizeClasses = {
  xl: 'text-2xl',
  lg: 'text-xl',
  md: 'text-lg',
  sm: 'text-base',
  xs: 'text-sm'
} as const;

export default function SectionHeaderRenderer({ field }: { field: SectionHeaderField }) {
  return (
    <div className="py-1">
      <h3 className={`font-semibold text-gray-900 dark:text-white ${sizeClasses[field.size]}`}>
        {field.label || 'Untitled Section'}
      </h3>
    </div>
  );
}
