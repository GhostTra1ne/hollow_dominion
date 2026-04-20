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
  const isMobile = width <= 767 || isIOS || isAndroid;
  const isDesktop = !isMobile;
  return {
    isTelegram,
    isBrowser: !isTelegram,
    isIOS,
    isAndroid,
    isDesktopPlatform,
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
  const isTelegramCompactDesktop = env.isTelegram && env.isDesktopPlatform && vw <= 500;

  body.classList.toggle('viewport-short', isShort);
  body.classList.toggle('viewport-tall', isTall);
  body.classList.toggle('viewport-normal', !isShort && !isTall);
  body.classList.toggle('viewport-compact-desktop', isTelegramCompactDesktop);

  root.style.setProperty('--viewport-width', `${vw}px`);
  root.style.setProperty('--viewport-height', `${vh}px`);

  let hudBottom = null;
  let profileBottom = null;

  if (isTelegramCompactDesktop) {
    hudBottom = isShort
      ? clamp(Math.round(vh * 0.12), 84, 104)
      : clamp(Math.round(vh * 0.135), 96, 122);
    profileBottom = isShort
      ? clamp(Math.round(vh * 0.18), 104, 132)
      : clamp(Math.round(vh * 0.205), 116, 148);
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
const FALLBACK_CHARACTER = './assets/characters/human/male';
const CREATE_BG_DEFAULT = './assets/backgrounds/create_bg.jpg';

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

const classStats = {
  warrior: {hp: 120, maxHp: 120, mp: 45, maxMp: 45, str: 12, dex: 10, int: 8, def: 11, adena: 100},
  mage: {hp: 82, maxHp: 82, mp: 100, maxMp: 100, str: 7, dex: 9, int: 15, def: 8, adena: 100}
};

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

function q(id) { return document.getElementById(id); }
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_STATE);
    if (!raw) return clone(stateDefault);
    const parsed = JSON.parse(raw);
    return {
      ...clone(stateDefault),
      ...parsed,
      creator: {...clone(stateDefault.creator), ...(parsed.creator || {})}
    };
  } catch {
    return clone(stateDefault);
  }
}

function saveState(state) { localStorage.setItem(STORAGE_STATE, JSON.stringify(state)); }
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

function setPreview(root, config) {
  const bases = buildBases(config.race, config.gender);
  safeSetCandidates(getSlot(root, 'legL'), bases.map((p) => `${p}/base/leg_l.png`));
  safeSetCandidates(getSlot(root, 'legR'), bases.map((p) => `${p}/base/leg_r.png`));
  safeSetCandidates(getSlot(root, 'armL'), bases.map((p) => `${p}/base/arm_l.png`));
  safeSetCandidates(getSlot(root, 'armR'), bases.map((p) => `${p}/base/arm_r.png`));
  safeSetCandidates(getSlot(root, 'torso'), bases.map((p) => `${p}/base/torso.png`));
  safeSetCandidates(getSlot(root, 'pelvis'), bases.map((p) => `${p}/base/pelvis.png`));
  safeSetCandidates(getSlot(root, 'headBase'), bases.flatMap((p) => [`${p}/base/head_base.png`, `${p}/base/head.png`]));
  safeSetCandidates(getSlot(root, 'face'), bases.map((p) => `${p}/faces/${config.face}.png`));
  const classBases = bases.map((p) => `${p}/class_preview/${config.classId}`);
  safeSetCandidates(getSlot(root, 'armorTorso'), classBases.map((p) => `${p}/torso.png`));
  safeSetCandidates(getSlot(root, 'armorArmL'), classBases.map((p) => `${p}/arm_l.png`));
  safeSetCandidates(getSlot(root, 'armorArmR'), classBases.map((p) => `${p}/arm_r.png`));
  safeSetCandidates(getSlot(root, 'armorPelvis'), classBases.map((p) => `${p}/pelvis.png`));
  safeSetCandidates(getSlot(root, 'armorLegL'), classBases.map((p) => `${p}/leg_l.png`));
  safeSetCandidates(getSlot(root, 'armorLegR'), classBases.map((p) => `${p}/leg_r.png`));
  safeSetCandidates(getSlot(root, 'weapon'), classBases.map((p) => `${p}/weapon.png`));
}

