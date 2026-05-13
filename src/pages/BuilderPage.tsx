import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useBuilderStore } from '@/stores/builder-store';
import { getTemplates } from '@/lib/storage';
import BuilderLayout from '@/features/builder/BuilderLayout';

export default function BuilderPage() {
  const { templateId } = useParams();
  const initTemplate = useBuilderStore((s) => s.initTemplate);
  const reset = useBuilderStore((s) => s.reset);

  useEffect(() => {
    if (templateId) {
      const template = getTemplates().find((t) => t.id === templateId);
      if (template) {
        initTemplate(template);
      }
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
