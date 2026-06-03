// POST /api/refresh  – triggers the GitHub Actions scrape workflow.
// Token priority: request body.token > GITHUB_TOKEN env var > TRIGGER_TOKEN env var
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Vercel pre-parses JSON bodies into req.body
  const bodyToken = req.body?.token || '';
  const token = bodyToken || process.env.GITHUB_TOKEN || process.env.TRIGGER_TOKEN;
  const repo  = process.env.GITHUB_REPO || 'ignaciocasuriaga-dot/app-sarubbi';

  if (!token) {
    return res.status(401).json({
      ok: false,
      error: 'TOKEN_REQUIRED',
      hint: 'Ingresá tu GitHub token en Configuración.',
    });
  }

  try {
    const resp = await fetch(
      `https://api.github.com/repos/${repo}/actions/workflows/scrape.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ref: 'main' }),
      },
    );

    if (resp.status === 204) {
      return res.status(200).json({ ok: true, message: 'Scrape iniciado. Los precios se actualizan en ~5 minutos.' });
    }

    const text = await resp.text();
    let detail = text;
    try { detail = JSON.parse(text).message || text; } catch (_) {}
    return res.status(resp.status).json({ ok: false, error: `GitHub ${resp.status}: ${detail}` });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
