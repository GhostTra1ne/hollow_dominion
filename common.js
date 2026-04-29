const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready?.();
  tg.disableVerticalSwipes?.();
}

function detectRuntimeEnvironment() {
  const ua = navigator.userAgent || '';
  const width = window.innerWidth || document.documentElement.clientWidth || 0;
  const isTelegram = Boolean(tg);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isDesktopPlatform = !isIOS && !isAndroid;
  const isTelegramDesktopRuntime = isTelegram && isDesktopPlatform;
  const isMobile = isIOS || isAndroid || (!isTelegramDesktopRuntime && width <= 767);
  const isDesktop = !isMobile;
  return {
    isTelegram,
    isBrowser: !isTelegram,
    isIOS,
    isAndroid,
    isDesktopPlatform,
    isTelegramDesktopRuntime,
    isMobile,
    isDesktop
  };
}

function applyRuntimeEnvironment() {
  const env = detectRuntimeEnvironment();
  const body = document.body;
  const root = document.documentElement;
  if (!body) return env;

  body.classList.toggle('env-telegram', env.isTelegram);
  body.classList.toggle('env-browser', env.isBrowser);
  body.classList.toggle('device-mobile', env.isMobile);
  body.classList.toggle('device-desktop', env.isDesktop);
  body.classList.toggle('platform-ios', env.isIOS);
  body.classList.toggle('platform-android', env.isAndroid);
  body.classList.toggle('platform-desktop-runtime', env.isDesktopPlatform);

  root.style.setProperty('--runtime-width', `${window.innerWidth || 0}px`);
  root.style.setProperty('--runtime-height', `${window.innerHeight || 0}px`);
  root.style.setProperty('--grid-col-width', `${((window.innerWidth || 0) / 12) || 0}px`);
  root.style.setProperty('--grid-row-height', '40px');
  root.dataset.env = env.isTelegram ? 'telegram' : 'browser';
  root.dataset.device = env.isMobile ? 'mobile' : 'desktop';
  root.dataset.platform = env.isIOS ? 'ios' : env.isAndroid ? 'android' : 'other';

  return env;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyAdaptiveViewportMetrics() {
  const env = detectRuntimeEnvironment();
  const body = document.body;
  const root = document.documentElement;
  if (!body) return env;

  const vw = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
  const vh = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0);
  const isShort = vh <= 760;
  const isTall = vh >= 860;
  const isTelegramCompactDesktop = env.isTelegramDesktopRuntime && vw <= 500;

  body.classList.toggle('viewport-short', isShort);
  body.classList.toggle('viewport-tall', isTall);
  body.classList.toggle('viewport-normal', !isShort && !isTall);
  body.classList.toggle('viewport-compact-desktop', isTelegramCompactDesktop);

  root.style.setProperty('--viewport-width', `${vw}px`);
  root.style.setProperty('--viewport-height', `${vh}px`);

  let hudBottom = null;
  let profileBottom = null;

  if (isTelegramCompactDesktop) {
    const compactReferenceHeight = 592;
    const compactScale = clamp(vh / compactReferenceHeight, 0.92, 1.08);
    hudBottom = Math.round(95 * compactScale);
    profileBottom = Math.round(146 * compactScale);
  } else if (env.isMobile) {
    if (env.isTelegram && env.isIOS) {
      hudBottom = isShort ? clamp(Math.round(vh * 0.165), 116, 142) : clamp(Math.round(vh * 0.18), 132, 168);
      profileBottom = isShort ? clamp(Math.round(vh * 0.265), 184, 214) : clamp(Math.round(vh * 0.295), 208, 244);
    } else if (env.isTelegram && env.isAndroid) {
      hudBottom = isShort ? clamp(Math.round(vh * 0.16), 108, 136) : clamp(Math.round(vh * 0.175), 122, 156);
      profileBottom = isShort ? clamp(Math.round(vh * 0.255), 172, 204) : clamp(Math.round(vh * 0.285), 196, 234);
    } else {
      hudBottom = isShort ? clamp(Math.round(vh * 0.155), 102, 132) : clamp(Math.round(vh * 0.17), 118, 148);
      profileBottom = isShort ? clamp(Math.round(vh * 0.25), 168, 198) : clamp(Math.round(vh * 0.28), 190, 226);
    }
  } else {
    if (env.isTelegram) {
      hudBottom = isShort
        ? clamp(Math.round(vh * 0.14), 120, 168)
        : clamp(Math.round(vh * 0.155), 138, 196);
      profileBottom = isShort
        ? clamp(Math.round(vh * 0.29), 228, 308)
        : clamp(Math.round(vh * 0.315), 248, 356);
    } else {
      hudBottom = isShort
        ? clamp(Math.round(vh * 0.135), 116, 164)
        : clamp(Math.round(vh * 0.15), 132, 188);
      profileBottom = isShort
        ? clamp(Math.round(vh * 0.285), 220, 300)
        : clamp(Math.round(vh * 0.31), 242, 348);
    }
  }

  if (hudBottom !== null && profileBottom !== null) {
    root.style.setProperty('--auto-hd-hud-bottom', `${hudBottom}px`);
    root.style.setProperty('--auto-hd-profile-bottom', `${profileBottom}px`);
  } else {
    root.style.removeProperty('--auto-hd-hud-bottom');
    root.style.removeProperty('--auto-hd-profile-bottom');
  }

  return env;
}

function syncRuntimeViewport() {
  applyRuntimeEnvironment();
  applyAdaptiveViewportMetrics();
}

syncRuntimeViewport();
window.addEventListener('resize', syncRuntimeViewport, {passive: true});
window.addEventListener('orientationchange', syncRuntimeViewport, {passive: true});

const STORAGE_STATE = 'hd_split_fixed_v1';
const STORAGE_TAKEN_NICKS = 'hd_taken_nicks_split_fixed_v1';
const AUTH_API_BASE = (() => {
  if (!window.location) return '';
  if (!/^https?:$/i.test(window.location.protocol)) return '';
  return `${window.location.origin}/api`;
})();
const FALLBACK_CHARACTER = './assets/characters/human/male';
const CREATE_BG_DEFAULT = './assets/backgrounds/create_bg.jpg';
const TELEGRAM_AUTH_PROVIDER = 'telegram';

const hdAuthState = {
  status: 'guest',
  sessionToken: '',
  account: null
};

let bootstrapStatePromise = null;
let remoteStateSyncTimer = null;
let remoteStateSyncPending = null;
let remoteStateSyncInFlight = Promise.resolve();

window.HD_AUTH = hdAuthState;

const steps = [
  {key: 'race', label: 'Раса'},
  {key: 'classId', label: 'Класс'},
  {key: 'gender', label: 'Пол'},
  {key: 'face', label: 'Лицо'},
  {key: 'nickname', label: 'Никнейм'}
];

const races = [
  {id: 'human', name: 'Человек'},
  {id: 'elf', name: 'Эльф'},
  {id: 'dark_elf', name: 'Тёмный эльф'},
  {id: 'orc', name: 'Орк'},
  {id: 'dwarf', name: 'Гном'}
];

const classes = [
  {id: 'warrior', name: 'Воин'},
  {id: 'mage', name: 'Маг'}
];

const genders = [
  {id: 'male', name: 'Мужчина'},
  {id: 'female', name: 'Женщина'}
];

const faces = ['01', '02', '03', '04', '05', '06'];

const HERO_BASE_PROFILE_VERSION = 2;

