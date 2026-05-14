import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { useBuilderStore } from '@/stores/builder-store';
import { useTemplateStore } from '@/stores/template-store';
import BuilderLayout from '@/features/builder/BuilderLayout';
import NotFoundPage from '@/pages/NotFoundPage';

export default function BuilderPage() {
  const { templateId } = useParams();
  const initTemplate = useBuilderStore((s) => s.initTemplate);
  const reset = useBuilderStore((s) => s.reset);
  const loadTemplates = useTemplateStore((s) => s.loadTemplates);
  const templates = useTemplateStore((s) => s.templates);

  useEffect(() => loadTemplates(), [loadTemplates]);

  const loaded = templates.length > 0;

  const notFound = useMemo(() => {
    if (!templateId) return false; // new template mode
    if (!loaded) return false;
    return !templates.some((t) => t.id === templateId);
  }, [templateId, loaded, templates]);

  useEffect(() => {
    if (notFound) return;

    if (templateId) {
      if (!loaded) return;
      const found = templates.find((t) => t.id === templateId);
      if (found) initTemplate(found);
    } else {
      initTemplate({
        id: crypto.randomUUID(),
        title: '',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    return () => reset();
  }, [templateId, loaded, notFound, templates, initTemplate, reset]);

  if (notFound) return <NotFoundPage />;

  return <BuilderLayout />;
}
