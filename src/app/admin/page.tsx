'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Recruitment, Post, RecruitmentStatus } from '@/lib/types';
import { STATUS_LABELS, STATUS_COLORS, RECRUITMENT_TYPE_LABELS } from '@/lib/constants';
import { HiTrash, HiCheck, HiX } from 'react-icons/hi';

type Tab = 'recruitments' | 'posts';

export default function AdminPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>('recruitments');
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    if (tab === 'recruitments') {
      const { data } = await supabase
        .from('recruitments')
        .select('*')
        .order('created_at', { ascending: false });
      setRecruitments((data as Recruitment[]) || []);
    } else {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      setPosts((data as Post[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const deleteRecruitment = async (id: number) => {
    if (!confirm('确认删除这条招募？')) return;
    setActionLoading(id);
    await supabase.from('recruitments').delete().eq('id', id);
    setActionLoading(null);
    fetchData();
  };

  const updateStatus = async (id: number, status: RecruitmentStatus) => {
    setActionLoading(id);
    await supabase.from('recruitments').update({ status }).eq('id', id);
    setActionLoading(null);
    fetchData();
  };

  const deletePost = async (id: number) => {
    if (!confirm('确认删除这条讨论帖？')) return;
    setActionLoading(id);
    await supabase.from('posts').delete().eq('id', id);
    setActionLoading(null);
    fetchData();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">管理后台</h1>

      {/* Admin tabs */}
      <div className="flex items-center gap-1 mb-6 bg-[#1a1a1a] rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('recruitments')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'recruitments'
              ? 'bg-[#8b5cf6] text-white'
              : 'text-[#a1a1aa] hover:text-[#e5e5e5]'
          }`}
        >
          招募管理
        </button>
        <button
          onClick={() => setTab('posts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'posts'
              ? 'bg-[#8b5cf6] text-white'
              : 'text-[#a1a1aa] hover:text-[#e5e5e5]'
          }`}
        >
          讨论管理
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'recruitments' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-left text-[#a1a1aa]">
                <th className="py-3 px-2 font-medium">ID</th>
                <th className="py-3 px-2 font-medium">标题</th>
                <th className="py-3 px-2 font-medium">类型</th>
                <th className="py-3 px-2 font-medium">城市</th>
                <th className="py-3 px-2 font-medium">状态</th>
                <th className="py-3 px-2 font-medium">时间</th>
                <th className="py-3 px-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {recruitments.map((r) => (
                <tr key={r.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/50">
                  <td className="py-3 px-2 text-[#a1a1aa]">{r.id}</td>
                  <td className="py-3 px-2 max-w-[200px] truncate">{r.title}</td>
                  <td className="py-3 px-2">{RECRUITMENT_TYPE_LABELS[r.type]}</td>
                  <td className="py-3 px-2">{r.city}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-[#a1a1aa] text-xs">
                    {new Date(r.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {r.status === 'active' && (
                        <>
                          <button
                            onClick={() => updateStatus(r.id, 'filled')}
                            disabled={actionLoading === r.id}
                            className="text-xs bg-green-500/15 text-green-400 border border-green-500/25 px-2 py-1 rounded hover:bg-green-500/25 transition-colors"
                            title="标记为已招满"
                          >
                            招满
                          </button>
                          <button
                            onClick={() => updateStatus(r.id, 'expired')}
                            disabled={actionLoading === r.id}
                            className="text-xs bg-red-500/15 text-red-400 border border-red-500/25 px-2 py-1 rounded hover:bg-red-500/25 transition-colors"
                            title="标记为已过期"
                          >
                            过期
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteRecruitment(r.id)}
                        disabled={actionLoading === r.id}
                        className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded hover:bg-red-500/20 transition-colors"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {recruitments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#a1a1aa]">
                    暂无招募信息
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-left text-[#a1a1aa]">
                <th className="py-3 px-2 font-medium">ID</th>
                <th className="py-3 px-2 font-medium">标题</th>
                <th className="py-3 px-2 font-medium">内容</th>
                <th className="py-3 px-2 font-medium">时间</th>
                <th className="py-3 px-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/50">
                  <td className="py-3 px-2 text-[#a1a1aa]">{p.id}</td>
                  <td className="py-3 px-2 max-w-[200px] truncate">{p.title}</td>
                  <td className="py-3 px-2 max-w-[200px] truncate text-[#a1a1aa]">
                    {p.content.slice(0, 50)}
                  </td>
                  <td className="py-3 px-2 text-[#a1a1aa] text-xs">
                    {new Date(p.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => deletePost(p.id)}
                      disabled={actionLoading === p.id}
                      className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded hover:bg-red-500/20 transition-colors"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#a1a1aa]">
                    暂无讨论帖
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
