import { useParams, Navigate } from 'react-router';
import { useEffect, useMemo, useRef } from 'react';
import { useTemplateStore } from '@/stores/template-store';
import { useFillStore } from '@/stores/fill-store';
import { getInstancesByTemplate } from '@/lib/storage';
import FillLayout from '@/features/fill/FillLayout';

export default function FillPage() {
  const { templateId, instanceId } = useParams();
  const loadTemplates = useTemplateStore((s) => s.loadTemplates);
  const templates = useTemplateStore((s) => s.templates);
  const initForm = useFillStore((s) => s.initForm);
  const reset = useFillStore((s) => s.reset);
  const ready = useFillStore((s) => s.template !== null);
  const initRef = useRef(false);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const loaded = templates.length > 0;

  const notFound = useMemo(() => {
    if (!loaded) return false;
    if (!templateId) return true;
    return !templates.some((t) => t.id === templateId);
  }, [loaded, templateId, templates]);

  useEffect(() => {
    if (!loaded || notFound || initRef.current) return;
    if (!templateId) return;

    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    // If reopening a submitted instance, load its values
    let initialValues: Record<string, import('@/types/template').FieldValue> | undefined;
    if (instanceId) {
      const instances = getInstancesByTemplate(templateId);
      const instance = instances.find((i) => i.id === instanceId);
      if (instance) initialValues = instance.values;
    }

    initForm(template, initialValues);
    initRef.current = true;

    return () => {
      initRef.current = false;
      reset();
    };
  }, [loaded, notFound, templates, templateId, instanceId, initForm, reset]);

  if (notFound) return <Navigate to="/" replace />;

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100" />
      </div>
    );
  }

  return <FillLayout />;
}
