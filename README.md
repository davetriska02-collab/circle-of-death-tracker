# IT Slowness Tracker

Staff at **Cranleigh Surgery** and **Guildowns Group Practice** keep this open in a browser tab and press **Space** each time EMIS or Accurx freezes. At the end of the session they submit a log. Each session is stored as a closed GitHub Issue for later analysis.

Live app: [https://davetriska02-collab.github.io/circle-of-death-tracker/](https://davetriska02-collab.github.io/circle-of-death-tracker/)

## For staff

1. Open the app and choose **site**, **role**, and **session type**.
2. Press **Start Session**. Last used choices are remembered on this device.
3. When a system freezes, press **Space** (or tap the green button, or `Ctrl+Shift+S`).
4. When it recovers, press **Space** again. Optionally add a note (`N` opens a note on the last incident).
5. Hold **End Session** for two seconds, add any overall notes, and submit.

Do **not** type patient names, dates of birth, NHS numbers, or staff names. The app blocks submissions that look like an NHS number.

A [staff privacy notice](./privacy.html) is linked from the app. Tick **Test run** if you are practising — those sessions are labelled `test` and excluded from analytics by default.

If the network drops, the session is queued on this device and retried the next time a submit succeeds (or when you reopen the app).

## What is stored

One closed GitHub Issue per session, labelled `session`, `site:…`, `role:…`, `sessiontype:…` (and `test` when relevant). The issue body is JSON:

```json
{
  "schemaVersion": 1,
  "sessionId": "2026-05-20T08:14:03.221Z-7f3a",
  "site": "cranleigh",
  "role": "gp",
  "sessionType": "duty",
  "startedAt": "...",
  "endedAt": "...",
  "incidentCount": 4,
  "totalLostSeconds": 187,
  "narrative": "EMIS slow all morning",
  "incidents": [
    { "id": 1, "startedAt": "...", "endedAt": "...", "durationSeconds": 45, "note": "loading patient" }
  ]
}
```

No staff names. No patient identifiers.

## For maintainers

No build step. The site is static HTML/CSS/JS on GitHub Pages.

| Path | Role |
|---|---|
| `index.html` `app.js` `app.css` | Staff app: setup → timer → submit |
| `storage.js` | Worker or direct-PAT submit + offline queue |
| `pii.js` | Shared NHS-number checks |
| `config.json` | Sites, roles, session types, storage mode |
| `admin/` | Config preview, fallback PAT, session list |
| `worker/` | Cloudflare Worker that holds the GitHub PAT |
| `analytics/` | Pull Issues → CSV; retention delete |
| `governance/` | Privacy notice, DPIA, data-sharing agreement |

### Add a surgery

Append to `sites` in `config.json`:

```json
{ "id": "newsite", "label": "New Surgery Name" }
```

### Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/`. Submits still go to the deployed Worker, which only accepts the GitHub Pages origin.

### Tests

```bash
node --test tests/*.test.mjs
```

### Worker

See [`worker/README.md`](worker/README.md). Production URL is already in `config.json`. Rotate the PAT with `wrangler secret put GITHUB_TOKEN` (no redeploy). After changing `worker.js`, deploy from `worker/`:

```bash
wrangler deploy
```

The Worker bundles `pii.js` from the repo root. CORS origin is `https://davetriska02-collab.github.io`.

Fallback (Worker not available): set `"storageMode": "direct-pat"` and save a fine-grained PAT on one admin device via `/admin/`.

### Analytics and retention

```bash
cd analytics
python fetch_sessions.py --token <PAT> --since 2026-05-01 --out ./out/
```

Test runs are skipped unless you pass `--include-tests`.

Sessions are kept for **12 months**. Dry-run then delete older issues:

```bash
python delete_sessions.py --token <PAT> --older-than-days 365 --dry-run
python delete_sessions.py --token <PAT> --older-than-days 365 --site cranleigh
```

### GitHub Pages

Settings → Pages → Source: `main` branch, `/` (root). `.nojekyll` is already in the repo.

## Design constraints

- Plain HTML/CSS/JS — no bundler for the site
- GitHub PAT lives in the Worker, never in the browser (except the documented admin fallback)
- App and Worker reject NHS numbers and the phrase “NHS number”
- Offline queue in `localStorage` if submit fails
