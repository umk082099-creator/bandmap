'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CITIES, INSTRUMENTS, STYLES } from '@/lib/constants';
import { Style } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function NewRecruitmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [type, setType] = useState<'band_seeking' | 'musician_seeking'>('band_seeking');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('东莞');
  const [styles, setStyles] = useState<Style[]>([]);
  const [instrument, setInstrument] = useState('吉他');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-[#a1a1aa] mb-4">请先登录才能发布招募</p>
        <Link href="/auth/login" className="text-[#8b5cf6] hover:underline">
          去登录
        </Link>
      </div>
    );
  }

  const toggleStyle = (s: Style) => {
    if (styles.includes(s)) {
      setStyles(styles.filter((x) => x !== s));
    } else {
      setStyles([...styles, s]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim() || !contact.trim()) {
      setError('请填写标题、内容和联系方式');
      return;
    }
    setLoading(true);

    const { error: err } = await supabase.from('recruitments').insert({
      type,
      title: title.trim(),
      city,
      styles,
      instrument,
      content: content.trim(),
      video_url: videoUrl.trim() || null,
      contact: contact.trim(),
      status: 'active',
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
      <h1 className="text-xl font-bold mb-6">发布招募</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-2">类型</label>
          <div className="flex gap-2">
            {(['band_seeking', 'musician_seeking'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === t
                    ? 'bg-[#8b5cf6] text-white'
                    : 'bg-[#1a1a1a] text-[#a1a1aa] border border-[#2a2a2a]'
                }`}
              >
                {t === 'band_seeking' ? '乐队招人' : '乐手求职'}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#8b5cf6] transition-colors"
            placeholder="例如：东莞后摇乐队招募鼓手"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">城市</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#8b5cf6] transition-colors"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Styles (multi-select) */}
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-2">风格（可多选）</label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleStyle(s.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  styles.includes(s.value)
                    ? 'bg-[#8b5cf6]/20 text-[#a78bfa] border-[#8b5cf6]/40'
                    : 'bg-[#1a1a1a] text-[#a1a1aa] border-[#2a2a2a]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Instrument */}
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">乐器</label>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#8b5cf6] transition-colors"
          >
            {INSTRUMENTS.map((inst) => (
              <option key={inst.value} value={inst.value}>{inst.label}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#8b5cf6] transition-colors resize-none"
            placeholder="详细描述你的招募需求…"
          />
        </div>

        {/* Video URL */}
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

        {/* Contact */}
        <div>
          <label className="block text-sm text-[#a1a1aa] mb-1">联系方式</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#8b5cf6] transition-colors"
            placeholder="微信 / QQ / 手机号等"
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
          {loading ? '发布中…' : '发布招募'}
        </button>
      </form>
    </div>
  );
}