const heroBaseProfiles = {
  dark_elf_warrior: {
    label: 'Dark Fighter',
    primary: {str: 41, con: 32, dex: 34, int: 25, men: 26, wit: 12},
    combat: {maxHp: 107, maxMp: 39, pAtk: 4, pDef: 72, mAtk: 3, mDef: 47, atkSpd: 342, castSpd: 226, accuracy: 35, critical: 45, evasion: 35, speed: 139, weightLimit: 69000}
  },
  dark_elf_mage: {
    label: 'Dark Mystic',
    primary: {str: 23, con: 24, dex: 23, int: 44, men: 37, wit: 19},
    combat: {maxHp: 95, maxMp: 58, pAtk: 2, pDef: 48, mAtk: 7, mDef: 53, atkSpd: 309, castSpd: 316, accuracy: 29, critical: 41, evasion: 29, speed: 125, weightLimit: 61000}
  },
  elf_warrior: {
    label: 'Elf Fighter',
    primary: {str: 36, con: 36, dex: 35, int: 23, men: 26, wit: 14},
    combat: {maxHp: 113, maxMp: 39, pAtk: 4, pDef: 72, mAtk: 3, mDef: 47, atkSpd: 345, castSpd: 249, accuracy: 36, critical: 46, evasion: 36, speed: 143, weightLimit: 73000}
  },
  elf_mage: {
    label: 'Elf Mystic',
    primary: {str: 21, con: 25, dex: 24, int: 37, men: 40, wit: 23},
    combat: {maxHp: 96, maxMp: 59, pAtk: 2, pDef: 48, mAtk: 6, mDef: 54, atkSpd: 312, castSpd: 386, accuracy: 30, critical: 41, evasion: 30, speed: 126, weightLimit: 62000}
  },
  orc_warrior: {
    label: 'Orc Fighter',
    primary: {str: 40, con: 47, dex: 26, int: 18, men: 27, wit: 12},
    combat: {maxHp: 133, maxMp: 39, pAtk: 4, pDef: 72, mAtk: 2, mDef: 48, atkSpd: 318, castSpd: 226, accuracy: 31, critical: 42, evasion: 31, speed: 124, weightLimit: 87000}
  },
  orc_mage: {
    label: 'Orc Mystic',
    primary: {str: 27, con: 31, dex: 24, int: 31, men: 42, wit: 15},
    combat: {maxHp: 105, maxMp: 60, pAtk: 2, pDef: 48, mAtk: 4, mDef: 56, atkSpd: 312, castSpd: 265, accuracy: 30, critical: 41, evasion: 30, speed: 125, weightLimit: 68000}
  },
  dwarf_warrior: {
    label: 'Dwarven Fighter',
    primary: {str: 39, con: 45, dex: 29, int: 20, men: 27, wit: 10},
    combat: {maxHp: 129, maxMp: 39, pAtk: 4, pDef: 72, mAtk: 3, mDef: 48, atkSpd: 327, castSpd: 316, accuracy: 29, critical: 43, evasion: 33, speed: 125, weightLimit: 83000}
  },
  human_warrior: {
    label: 'Human Fighter',
    primary: {str: 40, con: 43, dex: 30, int: 21, men: 25, wit: 11},
    combat: {maxHp: 126, maxMp: 38, pAtk: 4, pDef: 72, mAtk: 3, mDef: 47, atkSpd: 330, castSpd: 213, accuracy: 33, critical: 44, evasion: 33, speed: 126, weightLimit: 81900}
  },
  human_mage: {
    label: 'Human Mystic',
    primary: {str: 22, con: 27, dex: 21, int: 41, men: 39, wit: 20},
    combat: {maxHp: 99, maxMp: 59, pAtk: 2, pDef: 48, mAtk: 7, mDef: 54, atkSpd: 303, castSpd: 333, accuracy: 28, critical: 40, evasion: 28, speed: 121, weightLimit: 62500}
  }
};

function deriveBaseCp(maxHp) {
  return Math.max(0, Math.round(Number(maxHp || 0) * 0.26));
}

function resolveHeroBaseProfile(race, classId) {
  const exactKey = `${race}_${classId}`;
  const fallbackByRace = `${race}_warrior`;
  const fallbackByClass = classId === 'mage' ? 'human_mage' : 'human_warrior';
  const profile = heroBaseProfiles[exactKey] || heroBaseProfiles[fallbackByRace] || heroBaseProfiles[fallbackByClass] || heroBaseProfiles.human_warrior;
  return clone(profile);
}

function applyHeroBaseProfile(hero, creator) {
  if (!hero || !creator) return false;

  const profile = resolveHeroBaseProfile(creator.race, creator.classId);
  const nextPrimary = {...profile.primary};
  const nextCombat = {
    ...profile.combat,
    maxCp: deriveBaseCp(profile.combat.maxHp),
    mCritical: Number(profile.combat.mCritical || 0)
  };

  let changed = false;

  if (JSON.stringify(hero.basePrimary || {}) !== JSON.stringify(nextPrimary)) {
    hero.basePrimary = nextPrimary;
    changed = true;
  }

  if (JSON.stringify(hero.baseCombat || {}) !== JSON.stringify(nextCombat)) {
    hero.baseCombat = nextCombat;
    changed = true;
  }

  if (hero.baseProfileLabel !== profile.label) {
    hero.baseProfileLabel = profile.label;
    changed = true;
  }

  if (hero.baseProfileVersion !== HERO_BASE_PROFILE_VERSION) {
    hero.baseProfileVersion = HERO_BASE_PROFILE_VERSION;
    changed = true;
  }

  Object.entries(nextPrimary).forEach(([key, value]) => {
    if (hero[key] !== value) {
      hero[key] = value;
      changed = true;
    }
  });

  return changed;
}

