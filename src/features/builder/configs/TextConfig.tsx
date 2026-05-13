import type { SingleLineTextField, MultiLineTextField } from '@/types/fields';

type TextField = SingleLineTextField | MultiLineTextField;

export default function TextConfig({
  field,
  onChange
}: {
  field: TextField;
  onChange: (updates: Partial<TextField>) => void;
}) {
  const isMultiLine = field.type === 'multi-line-text';

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="cfg-placeholder" className="block text-sm font-medium text-gray-700">
          Placeholder
        </label>
        <input
          id="cfg-placeholder"
          type="text"
          value={field.placeholder}
          onChange={(e) => onChange({ placeholder: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onChange({ required: e.target.checked })}
          className="rounded border-gray-300"
        />
        Required
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cfg-minlen" className="block text-sm font-medium text-gray-700">
            Min length
          </label>
          <input
            id="cfg-minlen"
            type="number"
            min={0}
            value={field.minLength ?? ''}
            onChange={(e) =>
              onChange({ minLength: e.target.value ? Number(e.target.value) : null })
            }
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cfg-maxlen" className="block text-sm font-medium text-gray-700">
            Max length
          </label>
          <input
            id="cfg-maxlen"
            type="number"
            min={0}
            value={field.maxLength ?? ''}
            onChange={(e) =>
              onChange({ maxLength: e.target.value ? Number(e.target.value) : null })
            }
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {isMultiLine ? (
        <div>
          <label htmlFor="cfg-rows" className="block text-sm font-medium text-gray-700">
            Rows
          </label>
          <input
            id="cfg-rows"
            type="number"
            min={2}
            max={20}
            value={(field as MultiLineTextField).rows}
            onChange={(e) => onChange({ rows: Number(e.target.value) } as Partial<TextField>)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="cfg-prefix" className="block text-sm font-medium text-gray-700">
              Prefix
            </label>
            <input
              id="cfg-prefix"
              type="text"
              value={(field as SingleLineTextField).prefix}
              onChange={(e) => onChange({ prefix: e.target.value } as Partial<TextField>)}
              placeholder="e.g. $"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="cfg-suffix" className="block text-sm font-medium text-gray-700">
              Suffix
            </label>
            <input
              id="cfg-suffix"
              type="text"
              value={(field as SingleLineTextField).suffix}
              onChange={(e) => onChange({ suffix: e.target.value } as Partial<TextField>)}
              placeholder="e.g. kg"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
