'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Post } from '@/lib/types';
import Link from 'next/link';
import { HiArrowLeft, HiPlay, HiPhotograph } from 'react-icons/hi';

export default function DiscussionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      setPost((data as Post) || null);
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

  if (!post) {
    return (
      <div className="text-center py-20 text-[#a1a1aa]">
        <p>帖子不存在</p>
        <Link href="/" className="text-[#8b5cf6] hover:underline text-sm mt-2 inline-block">
          返回首页
        </Link>
      </div>
    );
  }

  const date = new Date(post.created_at).toLocaleString('zh-CN');

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[#a1a1aa] hover:text-[#e5e5e5] mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" /> 返回
      </Link>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h1 className="text-xl font-bold text-[#e5e5e5] mb-4">{post.title}</h1>

        {/* Content */}
        <div className="text-[#e5e5e5] text-sm leading-relaxed whitespace-pre-wrap mb-6">
          {post.content}
        </div>

        {/* Image */}
        {post.image_url && (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image_url}
              alt={post.title}
              className="max-w-full rounded-lg border border-[#2a2a2a]"
            />
          </div>
        )}

        {/* Video */}
        {post.video_url && (
          <div className="mb-4">
            <a
              href={post.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] px-4 py-2 rounded-lg text-sm text-[#8b5cf6] transition-colors"
            >
              <HiPlay className="w-4 h-4" /> 查看视频
            </a>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-[#a1a1aa] mt-4 pt-4 border-t border-[#2a2a2a]">
          发布于 {date}
        </div>
      </div>
    </div>
  );
}
