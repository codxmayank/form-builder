import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useBuilderStore } from '@/stores/builder-store';
import { useTemplateStore } from '@/stores/template-store';
import { getTemplates } from '@/lib/storage';
import BuilderLayout from '@/features/builder/BuilderLayout';

export default function BuilderPage() {
  const { templateId } = useParams();
  const initTemplate = useBuilderStore((s) => s.initTemplate);
  const reset = useBuilderStore((s) => s.reset);
  const loadTemplates = useTemplateStore((s) => s.loadTemplates);

  useEffect(() => loadTemplates(), [loadTemplates]);

  useEffect(() => {
    if (templateId) {
      const found = getTemplates().find((t) => t.id === templateId);
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
  }, [templateId, initTemplate, reset]);

  return <BuilderLayout />;
}
