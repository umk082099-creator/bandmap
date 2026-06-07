import { Recruitment } from '@/lib/types';
import { RECRUITMENT_TYPE_LABELS, STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import Link from 'next/link';
import { HiPlay } from 'react-icons/hi';

export function RecruitmentCard({ r }: { r: Recruitment }) {
  const typeLabel = RECRUITMENT_TYPE_LABELS[r.type] ?? r.type;
  const date = new Date(r.created_at).toLocaleDateString('zh-CN');

  return (
    <Link
      href={`/recruitment/${r.id}`}
      className="block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] hover:bg-[#1e1e1e] transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded bg-[#8b5cf6]/15 text-[#8b5cf6] border border-[#8b5cf6]/25">
              {typeLabel}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[r.status]}`}>
              {STATUS_LABELS[r.status]}
            </span>
          </div>
          <h3 className="font-semibold text-[#e5e5e5] truncate mt-1">{r.title}</h3>
        </div>
        {r.video_url && (
          <span className="text-[#8b5cf6] flex-shrink-0 mt-1">
            <HiPlay className="w-5 h-5" />
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-[#a1a1aa]">
        <span className="bg-[#2a2a2a] px-2 py-0.5 rounded">{r.city}</span>
        <span className="bg-[#2a2a2a] px-2 py-0.5 rounded">{r.instrument}</span>
      </div>

      {r.styles && r.styles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {r.styles.map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-0.5 rounded-full bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/20"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="text-xs text-[#a1a1aa] mt-3">{date}</div>
    </Link>
  );
}