const cities = {
  start_village: {
    id: 'start_village',
    name: 'Стартовая деревня',
    sceneBg: './assets/backgrounds/cities/start_village/scene.jpg',
    portraitBg: './assets/backgrounds/cities/start_village/portrait.png',
    mapBg: './assets/maps/cities/start_village/map.jpg',
    marketBg: './assets/locations/market/market_preview.jpg',
    teleportDestinations: [
      {cityId: 'lyon', cost: 18, text: 'Быстрый переход в Лион.'},
      {cityId: 'ravenford', cost: 26, text: 'Переход в Рейвенфорд.'}
    ],
    walkingRoutes: [
      {cityId: 'lyon', durationMin: 30, risk: 0.35, text: 'Соседний город на дороге.'},
      {cityId: 'ravenford', durationMin: 55, risk: 0.45, text: 'Дальний маршрут по тракту.'}
    ],
    mapPoints: [
      {id: 'blacksmith', name: 'Оружейник', hint: 'Мечи и броня', x: 12, y: 24},
      {id: 'market', name: 'Рынок', hint: 'Торговая площадь', x: 62, y: 40},
      {id: 'teleport', name: 'Телепорт', hint: 'Магический круг', x: 72, y: 18},
      {id: 'chat', name: 'Площадь', hint: 'Общий чат', x: 48, y: 66}
    ]
  },
  lyon: {
    id: 'lyon',
    name: 'Лион',
    sceneBg: './assets/backgrounds/cities/lyon/scene.jpg',
    portraitBg: './assets/backgrounds/cities/lyon/portrait.jpg',
    mapBg: './assets/maps/cities/lyon/map.jpg',
    marketBg: './assets/locations/market/market_preview.jpg',
    teleportDestinations: [
      {cityId: 'start_village', cost: 18, text: 'Вернуться в деревню.'},
      {cityId: 'ravenford', cost: 16, text: 'Переход в крепость.'}
    ],
    walkingRoutes: [
      {cityId: 'start_village', durationMin: 30, risk: 0.30, text: 'Дорога обратно к берегу.'},
      {cityId: 'ravenford', durationMin: 35, risk: 0.40, text: 'Тракт под присмотром.'}
    ],
    mapPoints: [
      {id: 'blacksmith', name: 'Оружейник', hint: 'Мастерские Лиона', x: 18, y: 28},
      {id: 'market', name: 'Рынок', hint: 'Караванная площадь', x: 58, y: 42},
      {id: 'teleport', name: 'Телепорт', hint: 'Магический круг', x: 78, y: 20},
      {id: 'chat', name: 'Центр', hint: 'Площадь города', x: 46, y: 64}
    ]
  },
  ravenford: {
    id: 'ravenford',
    name: 'Рейвенфорд',
    sceneBg: './assets/backgrounds/cities/ravenford/scene.jpg',
    portraitBg: './assets/backgrounds/cities/ravenford/portrait.jpg',
    mapBg: './assets/maps/cities/ravenford/map.jpg',
    marketBg: './assets/locations/market/market_preview.jpg',
    teleportDestinations: [
      {cityId: 'lyon', cost: 16, text: 'Вернуться в Лион.'},
      {cityId: 'start_village', cost: 26, text: 'Путь обратно к морю.'}
    ],
    walkingRoutes: [
      {cityId: 'lyon', durationMin: 35, risk: 0.40, text: 'Дорога вдоль тракта.'},
      {cityId: 'start_village', durationMin: 55, risk: 0.50, text: 'Дальний маршрут.'}
    ],
    mapPoints: [
      {id: 'blacksmith', name: 'Кузня', hint: 'Военное снаряжение', x: 20, y: 34},
      {id: 'market', name: 'Рынок', hint: 'Грузы и припасы', x: 54, y: 36},
      {id: 'teleport', name: 'Телепорт', hint: 'Башня рун', x: 80, y: 18},
      {id: 'chat', name: 'Плац', hint: 'Городской чат', x: 48, y: 68}
    ]
  }
};

const marketItems = [
  {name: 'Железный меч', type: 'weapon', city: 'start_village', price: 42, seller: 'Кузнец Бром', desc: 'Надёжный клинок для первых боёв.'},
  {name: 'Кожаный доспех', type: 'armor', city: 'start_village', price: 36, seller: 'Лавка щитов', desc: 'Лёгкая броня для дороги.'},
  {name: 'Зелье лечения', type: 'consumable', city: 'start_village', price: 9, seller: 'Травница Мира', desc: 'Небольшое восстановление сил.'},
  {name: 'Лук охотника', type: 'weapon', city: 'lyon', price: 58, seller: 'Лионская мастерская', desc: 'Точный лук для дальнего боя.'}
];

const stateDefault = {
  creator: {race: 'human', classId: 'warrior', gender: 'male', face: '01', nickname: ''},
  stepIndex: 0,
  hero: null,
  account: null,
  activeMapPointId: 'blacksmith',
  activeRouteCityId: 'lyon',
  marketQuery: '',
  marketType: 'all',
  travel: null,
  chatMessages: [{from: 'Система', text: 'Добро пожаловать в Hollow Dominion.'}]
};

const bottomNavItems = [
  {id: 'inventory', href: 'inventory.html', icon: './assets/ui/menu/bag.png', label: 'Инвентарь'},
  {id: 'profile', href: 'index.html', icon: './assets/ui/menu/profile.png', label: 'Профиль'},
  {id: 'status', href: 'status.html', icon: './assets/ui/menu/status.png', label: 'Статус'},
  {id: 'clan', href: 'clan.html', icon: './assets/ui/menu/clan.png', label: 'Клан'},
  {id: 'map', href: 'map.html', icon: './assets/ui/menu/map.png', label: 'Карта'},
  {id: 'chat', href: 'chat.html', icon: './assets/ui/menu/chat.png', label: 'Чат'}
];

const bottomNavPsdItems = [
  {id: 'profile', href: 'index.html', label: 'Персонаж', asset: 'profile', x: 24, y: 19, w: 131, h: 178},
  {id: 'inventory', href: 'inventory.html', label: 'Инвентарь', asset: 'inventory', x: 164, y: 20, w: 131, h: 177},
  {id: 'map', href: 'map.html', label: 'Карта', asset: 'map', x: 304, y: 18, w: 131, h: 178},
  {id: 'journey', href: 'journey.html', label: 'Бои', asset: 'fight', x: 428, y: 18, w: 124, h: 179},
  {id: 'clan', href: 'clan.html', label: 'Клан', asset: 'clan', x: 552, y: 19, w: 125, h: 177},
  {id: 'quest', href: '', label: 'Квесты', asset: 'quest', x: 684, y: 21, w: 126, h: 178, disabled: true},
  {id: 'status', href: 'status.html', label: 'Статус', asset: 'status', x: 819, y: 21, w: 129, h: 178},
  {id: 'chat', href: 'chat.html', label: 'Чат', asset: 'chat', x: 957, y: 19, w: 124, h: 178}
];

function withAppParams(href) {
  try {
    const url = new URL(href, window.location.href);
    if (window.__HD_APP_VERSION__) {
      url.searchParams.set('appv', window.__HD_APP_VERSION__);
    }
    const current = new URL(window.location.href);
    if (current.searchParams.get('grid') === '1') {
      url.searchParams.set('grid', '1');
    } else {
      url.searchParams.delete('grid');
    }
    return `${url.pathname.split('/').pop()}${url.search}`;
  } catch {
    return href;
  }
}

function withAssetVersion(path) {
  const version = window.__HD_APP_VERSION__;
  return version ? `${path}?v=${encodeURIComponent(version)}` : path;
}

function q(id) { return document.getElementById(id); }
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

function hydrateState(parsed) {
  if (!parsed || typeof parsed !== 'object') return clone(stateDefault);
  return {
    ...clone(stateDefault),
    ...parsed,
    creator: {...clone(stateDefault.creator), ...(parsed.creator || {})}
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_STATE);
    if (!raw) return clone(stateDefault);
    return hydrateState(JSON.parse(raw));
  } catch {
    return clone(stateDefault);
  }
}

function saveLocalState(state) {
  localStorage.setItem(STORAGE_STATE, JSON.stringify(state));
}

function saveState(state, options = {}) {
  saveLocalState(state);
  scheduleRemoteStateSync(state, options);
}

function hasTelegramInitData() {
  return Boolean(tg?.initData);
}

function canUseTelegramAuthApi() {
  return Boolean(AUTH_API_BASE && hasTelegramInitData());
}

function buildTelegramAccount(account) {
  if (!account?.id) return null;
  return {
    provider: TELEGRAM_AUTH_PROVIDER,
    telegramId: account.id,
    username: account.username || '',
    firstName: account.firstName || '',
    lastName: account.lastName || '',
    photoUrl: account.photoUrl || '',
    languageCode: account.languageCode || '',
    verifiedAt: account.verifiedAt || Date.now()
  };
}

function createHeroId(accountId = '', nickname = '') {
  const safeAccount = String(accountId || 'local');
  const safeNick = nicknameKey(nickname).replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'hero';
  const randomPart = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `hero-${safeAccount}-${safeNick}-${randomPart}`;
}

