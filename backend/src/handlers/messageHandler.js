const { getAutoReplies, getForwardRules, classifyMessage, logMessage } = require('../services/supabaseService');

async function handleIncomingMessage(client, message, supabase) {
  try {
    // Skip status messages and own messages
    if (message.isGroupMsg || message.fromMe) return;

    const sender = message.from;
    const body = message.body || '';
    const type = message.type;

    console.log(`[MSG] From: ${sender} | Type: ${type} | Body: ${body.substring(0, 50)}`);

    // 1. Log message to Supabase
    await logMessage(supabase, {
      sender,
      body,
      type,
      timestamp: new Date().toISOString(),
    });

    // 2. Classify message
    const classification = await classifyMessage(supabase, body);
    if (classification) {
      console.log(`[CLASSIFY] Message tagged: ${classification}`);
    }

    // 3. Check auto-reply rules
    const replies = await getAutoReplies(supabase);
    for (const rule of replies) {
      if (rule.active && matchesRule(body, rule)) {
        await client.sendText(sender, rule.response);
        console.log(`[AUTO-REPLY] Sent to ${sender}: ${rule.response.substring(0, 30)}...`);
        break;
      }
    }

    // 4. Check forward rules
    const forwards = await getForwardRules(supabase);
    for (const rule of forwards) {
      if (rule.active && matchesForwardRule(message, rule)) {
        await client.forwardMessages(rule.forward_to, [message.id], false);
        console.log(`[FORWARD] Message forwarded to ${rule.forward_to}`);
      }
    }
  } catch (error) {
    console.error('[MSG] Error handling message:', error.message);
  }
}

function matchesRule(body, rule) {
  const text = body.toLowerCase();
  switch (rule.match_type) {
    case 'contains':
      return text.includes(rule.keyword.toLowerCase());
    case 'exact':
      return text === rule.keyword.toLowerCase();
    case 'startsWith':
      return text.startsWith(rule.keyword.toLowerCase());
    default:
      return false;
  }
}

function matchesForwardRule(message, rule) {
  if (rule.from_number && message.from !== rule.from_number) return false;
  if (rule.message_type && message.type !== rule.message_type) return false;
  if (rule.keyword && !message.body?.toLowerCase().includes(rule.keyword.toLowerCase())) return false;
  return true;
}

module.exports = { handleIncomingMessage };
