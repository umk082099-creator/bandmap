'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Recruitment } from '@/lib/types';
import { RECRUITMENT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { HiArrowLeft, HiPlay } from 'react-icons/hi';

export default function RecruitmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const supabase = createClient();

  const [r, setR] = useState<Recruitment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('recruitments')
        .select('*')
        .eq('id', id)
        .single();

      setR((data as Recruitment) || null);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!r) {
    return (
      <div className="text-center py-20 text-[#a1a1aa]">
        <p>招募信息不存在</p>
        <Link href="/" className="text-[#8b5cf6] hover:underline text-sm mt-2 inline-block">
          返回首页
        </Link>
      </div>
    );
  }

  const date = new Date(r.created_at).toLocaleString('zh-CN');
  const typeLabel = RECRUITMENT_TYPE_LABELS[r.type] ?? r.type;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[#a1a1aa] hover:text-[#e5e5e5] mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" /> 返回
      </Link>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded bg-[#8b5cf6]/15 text-[#8b5cf6] border border-[#8b5cf6]/25">
            {typeLabel}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[r.status]}`}>
            {STATUS_LABELS[r.status]}
          </span>
        </div>

        <h1 className="text-xl font-bold text-[#e5e5e5] mb-4">{r.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm">
          <div className="flex items-center gap-1.5 bg-[#2a2a2a] px-3 py-1.5 rounded-lg">
            <span className="text-[#a1a1aa]">📍</span>
            <span>{r.city}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#2a2a2a] px-3 py-1.5 rounded-lg">
            <span className="text-[#a1a1aa]">🎵</span>
            <span>{r.instrument}</span>
          </div>
        </div>

        {/* Styles */}
        {r.styles && r.styles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {r.styles.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-full bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/20"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="text-[#e5e5e5] text-sm leading-relaxed whitespace-pre-wrap mb-6 border-t border-[#2a2a2a] pt-4">
          {r.content}
        </div>

        {/* Video */}
        {r.video_url && (
          <div className="mb-6">
            <a
              href={r.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] px-4 py-2 rounded-lg text-sm text-[#8b5cf6] transition-colors"
            >
              <HiPlay className="w-4 h-4" /> 查看视频
            </a>
          </div>
        )}

        {/* Contact */}
        <div className="border-t border-[#2a2a2a] pt-4">
          <div className="text-sm text-[#a1a1aa] mb-1">联系方式</div>
          {user ? (
            <div className="text-[#e5e5e5] font-medium bg-[#2a2a2a] rounded-lg px-4 py-3">
              {r.contact}
            </div>
          ) : (
            <div className="bg-[#2a2a2a] rounded-lg px-4 py-3 text-center">
              <span className="text-[#a1a1aa] text-sm">登录后查看</span>
              <Link
                href="/auth/login"
                className="ml-2 text-[#8b5cf6] hover:underline text-sm"
              >
                去登录
              </Link>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-[#a1a1aa] mt-4">发布于 {date}</div>
      </div>
    </div>
  );
}
