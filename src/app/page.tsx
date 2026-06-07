'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Recruitment, Post, Style } from '@/lib/types';
import { CITIES } from '@/lib/constants';
import { Filters } from '@/components/Filters';
import { RecruitmentCard } from '@/components/RecruitmentCard';
import { DiscussionCard } from '@/components/DiscussionCard';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';

type Tab = 'recruitment' | 'discussion';

export default function Home() {
  const { user } = useAuth();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>('recruitment');
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [city, setCity] = useState('东莞');
  const [instrument, setInstrument] = useState('');
  const [styles, setStyles] = useState<Style[]>([]);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (tab === 'recruitment') {
        let query = supabase
          .from('recruitments')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (city) query = query.eq('city', city);
        if (instrument) query = query.eq('instrument', instrument);
        if (styles.length > 0) {
          // Filter recruitments that contain ALL selected styles
          query = query.contains('styles', styles);
        }

        const { data } = await query;
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
    fetchData();
  }, [tab, city, instrument, styles]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-[#1a1a1a] rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('recruitment')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'recruitment'
              ? 'bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20'
              : 'text-[#a1a1aa] hover:text-[#e5e5e5]'
          }`}
        >
          招募板
        </button>
        <button
          onClick={() => setTab('discussion')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'discussion'
              ? 'bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20'
              : 'text-[#a1a1aa] hover:text-[#e5e5e5]'
          }`}
        >
          讨论板
        </button>
      </div>

      {/* Filters (recruitment only) */}
      {tab === 'recruitment' && (
        <div className="mb-6">
          <Filters
            city={city}
            setCity={setCity}
            instrument={instrument}
            setInstrument={setInstrument}
            styles={styles}
            setStyles={setStyles}
          />
        </div>
      )}

      {/* Post button */}
      {user && (
        <div className="mb-4">
          <Link
            href={tab === 'recruitment' ? '/recruitment/new' : '/discussion/new'}
            className="inline-flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <HiPlus className="w-4 h-4" />
            {tab === 'recruitment' ? '发布招募' : '发布讨论'}
          </Link>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'recruitment' ? (
        recruitments.length === 0 ? (
          <div className="text-center py-20 text-[#a1a1aa]">
            <p className="text-4xl mb-4">🎸</p>
            <p>暂无招募信息</p>
            <p className="text-sm mt-2">换个城市或筛选条件试试</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recruitments.map((r) => (
              <RecruitmentCard key={r.id} r={r} />
            ))}
          </div>
        )
      ) : (
        posts.length === 0 ? (
          <div className="text-center py-20 text-[#a1a1aa]">
            <p className="text-4xl mb-4">💬</p>
            <p>暂无讨论帖</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <DiscussionCard key={p.id} post={p} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
