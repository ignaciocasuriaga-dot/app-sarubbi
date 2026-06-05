import { sendDailyReportEmail } from '../../src/report-email.js';

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) return JSON.parse(req.body);

  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw.trim() ? JSON.parse(raw) : {};
}

function requireManualAuth(req) {
  const secret = process.env.REPORT_TRIGGER_SECRET || process.env.CRON_SECRET;
  if (!secret) return { ok: false, status: 500, error: 'Missing REPORT_TRIGGER_SECRET or CRON_SECRET' };

  const header = req.headers.authorization || req.headers.Authorization || '';
  if (header !== `Bearer ${secret}`) return { ok: false, status: 401, error: 'Unauthorized' };
  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const auth = requireManualAuth(req);
  if (!auth.ok) return res.status(auth.status).json({ ok: false, error: auth.error });

  try {
    const body = await readJsonBody(req);
    const result = await sendDailyReportEmail({
      trigger: 'manual',
      to: body.to,
      cc: body.cc,
      bcc: body.bcc,
      subject: body.subject,
      dryRun: body.dryRun === true,
    });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
