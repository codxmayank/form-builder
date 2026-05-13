import { create } from 'zustand';
import type { FormTemplate } from '@/types/template';
import type { FieldValue } from '@/types/template';

interface FillStore {
  template: FormTemplate | null;
  values: Record<string, FieldValue>;
  errors: Record<string, string>;

  initForm: (template: FormTemplate, initialValues?: Record<string, FieldValue>) => void;
  setValue: (fieldId: string, value: FieldValue) => void;
  setError: (fieldId: string, error: string) => void;
  clearError: (fieldId: string) => void;
  setErrors: (errors: Record<string, string>) => void;
  reset: () => void;
}

export const useFillStore = create<FillStore>((set, get) => ({
  template: null,
  values: {},
  errors: {},

  initForm: (template, initialValues) => {
    // Build default values (e.g. prefill today for date fields)
    const defaults: Record<string, import('@/types/template').FieldValue> = {};
    for (const field of template.fields) {
      if (field.type === 'date' && field.prefillToday) {
        defaults[field.id] = new Date().toISOString().slice(0, 10);
      }
    }
    set({
      template,
      values: { ...defaults, ...(initialValues ?? {}) },
      errors: {}
    });
  },

  setValue: (fieldId, value) => {
    const { values, errors } = get();
    const newErrors = { ...errors };
    delete newErrors[fieldId];
    set({ values: { ...values, [fieldId]: value }, errors: newErrors });
  },

  setError: (fieldId, error) => {
    set({ errors: { ...get().errors, [fieldId]: error } });
  },

  clearError: (fieldId) => {
    const errors = { ...get().errors };
    delete errors[fieldId];
    set({ errors });
  },

  setErrors: (errors) => {
    set({ errors });
  },

  reset: () => {
    set({ template: null, values: {}, errors: {} });
  }
}));
