'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <p className="text-4xl mb-4">😵</p>
      <h2 className="text-lg font-semibold text-[#e5e5e5] mb-2">页面加载出错</h2>
      <p className="text-sm text-[#a1a1aa] mb-6 max-w-md">
        {error.message || '发生了意外错误，请稍后再试。'}
      </p>
      <button
        onClick={reset}
        className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        重试
      </button>
    </div>
  );
}
