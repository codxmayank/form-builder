import { useParams } from 'react-router';

export default function BuilderPage() {
  const { templateId } = useParams();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">{templateId ? 'Edit Template' : 'New Template'}</h1>
    </main>
  );
}
