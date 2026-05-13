import TemplatesList from '@/features/templates/TemplatesList';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Your Templates</h1>
      <div className="mt-6">
        <TemplatesList />
      </div>
    </div>
  );
}
