const { createClient } = require('@supabase/supabase-js');

async function logMessage(supabase, messageData) {
  const { error } = await supabase
    .from('messages')
    .insert(messageData);
  if (error) console.error('[DB] Error logging message:', error.message);
}

async function getAutoReplies(supabase) {
  const { data, error } = await supabase
    .from('auto_replies')
    .select('*')
    .eq('active', true);
  if (error) {
    console.error('[DB] Error fetching auto replies:', error.message);
    return [];
  }
  return data || [];
}

async function getForwardRules(supabase) {
  const { data, error } = await supabase
    .from('forward_rules')
    .select('*')
    .eq('active', true);
  if (error) {
    console.error('[DB] Error fetching forward rules:', error.message);
    return [];
  }
  return data || [];
}

async function classifyMessage(supabase, body) {
  const { data: rules } = await supabase
    .from('classification_rules')
    .select('*')
    .eq('active', true);

  if (!rules) return null;

  for (const rule of rules) {
    const keywords = rule.keywords.split(',').map(k => k.trim().toLowerCase());
    if (keywords.some(kw => body.toLowerCase().includes(kw))) {
      return rule.tag;
    }
  }
  return null;
}

module.exports = { logMessage, getAutoReplies, getForwardRules, classifyMessage };
