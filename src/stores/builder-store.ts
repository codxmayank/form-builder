import { create } from 'zustand';
import type { FormField, FieldType } from '@/types/fields';
import type { FormTemplate } from '@/types/template';

interface BuilderStore {
  template: FormTemplate | null;
  selectedFieldId: string | null;
  isDirty: boolean;

  initTemplate: (template: FormTemplate) => void;
  setTitle: (title: string) => void;
  addField: (type: FieldType) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  selectField: (id: string | null) => void;
  markClean: () => void;
  reset: () => void;
}

function generateId(): string {
  return crypto.randomUUID();
}

function createDefaultField(type: FieldType): FormField {
  const base = {
    id: generateId(),
    label: '',
    conditions: [],
    defaultVisibility: 'visible' as const,
    defaultRequired: false
  };

  switch (type) {
    case 'single-line-text':
      return {
        ...base,
        type,
        placeholder: '',
        required: false,
        minLength: null,
        maxLength: null,
        prefix: '',
        suffix: ''
      };
    case 'multi-line-text':
      return {
        ...base,
        type,
        placeholder: '',
        required: false,
        minLength: null,
        maxLength: null,
        rows: 3
      };
    case 'number':
      return {
        ...base,
        type,
        required: false,
        minValue: null,
        maxValue: null,
        decimalPlaces: 0,
        prefix: '',
        suffix: ''
      };
    case 'date':
      return {
        ...base,
        type,
        required: false,
        prefillToday: false,
        minDate: null,
        maxDate: null
      };
    case 'single-select':
      return {
        ...base,
        type,
        required: false,
        options: [],
        displayType: 'dropdown'
      };
    case 'multi-select':
      return {
        ...base,
        type,
        required: false,
        options: [],
        minSelections: null,
        maxSelections: null
      };
    case 'file-upload':
      return {
        ...base,
        type,
        required: false,
        allowedFileTypes: [],
        maxFiles: null
      };
    case 'section-header':
      return { ...base, type, size: 'md' };
    case 'calculation':
      return {
        ...base,
        type,
        sourceFieldIds: [],
        aggregationType: 'sum',
        decimalPlaces: 0
      };
  }
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  template: null,
  selectedFieldId: null,
  isDirty: false,

  initTemplate: (template) => {
    set({ template, selectedFieldId: null, isDirty: false });
  },

  setTitle: (title) => {
    const { template } = get();
    if (!template) return;
    set({ template: { ...template, title }, isDirty: true });
  },

  addField: (type) => {
    const { template } = get();
    if (!template) return;
    const field = createDefaultField(type);
    set({
      template: { ...template, fields: [...template.fields, field] },
      selectedFieldId: field.id,
      isDirty: true
    });
  },

  removeField: (id) => {
    const { template, selectedFieldId } = get();
    if (!template) return;
    set({
      template: { ...template, fields: template.fields.filter((f) => f.id !== id) },
      selectedFieldId: selectedFieldId === id ? null : selectedFieldId,
      isDirty: true
    });
  },

  duplicateField: (id) => {
    const { template } = get();
    if (!template) return;
    const field = template.fields.find((f) => f.id === id);
    if (!field) return;
    const newField = { ...field, id: generateId(), label: `${field.label} (copy)` };
    const index = template.fields.indexOf(field);
    const fields = [...template.fields];
    fields.splice(index + 1, 0, newField);
    set({
      template: { ...template, fields },
      selectedFieldId: newField.id,
      isDirty: true
    });
  },

  updateField: (id, updates) => {
    const { template } = get();
    if (!template) return;
    set({
      template: {
        ...template,
        fields: template.fields.map((f) => (f.id === id ? ({ ...f, ...updates } as FormField) : f))
      },
      isDirty: true
    });
  },

  reorderFields: (fromIndex, toIndex) => {
    const { template } = get();
    if (!template) return;
    const fields = [...template.fields];
    const [moved] = fields.splice(fromIndex, 1);
    if (!moved) return;
    fields.splice(toIndex, 0, moved);
    set({ template: { ...template, fields }, isDirty: true });
  },

  selectField: (id) => {
    set({ selectedFieldId: id });
  },

  markClean: () => {
    set({ isDirty: false });
  },

  reset: () => {
    set({ template: null, selectedFieldId: null, isDirty: false });
  }
}));
