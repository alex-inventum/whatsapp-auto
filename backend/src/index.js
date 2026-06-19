require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
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
    console.log('[WA] WhatsApp client disabled - will be enabled with open-wa integration');
  });
}

start();
