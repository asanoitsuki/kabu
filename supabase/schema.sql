-- ゲームセーブ（ユーザーごとに1件：途中セーブ）
create table if not exists game_saves (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null unique,
  game_state jsonb not null,
  company_name text,
  industry   text,
  difficulty text,
  turn       integer default 1,
  updated_at timestamptz default now()
);

-- ゲーム結果（プレイ履歴）
create table if not exists game_results (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  company_name text not null,
  industry     text not null,
  difficulty   text not null,
  grade        text not null,
  ipo_price    integer not null,
  final_price  integer not null,
  total_return numeric not null,
  turns_played integer not null,
  played_at    timestamptz default now()
);

-- Row Level Security 有効化
alter table game_saves   enable row level security;
alter table game_results enable row level security;

-- game_saves ポリシー
create policy "own saves select" on game_saves for select using (auth.uid() = user_id);
create policy "own saves insert" on game_saves for insert with check (auth.uid() = user_id);
create policy "own saves update" on game_saves for update using (auth.uid() = user_id);
create policy "own saves delete" on game_saves for delete using (auth.uid() = user_id);

-- game_results ポリシー
create policy "own results select" on game_results for select using (auth.uid() = user_id);
create policy "own results insert" on game_results for insert with check (auth.uid() = user_id);
