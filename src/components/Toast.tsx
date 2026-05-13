import { useEffect } from 'react';

export default function Toast({
  message,
  variant = 'error',
  onClose
}: {
  message: string;
  variant?: 'error' | 'success';
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = variant === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg ${bg} animate-toast-up px-5 py-3 text-sm font-medium text-white shadow-lg`}
    >
      {message}
    </div>
  );
}
