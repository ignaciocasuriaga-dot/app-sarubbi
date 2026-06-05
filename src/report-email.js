import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_APP_URL = 'https://sarubbi-retail-watch.vercel.app';
const DEFAULT_FROM = 'Sarubbi Retail Watch <onboarding@resend.dev>';
const DEFAULT_SCHEDULE = '0 11 * * *';

function appUrl() {
  return (process.env.APP_URL || DEFAULT_APP_URL).replace(/\/+$/, '');
}

function resolveLocalPath(value) {
  const filePath = value || '';
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

export function parseRecipients(value) {
  if (Array.isArray(value)) return value.flatMap(parseRecipients);
  return String(value || '')
    .split(/[,\n;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateRecipients(value, label) {
  const recipients = parseRecipients(value);
  const invalid = recipients.filter((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  if (invalid.length) throw new Error(`${label} contiene emails invalidos: ${invalid.join(', ')}`);
  return [...new Set(recipients)];
}

function maskEmail(email) {
  const [local = '', domain = ''] = String(email).split('@');
  const safeLocal = local.length <= 2 ? `${local.slice(0, 1)}***` : `${local.slice(0, 2)}***`;
  return domain ? `${safeLocal}@${domain}` : safeLocal;
}

function countBy(items, key) {
  const counts = {};
  for (const item of items) {
    const value = item?.[key] || '-';
    counts[value] = (counts[value] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function fmtDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toLocaleString('es-UY');
  return date.toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' });
}

function fmtPrice(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `$ ${n.toLocaleString('es-UY')}` : '-';
}

async function readLatestPayload() {
  const latestPath = resolveLocalPath(process.env.REPORT_DATA_PATH || 'public/data/latest.json');
  try {
    const payload = JSON.parse(await readFile(latestPath, 'utf8'));
    return { latestPath, payload };
  } catch (err) {
    const latestUrl = process.env.REPORT_DATA_URL || `${appUrl()}/data/latest.json`;
    const resp = await fetch(latestUrl, { cache: 'no-store' });
    if (!resp.ok) throw new Error(`No se pudo leer latest.json (${resp.status})`);
    return { latestPath: latestUrl, payload: await resp.json() };
  }
}

function summarize(payload) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const sarubbi = items.filter((item) => item.group === 'sarubbi');
  const competencia = items.filter((item) => item.group === 'competencia');
  const priced = items.map((item) => Number(item.price)).filter(Number.isFinite);
  const avgPrice = priced.length ? priced.reduce((sum, n) => sum + n, 0) / priced.length : null;

  return {
    generatedAt: payload.generatedAt,
    total: items.length,
    sarubbi: sarubbi.length,
    competencia: competencia.length,
    stores: countBy(items, 'super').slice(0, 8),
    brands: countBy(items, 'brandLabel').slice(0, 8),
    avgPrice,
  };
}

function summaryHtml(summary) {
  const stores = summary.stores.map(([name, count]) => `<li>${name}: <b>${count}</b></li>`).join('');
  const brands = summary.brands.map(([name, count]) => `<li>${name}: <b>${count}</b></li>`).join('');
  return `
    <p>Adjunto va el informe PDF diario de Sarubbi Retail Watch.</p>
    <table style="border-collapse:collapse;margin:16px 0;font-family:Arial,sans-serif;font-size:14px">
      <tr><td style="padding:6px 12px;border:1px solid #d8dee9">Fecha datos</td><td style="padding:6px 12px;border:1px solid #d8dee9"><b>${fmtDate(summary.generatedAt)}</b></td></tr>
      <tr><td style="padding:6px 12px;border:1px solid #d8dee9">SKUs totales</td><td style="padding:6px 12px;border:1px solid #d8dee9"><b>${summary.total}</b></td></tr>
      <tr><td style="padding:6px 12px;border:1px solid #d8dee9">Sarubbi</td><td style="padding:6px 12px;border:1px solid #d8dee9"><b>${summary.sarubbi}</b></td></tr>
      <tr><td style="padding:6px 12px;border:1px solid #d8dee9">Competencia</td><td style="padding:6px 12px;border:1px solid #d8dee9"><b>${summary.competencia}</b></td></tr>
      <tr><td style="padding:6px 12px;border:1px solid #d8dee9">Precio promedio</td><td style="padding:6px 12px;border:1px solid #d8dee9"><b>${fmtPrice(summary.avgPrice)}</b></td></tr>
    </table>
    <p><b>Cobertura por cadena</b></p>
    <ul>${stores || '<li>Sin datos</li>'}</ul>
    <p><b>Marcas principales</b></p>
    <ul>${brands || '<li>Sin datos</li>'}</ul>
    <p><a href="${appUrl()}">Abrir tablero</a></p>
  `;
}

function summaryText(summary) {
  const stores = summary.stores.map(([name, count]) => `- ${name}: ${count}`).join('\n');
  const brands = summary.brands.map(([name, count]) => `- ${name}: ${count}`).join('\n');
  return [
    'Adjunto va el informe PDF diario de Sarubbi Retail Watch.',
    '',
    `Fecha datos: ${fmtDate(summary.generatedAt)}`,
    `SKUs totales: ${summary.total}`,
    `Sarubbi: ${summary.sarubbi}`,
    `Competencia: ${summary.competencia}`,
    `Precio promedio: ${fmtPrice(summary.avgPrice)}`,
    '',
    'Cobertura por cadena:',
    stores || '- Sin datos',
    '',
    'Marcas principales:',
    brands || '- Sin datos',
    '',
    `Tablero: ${appUrl()}`,
  ].join('\n');
}

async function pdfAttachment(summary) {
  const filename = `sarubbi-retail-watch-${String(summary.generatedAt || new Date().toISOString()).slice(0, 10)}.pdf`;
  const pdfPath = resolveLocalPath(process.env.REPORT_PDF_PATH || 'public/data/latest.pdf');
  if (existsSync(pdfPath)) {
    return {
      filename,
      content: (await readFile(pdfPath)).toString('base64'),
    };
  }

  return {
    filename,
    path: process.env.REPORT_PDF_URL || `${appUrl()}/data/latest.pdf`,
  };
}

export async function buildReportEmail(options = {}) {
  const { payload } = await readLatestPayload();
  const summary = summarize(payload);
  const to = validateRecipients(options.to ?? process.env.REPORT_EMAIL_TO, 'REPORT_EMAIL_TO');
  const cc = validateRecipients(options.cc ?? process.env.REPORT_EMAIL_CC, 'REPORT_EMAIL_CC');
  const bcc = validateRecipients(options.bcc ?? process.env.REPORT_EMAIL_BCC, 'REPORT_EMAIL_BCC');

  if (!to.length) throw new Error('Falta REPORT_EMAIL_TO o un destinatario en el body.');

  const subjectPrefix = process.env.REPORT_EMAIL_SUBJECT_PREFIX || 'Sarubbi Retail Watch';
  const subject = options.subject || `${subjectPrefix} - informe diario ${String(summary.generatedAt || new Date().toISOString()).slice(0, 10)}`;
  const attachment = await pdfAttachment(summary);

  return {
    summary,
    message: {
      from: options.from || process.env.REPORT_EMAIL_FROM || DEFAULT_FROM,
      to,
      cc: cc.length ? cc : undefined,
      bcc: bcc.length ? bcc : undefined,
      reply_to: process.env.REPORT_EMAIL_REPLY_TO || undefined,
      subject,
      html: summaryHtml(summary),
      text: summaryText(summary),
      attachments: [attachment],
      tags: [
        { name: 'app', value: 'sarubbi-retail-watch' },
        { name: 'kind', value: 'daily-report' },
      ],
    },
  };
}

export async function sendDailyReportEmail(options = {}) {
  const dryRun = Boolean(options.dryRun);
  const { summary, message } = await buildReportEmail(options);

  if (dryRun) {
    return {
      ok: true,
      dryRun: true,
      sent: false,
      to: message.to,
      subject: message.subject,
      summary,
      attachment: message.attachments[0]?.filename,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('Falta RESEND_API_KEY en el entorno.');

  const idempotencyDate = String(summary.generatedAt || new Date().toISOString()).slice(0, 10);
  const idempotencyRecipients = message.to.join(',').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80);
  const idempotencyKey = options.idempotencyKey || `sarubbi-report-${idempotencyDate}-${idempotencyRecipients}`;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(message),
  });

  const text = await resp.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }

  if (!resp.ok) {
    throw new Error(`Resend devolvio ${resp.status}: ${JSON.stringify(body)}`);
  }

  return {
    ok: true,
    sent: true,
    provider: 'resend',
    id: body.id,
    to: message.to,
    subject: message.subject,
    summary,
  };
}

export async function reportAutomationStatus() {
  const latestPath = resolveLocalPath(process.env.REPORT_DATA_PATH || 'public/data/latest.json');
  const pdfPath = resolveLocalPath(process.env.REPORT_PDF_PATH || 'public/data/latest.pdf');
  const latestJsonLocal = existsSync(latestPath);
  const latestPdfLocal = existsSync(pdfPath);
  const latestJsonUrl = process.env.REPORT_DATA_URL || `${appUrl()}/data/latest.json`;
  const latestPdfUrl = process.env.REPORT_PDF_URL || `${appUrl()}/data/latest.pdf`;
  const [latestJsonRemote, latestPdfRemote] = await Promise.all([
    latestJsonLocal ? Promise.resolve(true) : publicUrlExists(latestJsonUrl),
    latestPdfLocal ? Promise.resolve(true) : publicUrlExists(latestPdfUrl),
  ]);
  const to = validateRecipients(process.env.REPORT_EMAIL_TO, 'REPORT_EMAIL_TO');
  return {
    ok: true,
    schedule: process.env.REPORT_CRON_SCHEDULE || DEFAULT_SCHEDULE,
    timezone: 'UTC',
    appUrl: appUrl(),
    configured: {
      resendApiKey: Boolean(process.env.RESEND_API_KEY),
      from: process.env.REPORT_EMAIL_FROM || DEFAULT_FROM,
      to: to.map(maskEmail),
      cronSecret: Boolean(process.env.CRON_SECRET),
      manualSecret: Boolean(process.env.REPORT_TRIGGER_SECRET || process.env.CRON_SECRET),
    },
    assets: {
      latestJson: Boolean(latestJsonLocal || latestJsonRemote),
      latestPdf: Boolean(latestPdfLocal || latestPdfRemote),
      latestJsonPath: process.env.REPORT_DATA_PATH || 'public/data/latest.json',
      latestPdfPath: process.env.REPORT_PDF_PATH || 'public/data/latest.pdf',
      latestJsonUrl,
      latestPdfUrl,
    },
    endpoints: {
      cron: '/api/cron/daily-report',
      manual: '/api/report/send',
      status: '/api/report/status',
    },
  };
}

async function publicUrlExists(url) {
  try {
    const resp = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    if (resp.ok) return true;
    if (resp.status !== 405) return false;
    const fallback = await fetch(url, { cache: 'no-store' });
    return fallback.ok;
  } catch {
    return false;
  }
}
