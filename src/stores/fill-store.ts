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
    set({
      template,
      values: initialValues ?? {},
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
