-- BandMap Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create recruitments table
CREATE TABLE public.recruitments (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('band_seeking', 'musician_seeking')),
  title TEXT NOT NULL,
  city TEXT NOT NULL,
  styles TEXT[] NOT NULL DEFAULT '{}',
  instrument TEXT NOT NULL,
  content TEXT NOT NULL,
  video_url TEXT,
  contact TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'filled', 'expired')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create posts table (discussion board)
CREATE TABLE public.posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  video_url TEXT,
  image_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 5. Profiles: users can read all, insert/update own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Recruitments: everyone can read, auth users can insert, owners can update
CREATE POLICY "Recruitments are viewable by everyone" ON public.recruitments
  FOR SELECT USING (true);
CREATE POLICY "Auth users can insert recruitments" ON public.recruitments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Owners can update their recruitments" ON public.recruitments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their recruitments" ON public.recruitments
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Posts: everyone can read, auth users can insert, owners can update/delete
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (true);
CREATE POLICY "Auth users can insert posts" ON public.posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Owners can update their posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Create indexes
CREATE INDEX idx_recruitments_city ON public.recruitments(city);
CREATE INDEX idx_recruitments_status ON public.recruitments(status);
CREATE INDEX idx_recruitments_created_at ON public.recruitments(created_at DESC);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

-- 9. Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
