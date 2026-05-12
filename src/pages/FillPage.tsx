import { useParams } from 'react-router';

export default function FillPage() {
  const { templateId, instanceId } = useParams();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Fill Form</h1>
      <p className="mt-2 text-gray-500">
        Template: {templateId}
        {instanceId ? ` — Instance: ${instanceId}` : ''}
      </p>
    </main>
  );
}