function assignHeroAccountIdentity(state) {
  if (!state?.hero) return false;

  const ownerTelegramId = String(state.account?.telegramId || state.hero.ownerTelegramId || '');
  let changed = false;

  if (ownerTelegramId && String(state.hero.ownerTelegramId || '') !== ownerTelegramId) {
    state.hero.ownerTelegramId = ownerTelegramId;
    changed = true;
  }

  if (!state.hero.id) {
    state.hero.id = createHeroId(ownerTelegramId || 'local', state.hero.nickname || state.creator?.nickname || '');
    changed = true;
  }

  return changed;
}

async function authenticateTelegramAccount() {
  if (!canUseTelegramAuthApi()) return null;

  const response = await fetch(`${AUTH_API_BASE}/auth/telegram`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({initData: tg.initData})
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Telegram auth failed with ${response.status}`);
  }

  return response.json();
}

async function pushRemoteStateNow(state) {
  if (!hdAuthState.sessionToken || !AUTH_API_BASE) return;

  const snapshot = clone(state);
  const response = await fetch(`${AUTH_API_BASE}/state`, {
    method: 'PUT',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hdAuthState.sessionToken}`
    },
    body: JSON.stringify({state: snapshot})
  });

  if (response.status === 409) {
    let payload = null;
    try {
      payload = await response.json();
    } catch {}

    if (payload?.state && typeof payload.state === 'object') {
      const remoteState = hydrateState(payload.state);
      saveLocalState(remoteState);
      window.dispatchEvent(new CustomEvent('hd:remote-state-replaced', {
        detail: {reason: 'character-conflict', state: remoteState}
      }));
    }

    throw new Error(payload?.error || 'This Telegram account already has a character');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Remote state sync failed with ${response.status}`);
  }
}

function flushRemoteStateSync() {
  if (!remoteStateSyncPending) return remoteStateSyncInFlight;

  const snapshot = remoteStateSyncPending;
  remoteStateSyncPending = null;
  remoteStateSyncInFlight = remoteStateSyncInFlight
    .catch(() => {})
    .then(() => pushRemoteStateNow(snapshot))
    .catch((error) => {
      console.warn('Remote state sync failed:', error);
    });

  return remoteStateSyncInFlight;
}

function scheduleRemoteStateSync(state, options = {}) {
  if (!hdAuthState.sessionToken) return;

  remoteStateSyncPending = clone(state);
  if (remoteStateSyncTimer) {
    clearTimeout(remoteStateSyncTimer);
    remoteStateSyncTimer = null;
  }

  if (options.immediate) {
    flushRemoteStateSync();
    return;
  }

  remoteStateSyncTimer = window.setTimeout(() => {
    remoteStateSyncTimer = null;
    flushRemoteStateSync();
  }, 140);
}

async function clearSavedState() {
  localStorage.removeItem(STORAGE_STATE);

  if (hdAuthState.sessionToken && AUTH_API_BASE) {
    try {
      await fetch(`${AUTH_API_BASE}/state`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${hdAuthState.sessionToken}`
        }
      });
    } catch (error) {
      console.warn('Remote state delete failed:', error);
    }
  }
}

async function bootstrapAppState() {
  if (bootstrapStatePromise) return bootstrapStatePromise;

  bootstrapStatePromise = (async () => {
    let state = loadState();

    if (!canUseTelegramAuthApi()) {
      hdAuthState.status = hasTelegramInitData() ? 'local-telegram' : 'guest';
      return state;
    }

    try {
      const auth = await authenticateTelegramAccount();
      const account = buildTelegramAccount(auth.account);

      hdAuthState.status = 'authenticated';
      hdAuthState.sessionToken = auth.sessionToken || '';
      hdAuthState.account = account;

      if (
        state.account?.provider === TELEGRAM_AUTH_PROVIDER &&
        String(state.account.telegramId || '') !== String(account?.telegramId || '')
      ) {
        state = clone(stateDefault);
      }

      if (auth.state && typeof auth.state === 'object') {
        state = hydrateState(auth.state);
      }

      if (account) {
        state.account = account;
      }

      const heroIdentityChanged = assignHeroAccountIdentity(state);

      saveLocalState(state);

      if (
        heroIdentityChanged ||
        (!auth.state && (state.hero || normalizeNickname(state.creator.nickname)))
      ) {
        scheduleRemoteStateSync(state, {immediate: true});
      }

      return state;
    } catch (error) {
      hdAuthState.status = 'fallback-local';
      console.warn('Telegram auth bootstrap fallback:', error);
      return state;
    }
  })();

  return bootstrapStatePromise;
}

window.HD_BOOTSTRAP_APP_STATE = bootstrapAppState;
window.HD_CLEAR_SAVED_STATE = clearSavedState;
window.addEventListener('hd:remote-state-replaced', () => {
  window.location.reload();
});
window.addEventListener('pagehide', () => {
  flushRemoteStateSync();
});
function normalizeNickname(v) { return (v || '').trim(); }
function nicknameKey(v) { return normalizeNickname(v).toLowerCase(); }

function getTakenNicknames() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_TAKEN_NICKS) || '[]');
  } catch {
    return [];
  }
}

function saveTakenNicknames(list) { localStorage.setItem(STORAGE_TAKEN_NICKS, JSON.stringify(list)); }

function reserveNickname(nickname) {
  const taken = getTakenNicknames();
  const key = nicknameKey(nickname);
  if (!taken.includes(key)) {
    taken.push(key);
    saveTakenNicknames(taken);
  }
}

function releaseNickname(nickname) {
  const key = nicknameKey(nickname);
  saveTakenNicknames(getTakenNicknames().filter((x) => x !== key));
}

function validateNickname(state, value) {
  const nickname = normalizeNickname(value);
  if (!nickname) return 'Введите никнейм.';
  if (nickname.length < 3) return 'Ник должен быть не короче 3 символов.';
  if (nickname.length > 16) return 'Ник не должен быть длиннее 16 символов.';
  if (!/^[A-Za-zА-Яа-яЁё0-9_]+$/.test(nickname)) return 'Разрешены буквы, цифры и знак _.';
  const taken = getTakenNicknames();
  const key = nicknameKey(nickname);
  const currentNick = state.hero ? nicknameKey(state.hero.nickname) : null;
  if (taken.includes(key) && currentNick !== key) return 'Этот ник уже занят.';
  return '';
}

function getRaceName(id) { return races.find((r) => r.id === id)?.name || '—'; }
function getClassName(id) { return classes.find((c) => c.id === id)?.name || '—'; }
function getGenderName(id) { return genders.find((g) => g.id === id)?.name || '—'; }
function escapeHtml(str) { return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }

function cycleArray(arr, currentId, direction) {
  const index = arr.findIndex((item) => item.id === currentId || item === currentId);
  const nextIndex = (index + direction + arr.length) % arr.length;
  return arr[nextIndex];
}

function getCurrentCity(state) { return cities[state.hero?.cityId || 'start_village']; }

function safeSetCandidates(imgEl, candidates) {
  let i = 0;
  imgEl.style.display = 'block';

  function tryNext() {
    if (i >= candidates.length) {
      imgEl.style.display = 'none';
      imgEl.removeAttribute('src');
      imgEl.onerror = null;
      imgEl.onload = null;
      return;
    }
    const src = candidates[i++];
    imgEl.onerror = tryNext;
    imgEl.onload = () => {
      imgEl.style.display = 'block';
      imgEl.onerror = null;
      imgEl.onload = null;
    };
    imgEl.src = src;
  }

  tryNext();
}

