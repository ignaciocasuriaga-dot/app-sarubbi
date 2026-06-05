// POST /api/refresh - triggers the GitHub Actions scrape workflow.
// Token priority: request body.token > GITHUB_TOKEN env var > TRIGGER_TOKEN env var.

function workflowStatus(run) {
  if (!run) return null;
  return {
    status: run.status,
    conclusion: run.conclusion,
    createdAt: run.created_at,
    startedAt: run.run_started_at || run.created_at,
    updatedAt: run.updated_at,
    runId: run.id,
    runNumber: run.run_number,
    url: run.html_url,
    progress: {
      phase: 'github',
      status: run.status,
      message: run.status === 'queued'
        ? 'Esperando runner de GitHub Actions'
        : run.status === 'in_progress'
          ? 'Workflow de GitHub Actions en ejecucion'
          : 'Workflow finalizado',
    },
  };
}

async function latestWorkflowRun(token, repo) {
  const resp = await fetch(
    `https://api.github.com/repos/${repo}/actions/workflows/scrape.yml/runs?per_page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  if (!resp.ok) return null;
  const data = await resp.json();
  return data.workflow_runs?.[0] || null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const bodyToken = req.body?.token || '';
  const token = bodyToken || process.env.GITHUB_TOKEN || process.env.TRIGGER_TOKEN;
  const repo = process.env.GITHUB_REPO || 'ignaciocasuriaga-dot/app-sarubbi';

  if (!token) {
    return res.status(200).json({
      ok: true,
      status: 'unavailable',
      configured: false,
      error: 'TOKEN_REQUIRED',
      hint: 'Ingresa tu GitHub token en Configuracion.',
    });
  }

  try {
    const currentRun = await latestWorkflowRun(token, repo);
    if (currentRun && currentRun.status !== 'completed') {
      return res.status(202).json({
        ok: true,
        message: 'Ya hay un relevamiento en curso.',
        ...workflowStatus(currentRun),
      });
    }

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
      return res.status(202).json({
        ok: true,
        status: 'queued',
        startedAt: new Date().toISOString(),
        message: 'Scrape iniciado. Los precios se actualizan en unos minutos.',
        progress: {
          phase: 'github',
          status: 'queued',
          message: 'Workflow de GitHub Actions disparado',
        },
      });
    }

    const text = await resp.text();
    let detail = text;
    try { detail = JSON.parse(text).message || text; } catch (_) {}
    return res.status(resp.status).json({ ok: false, error: `GitHub ${resp.status}: ${detail}` });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
