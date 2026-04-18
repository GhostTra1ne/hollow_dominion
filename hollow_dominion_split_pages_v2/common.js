
const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

const STORAGE_STATE = 'hd_split_app_v2';
const STORAGE_TAKEN = 'hd_taken_nicks_v2';
const FALLBACK_PATH = './assets/characters/human/male';
const DEFAULT_CITY = 'start_village';
const CITY_NAMES = { start_village:'Стартовая Деревня', lyon:'Лион', ravenford:'Рейвенфорд' };

const races = [
  { id:'human', name:'Человек' },
  { id:'elf', name:'Эльф' },
  { id:'dark_elf', name:'Тёмный эльф' },
  { id:'orc', name:'Орк' },
  { id:'dwarf', name:'Гном' }
];
const classes = [ { id:'warrior', name:'Воин' }, { id:'mage', name:'Маг' } ];
const genders = [ { id:'male', name:'Мужчина' }, { id:'female', name:'Женщина' } ];
const faces = ['01','02','03','04','05','06'];
const classStats = {
  warrior:{ hp:120,maxHp:120,mp:45,maxMp:45,cp:36,maxCp:36,str:12,dex:10,int:8,con:11,wit:8,men:9,pAtk:299,mAtk:72,pDef:353,mDef:287,accuracy:124,crit:66,evasion:121,atkSpd:356,castSpd:92,speed:131,adena:100 },
  mage:{ hp:82,maxHp:82,mp:100,maxMp:100,cp:24,maxCp:24,str:7,dex:9,int:15,con:8,wit:14,men:12,pAtk:118,mAtk:244,pDef:188,mDef:233,accuracy:111,crit:34,evasion:108,atkSpd:248,castSpd:262,speed:126,adena:100 }
};

const defaultState = {
  creator:{ race:'human', classId:'warrior', gender:'male', face:'01', nickname:'' },
  hero:null,
  currentCity:DEFAULT_CITY,
  inventory:[
    { name:'Старый меч', slot:'Оружие' },
    { name:'Туника ученика', slot:'Тело' },
    { name:'Зелье лечения', slot:'Расходник' }
  ],
  chat:[
    { from:'Система', text:'Добро пожаловать в Hollow Dominion.' },
    { from:'Хронист', text:'Город живёт своей жизнью. Скоро здесь станет куда больше путей.' }
  ],
  travel:{ active:false, to:'lyon', endsAt:0, event:null }
};

function clone(v){ return JSON.parse(JSON.stringify(v)); }
function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_STATE);
    if (!raw) return clone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...clone(defaultState),
      ...parsed,
      creator:{ ...clone(defaultState.creator), ...(parsed.creator||{}) },
      hero: parsed.hero ? { ...parsed.hero } : null,
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : clone(defaultState.inventory),
      chat: Array.isArray(parsed.chat) ? parsed.chat : clone(defaultState.chat),
      travel: { ...clone(defaultState.travel), ...(parsed.travel||{}) }
    };
  } catch { return clone(defaultState); }
}
function saveState(){ localStorage.setItem(STORAGE_STATE, JSON.stringify(state)); }
let state = loadState();

