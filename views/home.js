// Escapes text before inserting it into HTML
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const endpoints = [
  { method: 'GET', path: '/players', protected: false },
  { method: 'GET', path: '/players/{id}', protected: false },
  { method: 'POST', path: '/players', protected: true },
  { method: 'PUT', path: '/players/{id}', protected: true },
  { method: 'DELETE', path: '/players/{id}', protected: true },
  { method: 'GET', path: '/clubs', protected: false },
  { method: 'GET', path: '/clubs/{id}', protected: false },
  { method: 'POST', path: '/clubs', protected: true },
  { method: 'PUT', path: '/clubs/{id}', protected: true },
  { method: 'DELETE', path: '/clubs/{id}', protected: true }
];

// Builds the home page HTML based on the logged-in user (or null)
const renderHome = (user) => {
  const isLoggedIn = Boolean(user);
  const name = isLoggedIn ? escapeHtml(user.displayName || user.username) : '';
  const username = isLoggedIn ? escapeHtml(user.username) : '';
  const avatar =
    isLoggedIn && user.photos && user.photos.length > 0 ? escapeHtml(user.photos[0].value) : '';

  const statusCard = isLoggedIn
    ? `
      <div class="status status--in">
        ${avatar ? `<img class="avatar" src="${avatar}" alt="${username} avatar">` : ''}
        <div class="status__text">
          <span class="badge badge--in">Logged in</span>
          <p class="status__name">${name}</p>
          <p class="status__user">@${username}</p>
        </div>
        <a class="btn btn--ghost" href="/logout">Logout</a>
      </div>
      <p class="hint">You can now use POST, PUT and DELETE in the API docs.</p>`
    : `
      <div class="status status--out">
        <div class="status__text">
          <span class="badge badge--out">Logged out</span>
          <p class="status__name">Guest</p>
          <p class="status__user">Read-only access (GET routes)</p>
        </div>
        <a class="btn btn--github" href="/login" target="_blank" rel="noopener">
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          Login with GitHub
        </a>
      </div>
      <p class="hint">Login opens in a new tab. After logging in, refresh this page.</p>`;

  const rows = endpoints
    .map(
      (e) => `
        <li class="endpoint">
          <span class="method method--${e.method.toLowerCase()}">${e.method}</span>
          <code>${e.path}</code>
          <span class="access ${e.protected ? 'access--lock' : 'access--open'}">${
            e.protected ? '🔒 <span class="label">Login required</span>' : 'Public'
          }</span>
        </li>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Argentine Football API</title>
  <style>
    :root {
      --celeste: #6cace4;
      --celeste-dark: #2b6ea8;
      --sun: #f6b40e;
      --ink: #14213d;
      --muted: #5b6475;
      --bg: #f4f8fc;
      --card: #ffffff;
      --line: #dde6f0;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.5;
    }
    .hero {
      background: #ffffff;
      border-top: 36px solid var(--celeste);
      border-bottom: 36px solid var(--celeste);
      padding: 32px 16px;
      text-align: center;
    }
    .sun {
      width: 64px; height: 64px; border-radius: 50%;
      background: radial-gradient(circle, var(--sun) 55%, #e39b00 100%);
      box-shadow: 0 0 0 8px rgba(246, 180, 14, 0.25);
      margin: 0 auto 16px;
    }
    .hero h1 {
      margin: 0;
      font-size: clamp(1.8rem, 5vw, 2.8rem);
      color: var(--ink);
      letter-spacing: -0.02em;
    }
    .hero p { margin: 8px 0 0; color: var(--ink); font-weight: 500; }
    .stars { margin-top: 8px; font-size: 1.4rem; letter-spacing: 6px; color: var(--sun); }
    main {
      max-width: 760px;
      margin: 32px auto 48px;
      padding: 0 16px;
      display: grid;
      gap: 20px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 8px 24px rgba(20, 33, 61, 0.06);
    }
    .card h2 { margin: 0 0 16px; font-size: 1.15rem; }
    .status { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .status__text { flex: 1; min-width: 160px; }
    .status__name { margin: 6px 0 0; font-size: 1.2rem; font-weight: 700; }
    .status__user { margin: 0; color: var(--muted); font-size: 0.95rem; }
    .avatar { width: 56px; height: 56px; border-radius: 50%; border: 3px solid var(--celeste); }
    .badge {
      display: inline-block; padding: 2px 10px; border-radius: 999px;
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
    }
    .badge--in { background: #e3f6e8; color: #1c7c3a; }
    .badge--out { background: #fdecec; color: #b42318; }
    .hint { margin: 12px 0 0; color: var(--muted); font-size: 0.9rem; }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 10px;
      font-weight: 600; text-decoration: none; font-size: 0.95rem;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    .btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(20, 33, 61, 0.15); }
    .btn--github { background: #24292f; color: #fff; }
    .btn--ghost { border: 2px solid var(--celeste-dark); color: var(--celeste-dark); }
    .btn--primary { background: var(--celeste-dark); color: #fff; }
    .docs { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .docs p { margin: 0; color: var(--muted); }
    .endpoints { list-style: none; margin: 0; padding: 0; }
    .endpoint {
      display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
      padding: 10px 0; border-bottom: 1px solid var(--line);
    }
    .endpoint:last-child { border-bottom: none; }
    .endpoint code { flex: 1; min-width: 0; font-size: 0.95rem; overflow-wrap: anywhere; }
    .method {
      min-width: 68px; text-align: center; padding: 3px 8px; border-radius: 6px;
      color: #fff; font-size: 0.75rem; font-weight: 700;
    }
    .method--get { background: #2f80ed; }
    .method--post { background: #27ae60; }
    .method--put { background: #e2a300; }
    .method--delete { background: #d64545; }
    .access { font-size: 0.8rem; color: var(--muted); white-space: nowrap; }
    @media (max-width: 480px) {
      .endpoint { gap: 8px; }
      .method { min-width: 58px; }
      .access--lock .label { display: none; }
    }
    .access--lock { color: #8a5a00; }
    footer { text-align: center; color: var(--muted); font-size: 0.85rem; padding-bottom: 32px; }
  </style>
</head>
<body>
  <header class="hero">
    <div class="sun" aria-hidden="true"></div>
    <h1>Argentine Football API</h1>
    <p>Players and clubs of the 2022 World Cup champions</p>
    <div class="stars" aria-label="Three World Cup titles">★★★</div>
  </header>

  <main>
    <section class="card">
      <h2>Account</h2>
      ${statusCard}
    </section>

    <section class="card docs">
      <div>
        <h2>API Documentation</h2>
        <p>Test every route with Swagger UI.</p>
      </div>
      <a class="btn btn--primary" href="/api-docs">Open API Docs →</a>
    </section>

    <section class="card">
      <h2>Endpoints</h2>
      <ul class="endpoints">${rows}
      </ul>
    </section>
  </main>

  <footer>CSE 341 · Web Services · Juan Diego Sebastian Sosa</footer>
</body>
</html>`;
};

module.exports = { renderHome };