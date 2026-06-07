import { Post } from '@/lib/types';
import Link from 'next/link';
import { HiPlay, HiPhotograph } from 'react-icons/hi';

export function DiscussionCard({ post }: { post: Post }) {
  const date = new Date(post.created_at).toLocaleDateString('zh-CN');
  const excerpt = post.content.length > 50 ? post.content.slice(0, 50) + '…' : post.content;

  return (
    <Link
      href={`/discussion/${post.id}`}
      className="block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] hover:bg-[#1e1e1e] transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-[#e5e5e5] truncate flex-1">{post.title}</h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {post.video_url && <HiPlay className="w-4 h-4 text-[#8b5cf6]" />}
          {post.image_url && <HiPhotograph className="w-4 h-4 text-[#8b5cf6]" />}
        </div>
      </div>
      <p className="text-sm text-[#a1a1aa] line-clamp-2">{excerpt}</p>
      <div className="text-xs text-[#a1a1aa] mt-3">{date}</div>
    </Link>
  );
}
