-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ── keywords ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS keywords (
  id               TEXT        PRIMARY KEY,
  user_id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  keyword          TEXT        NOT NULL,
  competition      INTEGER     NOT NULL,
  queue_sum        INTEGER     NOT NULL,
  avg_orders       NUMERIC(10,2) NOT NULL,
  seller_per_order NUMERIC(10,4) NOT NULL,
  date             TEXT        NOT NULL,
  in_history       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own keywords"
  ON keywords FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── saved_keywords ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_keywords (
  id               TEXT        PRIMARY KEY,
  user_id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  keyword          TEXT        NOT NULL,
  competition      INTEGER     NOT NULL,
  seller_per_order NUMERIC(10,4) NOT NULL,
  saved_at         TEXT        NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE saved_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own saved"
  ON saved_keywords FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── starred_keywords ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS starred_keywords (
  user_id    UUID  REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  keyword_id TEXT  NOT NULL,
  PRIMARY KEY (user_id, keyword_id)
);

ALTER TABLE starred_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own starred"
  ON starred_keywords FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
