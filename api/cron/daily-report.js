import { sendDailyReportEmail } from '../../src/report-email.js';

function requireCronAuth(req) {
  const configuredForSending = Boolean(process.env.RESEND_API_KEY && process.env.REPORT_EMAIL_TO);
  if (!configuredForSending) return { ok: false, status: 200, skipped: true, error: 'Report email is not configured' };

  const secret = process.env.CRON_SECRET;
  if (!secret) return { ok: false, status: 500, error: 'Missing CRON_SECRET' };
  const header = req.headers.authorization || req.headers.Authorization || '';
  if (header !== `Bearer ${secret}`) return { ok: false, status: 401, error: 'Unauthorized' };
  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const auth = requireCronAuth(req);
  if (!auth.ok) return res.status(auth.status).json({ ok: auth.skipped || false, skipped: Boolean(auth.skipped), error: auth.error });

  try {
    const result = await sendDailyReportEmail({ trigger: 'cron' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
