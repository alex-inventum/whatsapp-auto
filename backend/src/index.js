require('dotenv').config();
const { create, Client } = require('@open-wa/wa-automate');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { handleIncomingMessage } = require('./handlers/messageHandler');
const { setupRoutes } = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

let waClient = null;

async function start() {
  // Setup Express routes
  setupRoutes(app, () => waClient, supabase);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
  });

  // Start WhatsApp client
  try {
    waClient = await create({
      sessionId: 'whatsapp-auto',
      headless: true,
      qrTimeout: 0,
      authTimeout: 0,
      restartOnCrash: true,
      cacheEnabled: false,
      useChrome: true,
      killProcessOnBrowserClose: false,
    });

    console.log('[WA] Client started successfully');

    // Listen for incoming messages
    waClient.onMessage(async (message) => {
      await handleIncomingMessage(waClient, message, supabase);
    });

    // QR code event
    waClient.onStateChanged((state) => {
      console.log('[WA] State changed:', state);
    });
  } catch (error) {
    console.error('[WA] Error starting client:', error.message);
  }
}

start();
