'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function NewDiscussionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-[#a1a1aa] mb-4">请先登录才能发布讨论</p>
        <Link href="/auth/login" className="text-[#8b5cf6] hover:underline">
          去登录
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('请填写标题和内容');
      return;
    }
    setLoading(true);

    const { error: err } = await supabase.from('posts').insert({
      title: title.trim(),
      content: content.trim(),
      video_url: videoUrl.trim() || null,
      image_url: imageUrl.trim() || null,
      user_id: user.id,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-6">发布讨论</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#8b5cf6] transition-colors"
            placeholder="帖子标题"
          />
        </div>
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#8b5cf6] transition-colors resize-none"
            placeholder="写下你想讨论的内容…"
          />
        </div>
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">视频链接（可选）</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#8b5cf6] transition-colors"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">图片链接（可选）</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#8b5cf6] transition-colors"
            placeholder="https://..."
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? '发布中…' : '发布讨论'}
        </button>
      </form>
    </div>
  );
}
