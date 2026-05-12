import type { FileMetadata, FormField, UniqueId } from './fields';

export interface FormTemplate {
  id: UniqueId;
  title: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export type FieldValue = string | number | string[] | FileMetadata[] | null;

export interface FormInstance {
  id: UniqueId;
  templateId: UniqueId;
  values: Record<UniqueId, FieldValue>;
  submittedAt: string;
}