function safeSetBackground(el, candidates, fallback = 'none') {
  let i = 0;

  function tryNext() {
    if (i >= candidates.length) {
      el.style.backgroundImage = fallback;
      return;
    }
    const url = candidates[i++];
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${url}")`; };
    img.onerror = tryNext;
    img.src = url;
  }

  tryNext();
}

function buildBases(race, gender) { return [`./assets/characters/${race}/${gender}`, FALLBACK_CHARACTER]; }
function getSlot(root, slot) { return root.querySelector(`[data-slot="${slot}"]`); }

function toCharacterEquipmentSlug(itemName) {
  const normalized = normalizeInventoryItemName(itemName);
  if (!normalized || normalized === 'пусто') return '';
  return normalized
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

function getEquippedPaperdollMap(config) {
  const equipped = {};
  if (!Array.isArray(config?.inventory)) return equipped;
  config.inventory
    .filter(isInventoryEntryEquipped)
    .forEach((entry) => {
      const slotKey = entry?.equipSlot || entry?.equipFamily;
      const rawItemName = parseInventoryStackItem(entry?.item)?.baseName || entry?.item || '';
      const slug = toCharacterEquipmentSlug(rawItemName);
      if (!slotKey || !slug) return;
      equipped[slotKey] = { name: rawItemName, slug };
    });
  return equipped;
}

function buildEquipmentLayerCandidates(bases, equipped, slotKeys, partName) {
  const candidates = [];
  slotKeys.forEach((slotKey) => {
    const equippedItem = equipped[slotKey];
    if (!equippedItem?.slug) return;
    bases.forEach((basePath) => {
      candidates.push(`${basePath}/equipment/${equippedItem.slug}/${partName}.png`);
    });
  });
  return candidates;
}

function setPreview(root, config) {
  const bases = buildBases(config.race, config.gender);
  const equipped = getEquippedPaperdollMap(config);
  const classBases = bases.map((p) => `${p}/class_preview/${config.classId}`);
  safeSetCandidates(getSlot(root, 'legL'), bases.map((p) => `${p}/base/leg_l.png`));
  safeSetCandidates(getSlot(root, 'legR'), bases.map((p) => `${p}/base/leg_r.png`));
  safeSetCandidates(getSlot(root, 'armL'), bases.map((p) => `${p}/base/arm_l.png`));
  safeSetCandidates(getSlot(root, 'armR'), bases.map((p) => `${p}/base/arm_r.png`));
  safeSetCandidates(getSlot(root, 'torso'), bases.map((p) => `${p}/base/torso.png`));
  safeSetCandidates(getSlot(root, 'pelvis'), bases.map((p) => `${p}/base/pelvis.png`));
  safeSetCandidates(getSlot(root, 'headBase'), bases.flatMap((p) => [`${p}/base/head_base.png`, `${p}/base/head.png`]));
  safeSetCandidates(getSlot(root, 'face'), bases.map((p) => `${p}/faces/${config.face}.png`));
  safeSetCandidates(
    getSlot(root, 'armorTorso'),
    [
      ...buildEquipmentLayerCandidates(bases, equipped, ['body'], 'torso'),
      ...classBases.map((p) => `${p}/torso.png`)
    ]
  );
  safeSetCandidates(
    getSlot(root, 'armorArmL'),
    [
      ...buildEquipmentLayerCandidates(bases, equipped, ['gloves', 'body'], 'arm_l'),
      ...classBases.map((p) => `${p}/arm_l.png`)
    ]
  );
  safeSetCandidates(
    getSlot(root, 'armorArmR'),
    [
      ...buildEquipmentLayerCandidates(bases, equipped, ['gloves', 'body'], 'arm_r'),
      ...classBases.map((p) => `${p}/arm_r.png`)
    ]
  );
  safeSetCandidates(
    getSlot(root, 'armorPelvis'),
    [
      ...buildEquipmentLayerCandidates(bases, equipped, ['legs', 'body'], 'pelvis'),
      ...classBases.map((p) => `${p}/pelvis.png`)
    ]
  );
  safeSetCandidates(
    getSlot(root, 'armorLegL'),
    [
      ...buildEquipmentLayerCandidates(bases, equipped, ['boots', 'legs', 'body'], 'leg_l'),
      ...classBases.map((p) => `${p}/leg_l.png`)
    ]
  );
  safeSetCandidates(
    getSlot(root, 'armorLegR'),
    [
      ...buildEquipmentLayerCandidates(bases, equipped, ['boots', 'legs', 'body'], 'leg_r'),
      ...classBases.map((p) => `${p}/leg_r.png`)
    ]
  );
  safeSetCandidates(
    getSlot(root, 'shield'),
    buildEquipmentLayerCandidates(bases, equipped, ['shield'], 'shield')
  );
  safeSetCandidates(
    getSlot(root, 'weapon'),
    [
      ...buildEquipmentLayerCandidates(bases, equipped, ['weapon'], 'weapon'),
      ...classBases.map((p) => `${p}/weapon.png`)
    ]
  );
}

let modelViewerSupportPromise = null;

function getProfile3DVariant(config) {
  const equipped = getEquippedPaperdollMap(config);
  const candidateSlots = ['body', 'legs', 'gloves', 'boots'];
  const leatherHints = ['leather', 'sandals'];
  const hasVisibleArmorPiece = candidateSlots.some((slotKey) => {
    const item = equipped[slotKey];
    return Boolean(item?.name && normalizeInventoryItemName(item.name) !== 'пусто');
  });
  const hasLeatherPiece = candidateSlots.some((slotKey) => {
    const item = equipped[slotKey];
    if (!item?.name) return false;
    const normalized = normalizeInventoryItemName(item.name);
    return leatherHints.some((hint) => normalized.includes(hint));
  });
  const shouldUseStarterWarriorLook = !hasVisibleArmorPiece && config?.classId !== 'mage';
  if (shouldUseStarterWarriorLook) return 'leather';
  return hasLeatherPiece ? 'leather' : 'base';
}

function getProfile3DAsset(config) {
  const variant = getProfile3DVariant(config);
  const version = window.__HD_APP_VERSION__ || 'dev';
  return {
    variant,
    src: `./assets/models/profile_${variant}.glb?v=${version}`,
    poster: `./assets/models/profile_${variant}_poster.png?v=${version}`,
    cutout: `./assets/models/profile_${variant}_cutout.png?v=${version}`
  };
}

function bootModelViewerSupport() {
  if (modelViewerSupportPromise) return modelViewerSupportPromise;
  modelViewerSupportPromise = Promise.resolve().then(() => {
    if (!window.customElements || typeof window.customElements.whenDefined !== 'function') {
      return false;
    }
    if (window.customElements.get('model-viewer')) {
      document.documentElement.classList.add('has-model-viewer');
      return true;
    }
    return window.customElements.whenDefined('model-viewer')
      .then(() => {
        document.documentElement.classList.add('has-model-viewer');
        return true;
      })
      .catch(() => false);
  });
  return modelViewerSupportPromise;
}

function primeProfile3DViewer(config) {
  const viewer = q('profileModelViewer');
  const asset = getProfile3DAsset(config);
  const posterFallback = q('profileModelPosterFallback');

  if (posterFallback) {
    posterFallback.setAttribute('src', asset.cutout || asset.poster);
    posterFallback.setAttribute('alt', `${config.nickname || 'Hero'} profile poster`);
  }

  if (!viewer) return;

  if (!viewer.dataset.boundHdViewer) {
    viewer.dataset.boundHdViewer = '1';
    viewer.addEventListener('load', () => {
      document.documentElement.classList.add('has-model-viewer');
    });
    viewer.addEventListener('error', () => {
      document.documentElement.classList.remove('has-model-viewer');
    });
  }

  if (viewer.dataset.variant !== asset.variant) {
    viewer.dataset.variant = asset.variant;
    viewer.setAttribute('src', asset.src);
    viewer.setAttribute('poster', asset.poster);
  }
  const isCompactDesktop = !!document.body &&
    document.body.classList.contains('env-telegram') &&
    document.body.classList.contains('platform-desktop-runtime') &&
    document.body.classList.contains('viewport-compact-desktop');
  const isMobileProfile = !!document.body &&
    (
      document.body.classList.contains('device-mobile') ||
      document.body.classList.contains('platform-mobile')
    );

  if (isCompactDesktop) {
    viewer.setAttribute('camera-target', '0m 0.18m 0m');
    viewer.setAttribute('camera-orbit', '0deg 78deg 1.34m');
    viewer.setAttribute('min-camera-orbit', 'auto 78deg 1.34m');
    viewer.setAttribute('max-camera-orbit', 'auto 78deg 1.34m');
    viewer.setAttribute('field-of-view', '25deg');
  } else if (isMobileProfile) {
    viewer.setAttribute('camera-target', '0m 0.16m 0m');
    viewer.setAttribute('camera-orbit', '0deg 78deg 1.30m');
    viewer.setAttribute('min-camera-orbit', 'auto 78deg 1.30m');
    viewer.setAttribute('max-camera-orbit', 'auto 78deg 1.30m');
    viewer.setAttribute('field-of-view', '24deg');
  } else {
    viewer.setAttribute('camera-target', '0m 0.28m 0m');
    viewer.setAttribute('camera-orbit', '0deg 78deg 1.24m');
    viewer.setAttribute('min-camera-orbit', 'auto 78deg 1.24m');
    viewer.setAttribute('max-camera-orbit', 'auto 78deg 1.24m');
    viewer.setAttribute('field-of-view', '23deg');
  }
  viewer.setAttribute('alt', `${config.nickname || 'Hero'} 3D profile preview`);
  bootModelViewerSupport();
}

function setCreatorBg(el, state) {
  safeSetBackground(
    el,
    [`./assets/backgrounds/create_${state.creator.race}.jpg`, CREATE_BG_DEFAULT],
    'linear-gradient(180deg, rgba(10,12,18,.08), rgba(10,12,18,.26))'
  );
}

function normalizeInventoryItemName(value) {
  if (typeof window.HD_NORMALIZE_ITEM_NAME === 'function') {
    return window.HD_NORMALIZE_ITEM_NAME(value);
  }
  return String(value || '')
    .replace(/^\s*\d+\s*x\s*/i, '')
    .trim()
    .replaceAll('Ё', 'Е')
    .replaceAll('ё', 'е')
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function parseInventoryStackItem(value) {
  const match = String(value || '').match(/^\s*(\d+)\s*x\s*(.+?)\s*$/i);
  if (!match) return null;
  return {
    count: Number(match[1]),
    baseName: match[2]
  };
}

function getInventoryBaseItemName(entry) {
  const stack = parseInventoryStackItem(entry?.item);
  return String(stack ? stack.baseName : entry?.item || '').trim();
}

function isInventoryEntryEquipped(entry) {
  return String(entry?.type || '').toLowerCase().includes('над');
}

function resolveInventoryItemBlueprint(entryOrName) {
  const name = typeof entryOrName === 'string'
    ? entryOrName
    : getInventoryBaseItemName(entryOrName);
  if (typeof window.HD_RESOLVE_ITEM_BLUEPRINT === 'function') {
    return window.HD_RESOLVE_ITEM_BLUEPRINT(name);
  }
  return window.HD_ITEM_CATALOG?.[normalizeInventoryItemName(name)] || null;
}

function recomputeHeroEquipmentStats(state) {
  if (!state?.hero) return false;

  const hero = state.hero;
  const baseCombat = hero.baseCombat || {
    maxHp: hero.maxHp || 0,
    maxMp: hero.maxMp || 0,
    maxCp: hero.maxCp || deriveBaseCp(hero.maxHp || 0),
    pAtk: hero.pAtk || 0,
    pDef: hero.pDef || 0,
    mAtk: hero.mAtk || 0,
    mDef: hero.mDef || 0,
    accuracy: hero.accuracy || 0,
    evasion: hero.evasion || 0,
    critical: hero.critical || 0,
    mCritical: hero.mCritical || 0,
    atkSpd: hero.atkSpd || 0,
    castSpd: hero.castSpd || 0,
    speed: hero.speed || 0,
    weightLimit: hero.weightLimit || 0
  };

  const hpRatio = hero.maxHp > 0 ? clamp(hero.hp / hero.maxHp, 0, 1) : 1;
  const mpRatio = hero.maxMp > 0 ? clamp(hero.mp / hero.maxMp, 0, 1) : 1;
  const cpRatio = hero.maxCp > 0 ? clamp(hero.cp / hero.maxCp, 0, 1) : 1;

  let changed = false;
  if (!hero.baseCombat) {
    hero.baseCombat = { ...baseCombat };
    changed = true;
  }

  const bonus = {
    hp: 0,
    mp: 0,
    cp: 0,
    patt: 0,
    pdef: 0,
    matt: 0,
    mdef: 0,
    accuracy: 0,
    evasion: 0,
    critical: 0,
    mCritical: 0,
    atkSpd: 0,
    castSpd: 0,
    speed: 0,
    weightLimit: 0
  };

  (hero.inventory || [])
    .filter(isInventoryEntryEquipped)
    .forEach((entry) => {
      const blueprint = resolveInventoryItemBlueprint(entry);
      const stats = blueprint?.stats || entry?.stats || {};
      bonus.hp += Number(stats.hp || 0);
      bonus.mp += Number(stats.mp || 0);
      bonus.cp += Number(stats.cp || 0);
      bonus.patt += Number(stats.patt || 0);
      bonus.pdef += Number(stats.pdef || 0);
      bonus.matt += Number(stats.matt || 0);
      bonus.mdef += Number(stats.mdef || 0);
      bonus.accuracy += Number(stats.accuracy || 0);
      bonus.evasion += Number(stats.evasion || 0);
      bonus.critical += Number(stats.critical || stats.crit || 0);
      bonus.mCritical += Number(stats.mCritical || stats.magicCrit || 0);
      bonus.atkSpd += Number(stats.atkSpd || 0);
      bonus.castSpd += Number(stats.castSpd || 0);
      bonus.speed += Number(stats.speed || 0);
      bonus.weightLimit += Number(stats.weightLimit || 0);
    });

  const nextValues = {
    maxHp: baseCombat.maxHp + bonus.hp,
    maxMp: baseCombat.maxMp + bonus.mp,
    maxCp: baseCombat.maxCp + bonus.cp,
    pAtk: baseCombat.pAtk + bonus.patt,
    pDef: baseCombat.pDef + bonus.pdef,
    mAtk: baseCombat.mAtk + bonus.matt,
    mDef: baseCombat.mDef + bonus.mdef,
    accuracy: baseCombat.accuracy + bonus.accuracy,
    evasion: baseCombat.evasion + bonus.evasion,
    critical: baseCombat.critical + bonus.critical,
    mCritical: baseCombat.mCritical + bonus.mCritical,
    atkSpd: baseCombat.atkSpd + bonus.atkSpd,
    castSpd: baseCombat.castSpd + bonus.castSpd,
    speed: baseCombat.speed + bonus.speed,
    weightLimit: baseCombat.weightLimit + bonus.weightLimit
  };

  Object.entries(nextValues).forEach(([key, value]) => {
    if (hero[key] !== value) {
      hero[key] = value;
      changed = true;
    }
  });

  const nextHp = clamp(Math.round(nextValues.maxHp * hpRatio), 0, nextValues.maxHp);
  const nextMp = clamp(Math.round(nextValues.maxMp * mpRatio), 0, nextValues.maxMp);
  const nextCp = clamp(Math.round(nextValues.maxCp * cpRatio), 0, nextValues.maxCp);

  if (hero.hp !== nextHp) {
    hero.hp = nextHp;
    changed = true;
  }
  if (hero.mp !== nextMp) {
    hero.mp = nextMp;
    changed = true;
  }
  if (hero.cp !== nextCp) {
    hero.cp = nextCp;
    changed = true;
  }

  return changed;
}

window.HD_RECOMPUTE_HERO_STATS = recomputeHeroEquipmentStats;

function buildHero(state) {
  const isMage = state.creator.classId === 'mage';

  const hero = {
    id: createHeroId(state.account?.telegramId || 'local', state.creator.nickname),
    ownerTelegramId: String(state.account?.telegramId || ''),
    nickname: normalizeNickname(state.creator.nickname),
    race: state.creator.race,
    classId: state.creator.classId,
    gender: state.creator.gender,
    face: state.creator.face,
    cityId: 'start_village',
    level: 80,
    clanName: 'No Clan',
    xpPercent: '0.00',
    adena: 100,
    inventoryLimit: 80,
    rep: 0,
    pvp: 0,
    raid: 0,
    inventory: [
      {
        slot: 'Оружие',
        item: isMage ? 'Mage Staff' : 'Short Sword',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'weapon',
        equipSlot: 'weapon'
      },
      {
        slot: 'Шлем',
        item: isMage ? 'Cloth Cap' : 'Leather Helmet',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'head',
        equipSlot: 'head'
      },
      {
        slot: 'Тело',
        item: isMage ? 'Cotton Robe' : 'Leather Shirt',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'body',
        equipSlot: 'body'
      },
      {
        slot: 'Низ',
        item: isMage ? 'Пусто' : 'Leather Pants',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'legs',
        equipSlot: 'legs'
      },
      {
        slot: 'Перчатки',
        item: isMage ? 'Short Gloves' : 'Leather Gloves',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'gloves',
        equipSlot: 'gloves'
      },
      {
        slot: 'Ботинки',
        item: isMage ? 'Cloth Shoes' : 'Leather Sandals',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'boots',
        equipSlot: 'boots'
      },
      {
        slot: 'Ожерелье',
        item: 'Necklace of Magic',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'necklace',
        equipSlot: 'necklace'
      },
      {
        slot: 'Кольцо I',
        item: 'Magic Ring',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'ring',
        equipSlot: 'ring1'
      },
      {
        slot: 'Серьга I',
        item: 'Apprentices Earring',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'earring',
        equipSlot: 'earring1'
      },
      {
        slot: 'Щит',
        item: isMage ? 'Пусто' : 'Small Shield',
        type: 'Надето',
        category: 'wearable',
        equipFamily: 'shield',
        equipSlot: 'shield'
      },
      { slot: 'Зелье', item: '3 x HP-50', type: 'Сумка', category: 'consumable' },
      { slot: 'Рецепт', item: '1 x Recipe: XXXX', type: 'Сумка', category: 'general' },
      { slot: 'Ресурсы', item: '12 x Animal Skin', type: 'Сумка', category: 'resource' },
      { slot: 'Ресурсы', item: '6 x Coal', type: 'Сумка', category: 'resource' },
      { slot: 'Квест', item: 'Печать старосты', type: 'Сумка', category: 'quest' },
      { slot: 'Сумка', item: 'Факел путника', type: 'Сумка', category: 'general' }
    ]
  };

  const equippedBySlot = Object.fromEntries(
    (hero.inventory || [])
      .filter((entry) => entry?.equipSlot)
      .map((entry) => [entry.equipSlot, entry])
  );

  if (equippedBySlot.head) equippedBySlot.head.item = isMage ? 'Cloth Cap' : 'Leather Helmet';
  if (equippedBySlot.body) equippedBySlot.body.item = isMage ? 'Cotton Robe' : 'Leather Shirt';
  if (equippedBySlot.legs) equippedBySlot.legs.item = isMage ? 'Пусто' : 'Leather Pants';
  if (equippedBySlot.gloves) equippedBySlot.gloves.item = isMage ? 'Short Gloves' : 'Leather Gloves';
  if (equippedBySlot.boots) equippedBySlot.boots.item = isMage ? 'Cloth Shoes' : 'Leather Sandals';
  if (equippedBySlot.shield) equippedBySlot.shield.item = isMage ? 'Пусто' : 'Small Shield';

  applyHeroBaseProfile(hero, state.creator);
  hero.maxHp = hero.baseCombat.maxHp;
  hero.maxMp = hero.baseCombat.maxMp;
  hero.maxCp = hero.baseCombat.maxCp;
  hero.hp = hero.maxHp;
  hero.mp = hero.maxMp;
  hero.cp = hero.maxCp;
  hero.pAtk = hero.baseCombat.pAtk;
  hero.pDef = hero.baseCombat.pDef;
  hero.mAtk = hero.baseCombat.mAtk;
  hero.mDef = hero.baseCombat.mDef;
  hero.accuracy = hero.baseCombat.accuracy;
  hero.evasion = hero.baseCombat.evasion;
  hero.critical = hero.baseCombat.critical;
  hero.mCritical = hero.baseCombat.mCritical;
  hero.atkSpd = hero.baseCombat.atkSpd;
  hero.castSpd = hero.baseCombat.castSpd;
  hero.speed = hero.baseCombat.speed;
  hero.weightLimit = hero.baseCombat.weightLimit;

  recomputeHeroEquipmentStats({ hero });
  return hero;
}

function showToast(text) {
  const toast = q('toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const parts = [];
  if (h) parts.push(`${h} ч`);
  if (h || m) parts.push(`${m} мин`);
  parts.push(`${s} сек`);
  return parts.join(' ');
}

function updateTravelStatus(state) {
  if (!state.travel) return null;
  if (state.travel.status === 'walking' && Date.now() >= state.travel.endsAt) {
    state.travel.status = 'arrived';
    saveState(state);
  }
  return state.travel;
}

function tryArriveFromTravel(state) {
  const travel = updateTravelStatus(state);
  if (!travel || travel.status !== 'arrived') return false;
  state.hero.cityId = travel.toCityId;
  const bandits = travel.bandits;
  state.travel = null;
  saveState(state);
  showToast(bandits ? 'Ты добрался до города после стычки с разбойниками.' : 'Путешествие прошло спокойно.');
  return true;
}

function renderBottomNav(active) {
  const links = bottomNavItems.map((item) => `
    <a class="bottom-link icon-link ${active === item.id ? 'active' : ''}" href="${withAppParams(item.href)}" aria-label="${item.label}">
      <img src="${item.icon}" alt="${item.label}">
    </a>`).join('');

  return `
  <div class="panel bottom-nav-panel">
    <div class="panel-inner bottom-nav-grid">
      ${links}
      <a class="bottom-link journey-link ${active === 'journey' ? 'active' : ''}" href="journey.html" aria-label="Отправиться в путешествие">
        <img src="./assets/ui/menu/adventure.png" alt="Отправиться в путешествие">
      </a>
    </div>
  </div>`;
}

function renderSideMenu(active) { return renderBottomNav(active); }

function renderBottomNav(active) {
  const buttonBoxWidth = 1100;
  const buttonBoxHeight = 215;
  const pct = (value, total) => `${((value / total) * 100).toFixed(3)}%`;

  const links = bottomNavPsdItems.map((item) => {
    const src = withAssetVersion(`./assets/ui/profile_redesign/btn_${item.asset}_${active === item.id ? 'use' : 'idle'}.png`);
    const style = [
      `left:${pct(item.x, buttonBoxWidth)}`,
      `top:${pct(item.y, buttonBoxHeight)}`,
      `width:${pct(item.w, buttonBoxWidth)}`,
      `height:${pct(item.h, buttonBoxHeight)}`
    ].join(';');

    if (item.disabled) {
      return `
        <span class="psd-bottom-nav-button disabled" style="${style}" aria-label="${item.label}">
          <img src="${src}" alt="">
        </span>
      `;
    }

    return `
      <a class="psd-bottom-nav-button" href="${withAppParams(item.href)}" style="${style}" aria-label="${item.label}"${active === item.id ? ' aria-current="page"' : ''}>
        <img src="${src}" alt="">
      </a>
    `;
  }).join('');

  return `
  <div class="psd-bottom-nav-shell" aria-label="Навигация по разделам персонажа">
    <img class="psd-bottom-nav-art" src="${withAssetVersion('./assets/ui/profile_redesign/art_profile_bottom.png')}" alt="">
    ${links}
  </div>`;
}

function renderSideMenu(active) { return renderBottomNav(active); }

function renderHeader(state, subtitle = '') {
  const city = getCurrentCity(state);
  return `
<div class="topbar">
  <div class="topbar-left">
    <h1 class="title">${city.name}</h1>
    <p class="subtitle">${subtitle || 'Одноэкранный интерфейс без скролла.'}</p>
  </div>
  <div class="top-actions">
    <div class="chip">${state.hero.nickname}</div>
    <div class="chip">${getClassName(state.hero.classId)}</div>
    <div class="chip">Аден: ${state.hero.adena}</div>
  </div>
</div>`;
}

function renderPortraitPanel(state) {
  return `
<div class="panel hero-portrait-card">
  <div class="hero-portrait-bg" id="portraitBg"></div>
  <div class="character-stage">
    <div class="shadow"></div>
    <div class="character-box" id="profilePreviewRoot">
      ${characterMarkup()}
    </div>
  </div>
  <div class="portrait-footer">
    <div class="profile-name">${state.hero.nickname}</div>
  </div>
</div>`;
}

function applyPortrait(state) {
  const city = getCurrentCity(state);
  const fallbackCity = cities.start_village || city;
  const root = q('profilePreviewRoot');
  if (root) setPreview(root, state.hero);
  primeProfile3DViewer(state.hero);
  const bg = q('portraitBg');
  if (bg) {
    safeSetBackground(
      bg,
      [
        city.portraitBg,
        city.sceneBg,
        fallbackCity.portraitBg,
        fallbackCity.sceneBg
      ].filter(Boolean),
      'linear-gradient(180deg, rgba(10,12,18,.08), rgba(10,12,18,.26))'
    );
  }
}

function characterMarkup() {
  return `
<img data-slot="legL" class="character-layer" alt=""><img data-slot="legR" class="character-layer" alt=""><img data-slot="armorLegL" class="character-layer" alt=""><img data-slot="armorLegR" class="character-layer" alt="">
<div class="upper-body"><div class="arm-back-group"><img data-slot="shield" class="character-layer" alt=""><img data-slot="armL" class="character-layer" alt=""><img data-slot="armorArmL" class="character-layer" alt=""></div><div class="head-group"><img data-slot="headBase" class="character-layer" alt=""><img data-slot="face" class="character-layer" alt=""></div><img data-slot="torso" class="character-layer" alt=""><img data-slot="armorTorso" class="character-layer" alt=""><div class="arm-front-group"><img data-slot="armR" class="character-layer" alt=""><img data-slot="armorArmR" class="character-layer" alt=""><img data-slot="weapon" class="character-layer" alt=""></div></div>
<img data-slot="pelvis" class="character-layer" alt=""><img data-slot="armorPelvis" class="character-layer" alt="">`;
}

function ensureHero(state) {
  if (!state.hero) {
    location.href = withAppParams('index.html');
    return false;
  }

  let changed = false;

  if (!Number.isFinite(Number(state.hero.inventoryLimit)) || Number(state.hero.inventoryLimit) <= 0) {
    state.hero.inventoryLimit = 80;
    changed = true;
  }

  if (assignHeroAccountIdentity(state)) {
    changed = true;
  }

  if (applyHeroBaseProfile(state.hero, {
    race: state.hero.race,
    classId: state.hero.classId,
    gender: state.hero.gender
  })) {
    changed = true;
  }

  if (!state.hero.inventorySeedVersion || state.hero.inventorySeedVersion < 2) {
    const hasReturnScroll = (state.hero.inventory || []).some((entry) => {
      const blueprint = resolveInventoryItemBlueprint(entry);
      return blueprint?.effect === 'return_scroll';
    });

    if (!hasReturnScroll) {
      state.hero.inventory = state.hero.inventory || [];
      state.hero.inventory.push({
        slot: '\u0421\u0432\u0438\u0442\u043a\u0438',
        item: '1 x \u0421\u0432\u0438\u0442\u043e\u043a \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u0430',
        type: '\u0421\u0443\u043c\u043a\u0430',
        category: 'consumable'
      });
      changed = true;
    }

    state.hero.inventorySeedVersion = 2;
    changed = true;
  }

  if (state.hero.inventorySeedVersion < 3) {
    const healingPotionKey = normalizeInventoryItemName('\u0417\u0435\u043b\u044c\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u044f');
    state.hero.inventory = (state.hero.inventory || []).map((entry) => {
      const baseName = normalizeInventoryItemName(getInventoryBaseItemName(entry));
      if (baseName !== 'hp-50') return entry;
      const stack = parseInventoryStackItem(entry.item);
      const nextCount = stack?.count || 1;
      return {
        ...entry,
        slot: '\u0417\u0435\u043b\u044c\u044f',
        item: `${nextCount} x \u0417\u0435\u043b\u044c\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u044f`,
        type: '\u0421\u0443\u043c\u043a\u0430',
        category: 'consumable'
      };
    });

    const hasHealingPotion = state.hero.inventory.some((entry) => (
      normalizeInventoryItemName(getInventoryBaseItemName(entry)) === healingPotionKey
    ));

    if (!hasHealingPotion) {
      state.hero.inventory.push({
        slot: '\u0417\u0435\u043b\u044c\u044f',
        item: '3 x \u0417\u0435\u043b\u044c\u0435 \u043b\u0435\u0447\u0435\u043d\u0438\u044f',
        type: '\u0421\u0443\u043c\u043a\u0430',
        category: 'consumable'
      });
      changed = true;
    }

    state.hero.inventorySeedVersion = 3;
    changed = true;
  }

  if (recomputeHeroEquipmentStats(state)) {
    changed = true;
  }

  if (changed) {
    saveState(state);
  }
  return true;
}
