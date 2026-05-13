import type { SectionHeaderField, SectionHeaderSize } from '@/types/fields';

export default function SectionHeaderConfig({
  field,
  onChange
}: {
  field: SectionHeaderField;
  onChange: (updates: Partial<SectionHeaderField>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="cfg-size" className="block text-sm font-medium text-gray-700">
          Heading size
        </label>
        <select
          id="cfg-size"
          value={field.size}
          onChange={(e) => onChange({ size: e.target.value as SectionHeaderSize })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          <option value="xl">Extra Large</option>
          <option value="lg">Large</option>
          <option value="md">Medium</option>
          <option value="sm">Small</option>
          <option value="xs">Extra Small</option>
        </select>
      </div>
      <p className="text-xs text-gray-400">
        Section headers are display-only — they don&apos;t collect any data.
      </p>
    </div>
  );
}
