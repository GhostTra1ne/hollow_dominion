import { createServer } from 'node:http';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { mkdirSync, existsSync, readFileSync, writeFileSync, rmSync, createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const ACCOUNTS_DIR = path.join(DATA_DIR, 'accounts');

function loadDotEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf-8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

loadDotEnv();

const PORT = Number(process.env.PORT || 3000);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

mkdirSync(ACCOUNTS_DIR, { recursive: true });

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webm': 'video/webm',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024 * 2) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function getTelegramSecret(botToken) {
  return createHmac('sha256', 'WebAppData').update(botToken).digest();
}

function verifyTelegramInitData(initData) {
  if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }

  const params = new URLSearchParams(initData || '');
  const hash = params.get('hash');
  if (!hash) throw new Error('Missing hash in initData');

  params.delete('hash');
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secret = getTelegramSecret(BOT_TOKEN);
  const computedHash = createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  const hashBuffer = Buffer.from(hash, 'hex');
  const computedBuffer = Buffer.from(computedHash, 'hex');
  if (
    hashBuffer.length !== computedBuffer.length ||
    !timingSafeEqual(hashBuffer, computedBuffer)
  ) {
    throw new Error('Invalid Telegram initData signature');
  }

  const authDate = Number(params.get('auth_date') || '0');
  const now = Math.floor(Date.now() / 1000);
  if (!authDate || Math.abs(now - authDate) > 86400) {
    throw new Error('Telegram initData is too old');
  }

  const userRaw = params.get('user');
  if (!userRaw) throw new Error('Missing Telegram user');

  const user = JSON.parse(userRaw);
  if (!user?.id) throw new Error('Invalid Telegram user payload');

  return {
    user,
    authDate
  };
}

function getSessionSecret() {
  return createHmac('sha256', 'HollowDominionSession').update(BOT_TOKEN).digest();
}

function signSessionToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: String(user.id),
    iat: now,
    exp: now + 60 * 60 * 24 * 30
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || !BOT_TOKEN) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'));
    if (!payload?.sub || !payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function getAccountFile(userId) {
  return path.join(ACCOUNTS_DIR, `${userId}.json`);
}

function readAccountState(userId) {
  const accountFile = getAccountFile(userId);
  if (!existsSync(accountFile)) return null;

  try {
    const payload = JSON.parse(readFileSync(accountFile, 'utf-8'));
    return payload?.state && typeof payload.state === 'object' ? payload.state : null;
  } catch {
    return null;
  }
}

function writeAccountState(userId, state) {
  const accountFile = getAccountFile(userId);
  writeFileSync(accountFile, JSON.stringify({
    updatedAt: new Date().toISOString(),
    state
  }, null, 2), 'utf-8');
}

function deleteAccountState(userId) {
  const accountFile = getAccountFile(userId);
  if (existsSync(accountFile)) {
    rmSync(accountFile, { force: true });
  }
}

function buildPublicAccount(user, authDate) {
  return {
    id: user.id,
    username: user.username || '',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    photoUrl: user.photo_url || '',
    languageCode: user.language_code || '',
    verifiedAt: authDate * 1000
  };
}

function normalizeNickname(value) {
  return String(value || '').trim().toLowerCase();
}

function fallbackHeroId(userId, nickname) {
  const safeNick = normalizeNickname(nickname).replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'hero';
  return `hero-tg-${userId}-${safeNick}`;
}

function getHeroIdentityKey(hero) {
  if (!hero || typeof hero !== 'object') return '';

  const explicitId = String(hero.id || '').trim();
  if (explicitId) return `id:${explicitId}`;

  const ownerId = String(hero.ownerTelegramId || '').trim();
  const nickname = normalizeNickname(hero.nickname);
  if (ownerId && nickname) return `tg:${ownerId}:${nickname}`;
  if (nickname) return `nick:${nickname}`;
  return '';
}

function bindStateToTelegramAccount(userId, state, currentState) {
  if (!state || typeof state !== 'object') {
    throw new Error('Missing state payload');
  }

  const nextState = JSON.parse(JSON.stringify(state));

  if (nextState.account?.provider === 'telegram') {
    nextState.account.telegramId = Number(userId);
  }

  if (currentState?.hero && !nextState.hero) {
    nextState.hero = currentState.hero;
  }

  if (nextState.hero) {
    nextState.hero.ownerTelegramId = String(userId);
    if (!nextState.hero.id) {
      nextState.hero.id = currentState?.hero?.id || fallbackHeroId(userId, nextState.hero.nickname);
    }
  }

  if (currentState?.hero && nextState.hero) {
    const currentHeroKey = getHeroIdentityKey(currentState.hero);
    const nextHeroKey = getHeroIdentityKey(nextState.hero);
    if (currentHeroKey && nextHeroKey && currentHeroKey !== nextHeroKey) {
      const error = new Error('This Telegram account already has a character');
      error.code = 'CHARACTER_EXISTS';
      error.state = currentState;
      throw error;
    }
  }

  return nextState;
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return '';
  return header.slice('Bearer '.length).trim();
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/auth/telegram' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const verified = verifyTelegramInitData(body.initData);
      const account = buildPublicAccount(verified.user, verified.authDate);
      const sessionToken = signSessionToken(verified.user);
      const state = readAccountState(verified.user.id);
      sendJson(res, 200, { ok: true, account, sessionToken, state });
    } catch (error) {
      sendJson(res, 401, { ok: false, error: error.message });
    }
    return true;
  }

  if (pathname === '/api/state') {
    const payload = verifySessionToken(getBearerToken(req));
    if (!payload) {
      sendJson(res, 401, { ok: false, error: 'Invalid session token' });
      return true;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, { ok: true, state: readAccountState(payload.sub) });
      return true;
    }

    if (req.method === 'PUT') {
      try {
        const body = await readJsonBody(req);
        const currentState = readAccountState(payload.sub);
        const nextState = bindStateToTelegramAccount(payload.sub, body.state, currentState);
        writeAccountState(payload.sub, nextState);
        sendJson(res, 200, { ok: true, state: nextState });
      } catch (error) {
        if (error?.code === 'CHARACTER_EXISTS') {
          sendJson(res, 409, { ok: false, error: error.message, state: error.state });
          return true;
        }
        sendJson(res, 400, { ok: false, error: error.message });
      }
      return true;
    }

    if (req.method === 'DELETE') {
      deleteAccountState(payload.sub);
      sendJson(res, 200, { ok: true });
      return true;
    }

    sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    return true;
  }

  return false;
}

function serveStatic(req, res, pathname) {
  let relativePath = pathname === '/' ? '/index.html' : pathname;
  relativePath = decodeURIComponent(relativePath);

  const filePath = path.resolve(ROOT_DIR, `.${relativePath}`);
  if (!filePath.startsWith(ROOT_DIR)) {
    sendJson(res, 403, { ok: false, error: 'Forbidden' });
    return;
  }

  if (!existsSync(filePath)) {
    sendJson(res, 404, { ok: false, error: 'Not found' });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=3600'
  });
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (await handleApi(req, res, url.pathname)) {
      return;
    }
    serveStatic(req, res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Hollow Dominion auth server is listening on http://localhost:${PORT}`);
});
