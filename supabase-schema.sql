-- 在 Supabase Dashboard → SQL Editor 中运行以下 SQL

-- 1. 用户资料表（扩展 Supabase auth.users）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  homepage TEXT DEFAULT ''::TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 开启 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 允许任何人读取 profile
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- 只允许用户更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 允许已认证用户创建自己的 profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- 2. 评论表
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  post_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引：按文章快速查询评论
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON public.comments(post_slug);

-- 开启 RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 允许任何人读取评论
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

-- 只允许已认证用户创建评论
CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 只允许用户删除自己的评论
CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);


-- 3. 自动创建 profile 的 trigger（注册时自动创建 profile）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除旧 trigger（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();