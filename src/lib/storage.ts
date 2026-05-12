import type { FormInstance } from '@/types/template';
import type { FormTemplate } from '@/types/template';

const TEMPLATES_KEY = 'form-builder:templates';
const INSTANCES_KEY = 'form-builder:instances';

function parse<T>(json: string | null): T | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function getTemplates(): FormTemplate[] {
  return parse<FormTemplate[]>(localStorage.getItem(TEMPLATES_KEY)) ?? [];
}

export function saveTemplates(templates: FormTemplate[]): void {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function getInstances(): FormInstance[] {
  return parse<FormInstance[]>(localStorage.getItem(INSTANCES_KEY)) ?? [];
}

export function getInstancesByTemplate(templateId: string): FormInstance[] {
  return getInstances().filter((i) => i.templateId === templateId);
}

export function saveInstances(instances: FormInstance[]): void {
  localStorage.setItem(INSTANCES_KEY, JSON.stringify(instances));
}
