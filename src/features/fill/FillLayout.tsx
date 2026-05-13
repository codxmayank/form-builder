import { useFillStore } from '@/stores/fill-store';
import { resolveFieldState } from '@/lib/conditions';
import { calculate } from '@/lib/calculations';
import { validateField } from '@/lib/validation';
import { getInstances, saveInstances } from '@/lib/storage';
import { useNavigate } from 'react-router';
import type { FormField, CalculationField } from '@/types/fields';
import type { FieldValue } from '@/types/template';
import { exportPdf } from '@/lib/pdf-export';
import TextRenderer from '@/features/fill/renderers/TextRenderer';
import NumberRenderer from '@/features/fill/renderers/NumberRenderer';
import DateRenderer from '@/features/fill/renderers/DateRenderer';
import SingleSelectRenderer from '@/features/fill/renderers/SingleSelectRenderer';
import MultiSelectRenderer from '@/features/fill/renderers/MultiSelectRenderer';
import FileUploadRenderer from '@/features/fill/renderers/FileUploadRenderer';
import SectionHeaderRenderer from '@/features/fill/renderers/SectionHeaderRenderer';
import CalculationRenderer from '@/features/fill/renderers/CalculationRenderer';

export default function FillLayout() {
  const template = useFillStore((s) => s.template);
  const values = useFillStore((s) => s.values);
  const errors = useFillStore((s) => s.errors);
  const setValue = useFillStore((s) => s.setValue);
  const setErrors = useFillStore((s) => s.setErrors);
  const navigate = useNavigate();

  if (!template) return null;

  function submit() {
    if (!template) return;

    // Validate all visible fields
    const newErrors: Record<string, string> = {};
    for (const field of template.fields) {
      if (field.type === 'section-header' || field.type === 'calculation') continue;

      const { visible, required } = resolveFieldState(field, values);
      if (!visible) continue;

      // Override field required with condition-resolved required
      const fieldWithRequired = { ...field, required } as FormField;
      const error = validateField(fieldWithRequired, values[field.id] ?? null);
      if (error) newErrors[field.id] = error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorId = Object.keys(newErrors)[0];
      document
        .getElementById(`field-${firstErrorId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Save instance
    const instance = {
      id: crypto.randomUUID(),
      templateId: template.id,
      values: { ...values },
      submittedAt: new Date().toISOString()
    };

    const existing = getInstances();
    saveInstances([...existing, instance]);
    navigate(`/instances/${template.id}`);
  }

  function getCalculationValue(field: CalculationField): number | null {
    const sourceValues = field.sourceFieldIds.map((id) => values[id] ?? null);
    return calculate(sourceValues, field.aggregationType, field.decimalPlaces);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">{template.title || 'Untitled Form'}</h1>

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        noValidate
      >
        {template.fields.map((field) => {
          const { visible } = resolveFieldState(field, values);
          if (!visible) return null;

          return (
            <div key={field.id} id={`field-${field.id}`}>
              {renderField(
                field,
                values[field.id] ?? null,
                errors[field.id],
                (val) => setValue(field.id, val),
                getCalculationValue
              )}
            </div>
          );
        })}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => exportPdf(template, values)}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
          >
            Export PDF
          </button>
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

function renderField(
  field: FormField,
  value: FieldValue,
  error: string | undefined,
  onChange: (val: FieldValue) => void,
  getCalcValue: (field: CalculationField) => number | null
) {
  switch (field.type) {
    case 'single-line-text':
    case 'multi-line-text':
      return (
        <TextRenderer
          field={field}
          value={(value as string) ?? ''}
          {...(error != null ? { error } : {})}
          onChange={onChange}
        />
      );
    case 'number':
      return (
        <NumberRenderer
          field={field}
          value={(value as string) ?? ''}
          {...(error != null ? { error } : {})}
          onChange={onChange}
        />
      );
    case 'date':
      return (
        <DateRenderer
          field={field}
          value={(value as string) ?? ''}
          {...(error != null ? { error } : {})}
          onChange={onChange}
        />
      );
    case 'single-select':
      return (
        <SingleSelectRenderer
          field={field}
          value={(value as string) ?? ''}
          {...(error != null ? { error } : {})}
          onChange={onChange}
        />
      );
    case 'multi-select':
      return (
        <MultiSelectRenderer
          field={field}
          value={(value as string[]) ?? []}
          {...(error != null ? { error } : {})}
          onChange={onChange}
        />
      );
    case 'file-upload':
      return (
        <FileUploadRenderer
          field={field}
          value={(value as never) ?? []}
          {...(error != null ? { error } : {})}
          onChange={onChange}
        />
      );
    case 'section-header':
      return <SectionHeaderRenderer field={field} />;
    case 'calculation':
      return <CalculationRenderer field={field} value={getCalcValue(field)} />;
  }
}
