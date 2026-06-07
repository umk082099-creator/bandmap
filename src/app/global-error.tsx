'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#0f0f0f] text-[#e5e5e5] antialiased">
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <p className="text-4xl mb-4">💥</p>
          <h1 className="text-xl font-bold mb-2">BandMap 遇到了错误</h1>
          <p className="text-sm text-[#a1a1aa] mb-6 max-w-md">
            {error.message || '发生了意外错误。'}
          </p>
          <button
            onClick={reset}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