function setCreatorBg(el, state) {
  safeSetBackground(
    el,
    [`./assets/backgrounds/create_${state.creator.race}.jpg`, CREATE_BG_DEFAULT],
    'linear-gradient(180deg, rgba(10,12,18,.08), rgba(10,12,18,.26))'
  );
}

function buildHero(state) {
  const stats = classStats[state.creator.classId];
  return {
    nickname: normalizeNickname(state.creator.nickname),
    race: state.creator.race,
    classId: state.creator.classId,
    gender: state.creator.gender,
    face: state.creator.face,
    cityId: 'start_village',
    ...stats,
    level: 80,
    clanName: 'No Clan',
    xpPercent: '0.00',
    cp: Math.round(stats.maxHp * 0.26),
    maxCp: Math.round(stats.maxHp * 0.26),
    pAtk: state.creator.classId === 'warrior' ? 299 : 154,
    pDef: state.creator.classId === 'warrior' ? 353 : 220,
    mAtk: state.creator.classId === 'mage' ? 404 : 121,
    mDef: 287,
    accuracy: 124,
    mAccuracy: 173,
    evasion: 121,
    mEvasion: 170,
    critical: 66,
    mCritical: 58,
    atkSpd: 356,
    castSpd: state.creator.classId === 'mage' ? 262 : 118,
    speed: 131,
    con: 34,
    men: 29,
    wit: 12,
    rep: 0,
    pvp: 0,
    raid: 0,
    inventory: [
      {slot: 'Оружие', item: 'Железный меч', type: 'Надето'},
      {slot: 'Броня', item: 'Кожаный доспех', type: 'Надето'},
      {slot: 'Зелья', item: '3 x Зелье лечения', type: 'Сумка'},
      {slot: 'Свитки', item: '1 x Свиток возврата', type: 'Сумка'},
      {slot: 'Материалы', item: 'Пусто', type: 'Сумка'},
      {slot: 'Аксессуары', item: 'Пусто', type: 'Сумка'},
      {slot: 'Квест', item: 'Пусто', type: 'Сумка'},
      {slot: 'Прочее', item: 'Пусто', type: 'Сумка'}
    ]
  };
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
  const root = q('profilePreviewRoot');
  if (root) setPreview(root, state.hero);
  const bg = q('portraitBg');
  if (bg) {
    safeSetBackground(bg, [city.portraitBg], 'linear-gradient(180deg, rgba(10,12,18,.08), rgba(10,12,18,.26))');
  }
}

function characterMarkup() {
  return `
<img data-slot="legL" class="character-layer" alt=""><img data-slot="legR" class="character-layer" alt=""><img data-slot="armorLegL" class="character-layer" alt=""><img data-slot="armorLegR" class="character-layer" alt="">
<div class="upper-body"><div class="arm-back-group"><img data-slot="armL" class="character-layer" alt=""><img data-slot="armorArmL" class="character-layer" alt=""></div><div class="head-group"><img data-slot="headBase" class="character-layer" alt=""><img data-slot="face" class="character-layer" alt=""></div><img data-slot="torso" class="character-layer" alt=""><img data-slot="armorTorso" class="character-layer" alt=""><div class="arm-front-group"><img data-slot="armR" class="character-layer" alt=""><img data-slot="armorArmR" class="character-layer" alt=""><img data-slot="weapon" class="character-layer" alt=""></div></div>
<img data-slot="pelvis" class="character-layer" alt=""><img data-slot="armorPelvis" class="character-layer" alt="">`;
}

function ensureHero(state) {
  if (!state.hero) {
    location.href = withAppParams('index.html');
    return false;
  }
  return true;
}
