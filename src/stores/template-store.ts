import { create } from 'zustand';
import type { FormTemplate } from '@/types/template';
import { getTemplates, saveTemplates } from '@/lib/storage';

interface TemplateStore {
  templates: FormTemplate[];
  loadTemplates: () => void;
  addTemplate: (template: FormTemplate) => void;
  updateTemplate: (template: FormTemplate) => void;
  deleteTemplate: (id: string) => void;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: [],

  loadTemplates: () => {
    set({ templates: getTemplates() });
  },

  addTemplate: (template) => {
    const templates = [...get().templates, template];
    saveTemplates(templates);
    set({ templates });
  },

  updateTemplate: (template) => {
    const templates = get().templates.map((t) => (t.id === template.id ? template : t));
    saveTemplates(templates);
    set({ templates });
  },

  deleteTemplate: (id) => {
    const templates = get().templates.filter((t) => t.id !== id);
    saveTemplates(templates);
    set({ templates });
  }
}));
