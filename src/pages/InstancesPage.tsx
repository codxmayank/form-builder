import { useParams } from 'react-router';

export default function InstancesPage() {
  const { templateId } = useParams();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Submissions</h1>
      <p className="mt-2 text-gray-500">Template: {templateId}</p>
    </main>
  );
}
