// Simulated organic certification verification service.
// Use Case 1 allows "an external or simulated verification service"; this is ours.
// It holds a few made-up certificates and can be switched "down" to test the
// service-unavailable path.
//
//   GET  /certificates/:certNumber   -> 200 certificate | 404 not found | 503 when down
//   GET  /health                     -> 200 { down: false } | 503 when down
//   POST /admin/outage  { "down": true|false }  -> switch the outage on or off while running
//
// Start:  npm run mock         (or CERT_MOCK_DOWN=true npm run mock to start "down")

require('dotenv').config();
const express = require('express');
const certificates = require('./certificates.json');

function createApp(options = {}) {
  const app = express();
  app.use(express.json());

  const state = {
    down: options.down ?? process.env.CERT_MOCK_DOWN === 'true',
    delayMs: options.delayMs ?? Number(process.env.CERT_MOCK_DELAY_MS || 0)
  };

  const unavailable = (res) => res.status(503).json({ error: 'Certification service unavailable (simulated outage)' });
  const later = (fn) => (req, res) => setTimeout(() => fn(req, res), state.delayMs);

  app.get('/health', (req, res) => (state.down ? unavailable(res) : res.json({ down: false })));

  app.get('/certificates/:certNumber', later((req, res) => {
    if (state.down) return unavailable(res);
    const wanted = req.params.certNumber.trim().toUpperCase();
    const cert = certificates.find(c => c.certNumber === wanted);
    if (!cert) return res.status(404).json({ error: `No certificate ${wanted}` });
    res.json(cert);
  }));

  app.post('/admin/outage', (req, res) => {
    state.down = req.body?.down === true;
    console.log(`[cert-mock] outage ${state.down ? 'ON' : 'OFF'}`);
    res.json({ down: state.down });
  });

  return app;
}

if (require.main === module) {
  const port = Number(process.env.CERT_MOCK_PORT || 4010);
  createApp().listen(port, () => console.log(`[cert-mock] listening on http://localhost:${port}`));
}

module.exports = { createApp };
