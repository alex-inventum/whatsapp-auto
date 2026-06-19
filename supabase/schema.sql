-- WhatsApp Auto - Supabase Schema
-- Run this in Supabase SQL Editor

-- Messages log
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'chat',
  classification TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-reply rules
CREATE TABLE auto_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  match_type TEXT NOT NULL DEFAULT 'contains', -- contains, exact, startsWith
  response TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forward rules
CREATE TABLE forward_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_number TEXT,
  forward_to TEXT NOT NULL,
  message_type TEXT, -- chat, image, document, etc.
  keyword TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classification rules
CREATE TABLE classification_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT NOT NULL,
  keywords TEXT NOT NULL, -- comma-separated keywords
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forward_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE classification_rules ENABLE ROW LEVEL SECURITY;

-- Policies (allow authenticated users full access)
CREATE POLICY "Allow all for authenticated" ON messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON auto_replies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON forward_rules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON classification_rules FOR ALL USING (auth.role() = 'authenticated');

-- Allow service role (backend) full access
CREATE POLICY "Service role access" ON messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role access" ON auto_replies FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role access" ON forward_rules FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role access" ON classification_rules FOR ALL USING (auth.role() = 'service_role');
