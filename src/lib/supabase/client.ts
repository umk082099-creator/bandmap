'use client';

import { createBrowserClient } from '@supabase/ssr';

let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During static generation, env vars won't be set. Return a no-op client
  // that only gets replaced on the client side during hydration.
  if (!url || !key || url === 'your_supabase_url_here') {
    // Only create placeholder if we're on the server during build
    if (typeof window === 'undefined') {
      return createBrowserClient('https://placeholder.supabase.co', 'placeholder');
    }
    throw new Error('Missing Supabase environment variables. Please configure .env.local');
  }

  cachedClient = createBrowserClient(url, key);
  return cachedClient;
}