function byId(id){ return document.getElementById(id); }
function getRaceName(id){ return races.find(v=>v.id===id)?.name || '—'; }
function getClassName(id){ return classes.find(v=>v.id===id)?.name || '—'; }
function getGenderName(id){ return genders.find(v=>v.id===id)?.name || '—'; }
function normalizeNickname(v){ return (v||'').trim(); }
function nickKey(v){ return normalizeNickname(v).toLowerCase(); }
function getTakenNicknames(){ try { return JSON.parse(localStorage.getItem(STORAGE_TAKEN) || '[]'); } catch { return []; } }
function reserveNickname(v){ const list = getTakenNicknames(); const key = nickKey(v); if (key && !list.includes(key)) { list.push(key); localStorage.setItem(STORAGE_TAKEN, JSON.stringify(list)); } }
function validateNickname(v){
  const n = normalizeNickname(v);
  if (!n) return 'Введите никнейм.';
  if (n.length < 3) return 'Ник должен быть не короче 3 символов.';
  if (n.length > 16) return 'Ник не должен быть длиннее 16 символов.';
  if (!/^[A-Za-zА-Яа-яЁё0-9_]+$/.test(n)) return 'Разрешены буквы, цифры и знак _.';
  const taken = getTakenNicknames();
  const current = state.hero ? nickKey(state.hero.nickname) : '';
  if (taken.includes(nickKey(n)) && nickKey(n) !== current) return 'Этот ник уже занят.';
  return '';
}
function escapeHtml(str){ return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
function cycleArray(arr, currentId, dir){ const i = arr.findIndex(item => item.id === currentId || item === currentId); return arr[(i + dir + arr.length) % arr.length]; }
function buildHero(){ const s = classStats[state.creator.classId]; return { nickname:normalizeNickname(state.creator.nickname), race:state.creator.race, classId:state.creator.classId, gender:state.creator.gender, face:state.creator.face, cityName:CITY_NAMES[state.currentCity], ...s }; }
function heroOrPreview(){ return state.hero || { ...state.creator, nickname:'—', cityName:CITY_NAMES[state.currentCity] }; }
function cityScenePath(city){ return `./assets/backgrounds/cities/${city}/scene.jpg`; }
function cityPortraitPath(city){ return `./assets/backgrounds/cities/${city}/portrait.jpg`; }
function cityMapPath(city){ return `./assets/maps/cities/${city}/map.jpg`; }
function marketPath(){ return './assets/locations/market/market_preview.jpg'; }

function getSlot(root, slot){ return root.querySelector(`[data-slot="${slot}"]`); }
function safeSetCandidates(imgEl, candidates){
  if (!imgEl) return;
  let index = 0;
  imgEl.style.display = 'block';
  function tryNext(){
    if (index >= candidates.length){ imgEl.style.display = 'none'; imgEl.removeAttribute('src'); imgEl.onerror = null; imgEl.onload = null; return; }
    const src = candidates[index++];
    imgEl.onerror = tryNext;
    imgEl.onload = () => { imgEl.style.display = 'block'; imgEl.onerror = null; imgEl.onload = null; };
    imgEl.src = src;
  }
  tryNext();
}
function buildBases(race, gender){ return [`./assets/characters/${race}/${gender}`, FALLBACK_PATH]; }
function setCharacterPreview(root, config){
  const bases = buildBases(config.race, config.gender);
  safeSetCandidates(getSlot(root,'legL'), bases.map(p => `${p}/base/leg_l.png`));
  safeSetCandidates(getSlot(root,'legR'), bases.map(p => `${p}/base/leg_r.png`));
  safeSetCandidates(getSlot(root,'armL'), bases.map(p => `${p}/base/arm_l.png`));
  safeSetCandidates(getSlot(root,'armR'), bases.map(p => `${p}/base/arm_r.png`));
  safeSetCandidates(getSlot(root,'torso'), bases.map(p => `${p}/base/torso.png`));
  safeSetCandidates(getSlot(root,'pelvis'), bases.map(p => `${p}/base/pelvis.png`));
  safeSetCandidates(getSlot(root,'headBase'), [
    ...bases.map(p => `${p}/base/head_base.png`),
    ...bases.map(p => `${p}/base/head.png`)
  ]);
  safeSetCandidates(getSlot(root,'face'), bases.map(p => `${p}/faces/${config.face}.png`));
  const classBases = bases.map(p => `${p}/class_preview/${config.classId}`);
  safeSetCandidates(getSlot(root,'armorTorso'), classBases.map(p => `${p}/torso.png`));
  safeSetCandidates(getSlot(root,'armorArmL'), classBases.map(p => `${p}/arm_l.png`));
  safeSetCandidates(getSlot(root,'armorArmR'), classBases.map(p => `${p}/arm_r.png`));
  safeSetCandidates(getSlot(root,'armorPelvis'), classBases.map(p => `${p}/pelvis.png`));
  safeSetCandidates(getSlot(root,'armorLegL'), classBases.map(p => `${p}/leg_l.png`));
  safeSetCandidates(getSlot(root,'armorLegR'), classBases.map(p => `${p}/leg_r.png`));
  safeSetCandidates(getSlot(root,'weapon'), classBases.map(p => `${p}/weapon.png`));
}
function setBgWithFallback(el, candidates){
  if (!el) return;
  let index = 0;
  function tryNext(){
    if (index >= candidates.length){ el.style.backgroundImage = 'linear-gradient(180deg,#11151d,#191f2b)'; return; }
    const url = candidates[index++];
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${url}")`; };
    img.onerror = tryNext;
    img.src = url;
  }
  tryNext();
}
function renderPortraitCard(targetId, opts={}){
  const target = byId(targetId); if (!target) return;
  const hero = heroOrPreview();
  target.innerHTML = `
    <div class="profile-card">
      <div class="portrait-shell">
        <div class="portrait-bg" id="${targetId}_bg"></div>
        <div class="character-zone">
          <div class="shadow"></div>
          <div class="character-box" id="${targetId}_char">
            <img data-slot="legL" class="character-layer" alt="">
            <img data-slot="legR" class="character-layer" alt="">
            <img data-slot="armorLegL" class="character-layer" alt="">
            <img data-slot="armorLegR" class="character-layer" alt="">
            <div class="upper-body">
              <div class="arm-back-group"><img data-slot="armL" class="character-layer" alt=""><img data-slot="armorArmL" class="character-layer" alt=""></div>
              <div class="head-group"><img data-slot="headBase" class="character-layer" alt=""><img data-slot="face" class="character-layer" alt=""></div>
              <img data-slot="torso" class="character-layer" alt=""><img data-slot="armorTorso" class="character-layer" alt="">
              <div class="arm-front-group"><img data-slot="armR" class="character-layer" alt=""><img data-slot="armorArmR" class="character-layer" alt=""><img data-slot="weapon" class="character-layer" alt=""></div>
            </div>
            <img data-slot="pelvis" class="character-layer" alt=""><img data-slot="armorPelvis" class="character-layer" alt="">
          </div>
        </div>
      </div>
      <div class="panel meta-panel"><div class="panel-inner hero-meta">
        <div class="hero-line"><span>Ник</span><b>${escapeHtml(hero.nickname || '—')}</b></div>
        <div class="hero-line"><span>Раса</span><b>${getRaceName(hero.race)}</b></div>
        <div class="hero-line"><span>Класс</span><b>${getClassName(hero.classId)}</b></div>
        <div class="hero-line"><span>Пол</span><b>${getGenderName(hero.gender)}</b></div>
        <div class="hero-line"><span>Аден</span><b>${state.hero?.adena ?? 0}</b></div>
      </div></div>
      ${opts.buttons ? `<div class="icon-grid">${opts.buttons}</div>` : ''}
    </div>`;
  setBgWithFallback(byId(`${targetId}_bg`), [cityPortraitPath(state.currentCity)]);
  setCharacterPreview(byId(`${targetId}_char`), hero);
}
function renderHubButtons(){
  return [
    ['inventory.html','Инвентарь','Сумка и экипировка'],['profile.html','Профиль','Основные данные'],['status.html','Статус','Параметры героя'],
    ['clan.html','Клан','Пока закрыто'],['map.html','Карта','Точки города'],['chat.html','Чат','Общий канал']
  ].map(([href,title,sub]) => `<a class="nav-btn" href="${href}"><span>${title}</span><small>${sub}</small></a>`).join('');
}
function bindDeleteCharacter(btnId, modalId, confirmId, cancelId){
  const btn = byId(btnId), modal = byId(modalId), confirm = byId(confirmId), cancel = byId(cancelId);
  if (!btn || !modal || !confirm || !cancel) return;
  btn.onclick = () => modal.classList.add('show');
  cancel.onclick = () => modal.classList.remove('show');
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
  confirm.onclick = () => {
    state.hero = null; state.creator = clone(defaultState.creator); state.currentCity = DEFAULT_CITY; state.travel = clone(defaultState.travel); saveState();
    modal.classList.remove('show'); window.location.href = 'index.html?reset=1';
  };
}
function remainingTravelMs(){ return Math.max(0, (state.travel.endsAt || 0) - Date.now()); }
function formatDuration(ms){ const sec = Math.ceil(ms/1000); const h = Math.floor(sec/3600); const m = Math.floor((sec%3600)/60); const s = sec%60; return h>0 ? `${h}ч ${m}м ${s}с` : `${m}м ${s}с`; }
