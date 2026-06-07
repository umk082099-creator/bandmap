'use client';

import { useAuth } from './AuthProvider';
import Link from 'next/link';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur border-b border-[#2a2a2a]">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-[#8b5cf6]">🎸</span>
          <span>BandMap</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/admin" className="text-[#a1a1aa] hover:text-[#e5e5e5] transition-colors">
            管理
          </Link>
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="text-[#a1a1aa] text-xs truncate max-w-[140px]">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-[#a1a1aa] hover:text-red-400 transition-colors text-sm"
              >
                退出
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
            >
              登录
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-2xl text-[#a1a1aa]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#2a2a2a] bg-[#0f0f0f] px-4 py-4 space-y-3">
          <Link
            href="/admin"
            className="block text-[#a1a1aa] hover:text-[#e5e5e5] text-sm"
            onClick={() => setMenuOpen(false)}
          >
            管理后台
          </Link>
          {user ? (
            <>
              <div className="text-[#a1a1aa] text-xs">{user.email}</div>
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="text-red-400 text-sm"
              >
                退出登录
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="block text-[#8b5cf6] text-sm"
              onClick={() => setMenuOpen(false)}
            >
              登录 / 注册
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
