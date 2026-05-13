import { useThemeStore } from '@/stores/theme-store';

const options = [
  { value: 'light' as const, label: '☀️' },
  { value: 'dark' as const, label: '🌙' },
  { value: 'system' as const, label: '💻' }
];

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div
      className="flex rounded-lg border border-gray-300 dark:border-gray-600"
      role="radiogroup"
      aria-label="Theme"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={theme === opt.value}
          aria-label={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`px-2 py-1 text-sm transition-colors first:rounded-l-md last:rounded-r-md ${
            theme === opt.value
              ? 'bg-gray-200 dark:bg-gray-700'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
