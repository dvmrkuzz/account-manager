-- ============================================================
-- VaultMind Account Manager — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Accounts Table
-- ============================================================
CREATE TABLE IF NOT EXISTS accounts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_name TEXT NOT NULL,
  email        TEXT,
  username     TEXT,
  encrypted_password TEXT NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Schedules Table
-- ============================================================
CREATE TABLE IF NOT EXISTS schedules (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  description      TEXT,
  date             DATE NOT NULL,
  time             TIME,
  color            TEXT DEFAULT '#6366f1',
  reminder_settings JSONB DEFAULT '{"remindOnDay": true, "remindThreeHours": true}'::jsonb,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Auto-update `updated_at` trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS)
-- Only authenticated users can read/write their data
-- ============================================================
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Policy: authenticated users can do everything
CREATE POLICY "auth_accounts_all" ON accounts
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_schedules_all" ON schedules
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- Sample data (optional — remove if not needed)
-- ============================================================
-- INSERT INTO accounts (platform_name, email, username, encrypted_password, description)
-- VALUES ('GitHub', 'admin@example.com', 'adminuser', 'ENCRYPTED_VALUE_HERE', 'Main GitHub account');
