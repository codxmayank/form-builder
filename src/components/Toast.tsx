import { useEffect } from 'react';

export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-[slideUp_0.3s_ease-out] rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}
