import { reportAutomationStatus } from '../../src/report-email.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(await reportAutomationStatus());
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
