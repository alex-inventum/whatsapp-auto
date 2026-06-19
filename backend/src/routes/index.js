function setupRoutes(app, getClient, supabase) {
  // Health check
  app.get('/health', (req, res) => {
    const client = getClient();
    res.json({
      status: 'ok',
      whatsapp: client ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  });

  // Get QR code
  app.get('/api/qr', async (req, res) => {
    const client = getClient();
    if (!client) {
      return res.status(503).json({ error: 'WhatsApp client not ready' });
    }
    try {
      const qr = await client.getQrCode();
      if (qr) {
        res.json({ qr });
      } else {
        res.json({ message: 'Already authenticated' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get connection status
  app.get('/api/status', async (req, res) => {
    const client = getClient();
    if (!client) {
      return res.json({ connected: false });
    }
    try {
      const state = await client.getConnectionState();
      res.json({ connected: state === 'CONNECTED', state });
    } catch (error) {
      res.json({ connected: false, error: error.message });
    }
  });

  // Send message
  app.post('/api/send', async (req, res) => {
    const client = getClient();
    if (!client) {
      return res.status(503).json({ error: 'WhatsApp client not ready' });
    }
    const { to, message } = req.body;
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing to or message' });
    }
    try {
      await client.sendText(to, message);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get auto-reply rules
  app.get('/api/rules/auto-replies', async (req, res) => {
    const { data, error } = await supabase.from('auto_replies').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // Create auto-reply rule
  app.post('/api/rules/auto-replies', async (req, res) => {
    const { keyword, match_type, response, active } = req.body;
    const { data, error } = await supabase
      .from('auto_replies')
      .insert({ keyword, match_type, response, active: active ?? true })
      .select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  // Get forward rules
  app.get('/api/rules/forwards', async (req, res) => {
    const { data, error } = await supabase.from('forward_rules').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // Create forward rule
  app.post('/api/rules/forwards', async (req, res) => {
    const { from_number, forward_to, message_type, keyword, active } = req.body;
    const { data, error } = await supabase
      .from('forward_rules')
      .insert({ from_number, forward_to, message_type, keyword, active: active ?? true })
      .select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  // Get classification rules
  app.get('/api/rules/classifications', async (req, res) => {
    const { data, error } = await supabase.from('classification_rules').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // Create classification rule
  app.post('/api/rules/classifications', async (req, res) => {
    const { tag, keywords, active } = req.body;
    const { data, error } = await supabase
      .from('classification_rules')
      .insert({ tag, keywords, active: active ?? true })
      .select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });
}

module.exports = { setupRoutes };
