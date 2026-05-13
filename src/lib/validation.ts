import type { FormField } from '@/types/fields';

export function validateField(field: FormField, value: unknown): string | null {
  // section headers and calculations don't have user input
  if (field.type === 'section-header' || field.type === 'calculation') return null;

  const required = field.required;

  switch (field.type) {
    case 'single-line-text':
    case 'multi-line-text': {
      const text = typeof value === 'string' ? value.trim() : '';
      if (required && !text) return 'This field is required';
      if (!text) return null;
      if (field.minLength !== null && text.length < field.minLength)
        return `Must be at least ${field.minLength} characters`;
      if (field.maxLength !== null && text.length > field.maxLength)
        return `Must be at most ${field.maxLength} characters`;
      return null;
    }

    case 'number': {
      if (value === '' || value === null || value === undefined) {
        return required ? 'This field is required' : null;
      }
      const num = Number(value);
      if (Number.isNaN(num)) return 'Please enter a valid number';
      if (field.minValue !== null && num < field.minValue)
        return `Must be at least ${field.minValue}`;
      if (field.maxValue !== null && num > field.maxValue)
        return `Must be at most ${field.maxValue}`;
      return null;
    }

    case 'date': {
      const date = typeof value === 'string' ? value : '';
      if (required && !date) return 'This field is required';
      if (!date) return null;
      if (field.minDate && date < field.minDate) return `Date must be on or after ${field.minDate}`;
      if (field.maxDate && date > field.maxDate)
        return `Date must be on or before ${field.maxDate}`;
      return null;
    }

    case 'single-select': {
      const selected = typeof value === 'string' ? value : '';
      if (required && !selected) return 'Please select an option';
      return null;
    }

    case 'multi-select': {
      const selected = Array.isArray(value) ? value : [];
      if (required && selected.length === 0) return 'Please select at least one option';
      if (field.minSelections !== null && selected.length < field.minSelections)
        return `Select at least ${field.minSelections}`;
      if (field.maxSelections !== null && selected.length > field.maxSelections)
        return `Select at most ${field.maxSelections}`;
      return null;
    }

    case 'file-upload': {
      const files = Array.isArray(value) ? value : [];
      if (required && files.length === 0) return 'Please upload a file';
      if (field.maxFiles !== null && files.length > field.maxFiles)
        return `Maximum ${field.maxFiles} file(s) allowed`;
      return null;
    }
  }
}
