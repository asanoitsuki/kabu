-- テーブル作成（既存なら無視）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar TEXT DEFAULT '😊',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (requester_id, receiver_id)
);

-- RLS有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーを削除してから再作成
DROP POLICY IF EXISTS "profiles_select_all"      ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own"      ON profiles;
DROP POLICY IF EXISTS "profiles_update_own"      ON profiles;
DROP POLICY IF EXISTS "friendships_select_own"   ON friendships;
DROP POLICY IF EXISTS "friendships_insert_own"   ON friendships;
DROP POLICY IF EXISTS "friendships_update_receiver" ON friendships;
DROP POLICY IF EXISTS "friendships_delete_own"   ON friendships;

CREATE POLICY "profiles_select_all"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own"   ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"   ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "friendships_select_own" ON friendships FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);
CREATE POLICY "friendships_insert_own" ON friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "friendships_update_receiver" ON friendships FOR UPDATE
  USING (auth.uid() = receiver_id);
CREATE POLICY "friendships_delete_own" ON friendships FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);
