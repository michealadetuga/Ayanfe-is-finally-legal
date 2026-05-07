/* ═══════════════════════════════════════
   STARS
   ═══════════════════════════════════════ */
(function () {
  const c = document.getElementById('stars');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, stars = [];
  const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
  resize(); window.addEventListener('resize', resize);

  class Star {
    constructor() { this.init(true); }
    init(rand) {
      this.x = Math.random() * W;
      this.y = rand ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.6 + .3;
      this.vy = Math.random() * .12 + .04;
      this.alpha = Math.random() * .22 + .06;
      this.pulse = Math.random() * Math.PI * 2;
      this.col = Math.random() < .55 ? '196,181,253' : '249,168,212';
    }
    draw() {
      this.y -= this.vy; this.pulse += .004;
      if (this.y < -8) this.init(false);
      const a = this.alpha + Math.sin(this.pulse) * .06;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.col},${Math.max(0, a)})`; ctx.fill();
    }
  }
  for (let i = 0; i < 80; i++) stars.push(new Star());
  (function loop() { ctx.clearRect(0, 0, W, H); stars.forEach(s => s.draw()); requestAnimationFrame(loop); })();
})();

/* ═══════════════════════════════════════
   PETALS
   ═══════════════════════════════════════ */
(function () {
  const c = document.getElementById('petals');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, petals = [];
  const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
  resize(); window.addEventListener('resize', resize);
  const syms = ['♡', '✦', '·', '✿', '°'];
  const cols = ['#f9a8d4', '#c4b5fd', '#fdf4ff'];

  class Petal {
    constructor() { this.init(true); }
    init(rand) {
      this.x = Math.random() * W;
      this.y = rand ? Math.random() * H : -20;
      this.size = Math.random() * 11 + 5;
      this.vy = Math.random() * .3 + .08;
      this.vx = (Math.random() - .5) * .25;
      this.rot = Math.random() * Math.PI * 2;
      this.rs = (Math.random() - .5) * .007;
      this.alpha = Math.random() * .2 + .04;
      this.sym = syms[Math.floor(Math.random() * syms.length)];
      this.col = cols[Math.floor(Math.random() * cols.length)];
    }
    draw() {
      this.y += this.vy; this.x += this.vx; this.rot += this.rs;
      if (this.y > H + 20) this.init(false);
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha; ctx.fillStyle = this.col;
      ctx.font = `${this.size}px serif`; ctx.textAlign = 'center';
      ctx.fillText(this.sym, 0, 0); ctx.restore();
    }
  }
  for (let i = 0; i < 45; i++) petals.push(new Petal());
  (function loop() { ctx.clearRect(0, 0, W, H); petals.forEach(p => p.draw()); requestAnimationFrame(loop); })();
})();

/* ═══════════════════════════════════════
   ORBS
   ═══════════════════════════════════════ */
(function () {
  const el = document.getElementById('orbs'); if (!el) return;
  for (let i = 0; i < 7; i++) {
    const o = document.createElement('div'); o.className = 'orb';
    const s = Math.random() * 110 + 40;
    o.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*88}%;animation-duration:${Math.random()*18+22}s;animation-delay:${-Math.random()*32}s;`;
    el.appendChild(o);
  }
})();

/* ═══════════════════════════════════════
   PAPARAZZI
   ═══════════════════════════════════════ */
(function () {
  const el = document.getElementById('paparazzi'); if (!el) return;
  function flash() {
    const f = document.createElement('div'); f.className = 'flash';
    f.style.left = Math.random() * innerWidth + 'px';
    f.style.top  = Math.random() * innerHeight + 'px';
    el.appendChild(f);
    requestAnimationFrame(() => f.classList.add('go'));
    setTimeout(() => f.remove(), 500);
    setTimeout(flash, Math.random() * 3500 + 700);
  }
  for (let i = 0; i < 3; i++) setTimeout(flash, Math.random() * 2000);
})();

/* ═══════════════════════════════════════
   RIPPLE ON TAP
   ═══════════════════════════════════════ */
document.addEventListener('click', e => {
  const r = document.createElement('div'); r.className = 'ripple';
  r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
  document.body.appendChild(r); setTimeout(() => r.remove(), 850);
});

/* ═══════════════════════════════════════
   TYPEWRITER
   ═══════════════════════════════════════ */
function typeEl(el, speed) {
  speed = speed || 20;
  if (el.dataset.done) return Promise.resolve();
  const raw = el.dataset.raw || el.innerHTML;
  if (!el.dataset.raw) el.dataset.raw = raw;
  el.innerHTML = ''; el.classList.add('typing'); el.style.opacity = '1';

  return new Promise(res => {
    let i = 0;
    function tick() {
      if (i >= raw.length) {
        el.classList.remove('typing'); el.dataset.done = '1'; res(); return;
      }
      /* skip html tags in one shot */
      if (raw[i] === '<') {
        const end = raw.indexOf('>', i);
        if (end !== -1) { el.innerHTML += raw.slice(i, end + 1); i = end + 1; setTimeout(tick, 0); return; }
      }
      el.innerHTML += raw[i++]; setTimeout(tick, speed);
    }
    tick();
  });
}

/* ═══════════════════════════════════════
   SCENES
   ═══════════════════════════════════════ */
const scenes  = [...document.querySelectorAll('.scene')];
const dots    = [...document.querySelectorAll('.dot')];
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let cur = 0, busy = false;

async function go(n) {
  if (n < 0 || n >= scenes.length || n === cur || busy) return;
  busy = true;
  scenes[cur].classList.remove('active');
  dots[cur].classList.remove('on');
  dots[n].classList.add('on');
  cur = n;
  scenes[cur].classList.add('active');
  prevBtn.classList.toggle('off', cur === 0);
  nextBtn.classList.toggle('off', cur === scenes.length - 1);
  setTimeout(() => activate(cur), 250);
  setTimeout(() => { busy = false; }, 2100);
}

async function activate(idx) {
  const sc = scenes[idx];
  sc.querySelectorAll('.fi').forEach(e => e.classList.add('vis'));

  if (idx === 4) {
    const items = sc.querySelectorAll('.s5-list li');
    items.forEach((li, i) => setTimeout(() => li.classList.add('in'), 300 + i * 170));
  }

  const vid = document.getElementById('bvid');
  if (idx === 3 && vid) { vid.currentTime = 0; vid.play().catch(() => {}); }
  else if (vid) vid.pause();

  if (idx === 5) setTimeout(fireworks, 1100);

  for (const el of sc.querySelectorAll('.tw')) {
    await typeEl(el, el.tagName === 'H2' ? 38 : 20);
  }
}

window.addEventListener('load', () => setTimeout(() => activate(0), 600));
dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
prevBtn.addEventListener('click', () => go(cur - 1));
nextBtn.addEventListener('click', () => go(cur + 1));
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(cur + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(cur - 1);
});

/* Touch swipe */
let tx = 0, ty = 0;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = tx - e.changedTouches[0].clientX;
  const dy = ty - e.changedTouches[0].clientY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) dx > 0 ? go(cur + 1) : go(cur - 1);
  else if (Math.abs(dy) > 45) dy > 0 ? go(cur + 1) : go(cur - 1);
}, { passive: true });

let wLock = false;
document.addEventListener('wheel', e => {
  if (wLock) return; wLock = true;
  e.deltaY > 0 ? go(cur + 1) : go(cur - 1);
  setTimeout(() => wLock = false, 2000);
}, { passive: true });

/* ═══════════════════════════════════════
   FIREWORKS
   ═══════════════════════════════════════ */
let fwDone = false;
function fireworks() {
  if (fwDone) return; fwDone = true;
  const fc = document.getElementById('fw-canvas'); if (!fc) return;
  const ctx = fc.getContext('2d');
  fc.width = fc.offsetWidth; fc.height = fc.offsetHeight;

  const colors = ['#f9a8d4','#c4b5fd','#fdf4ff','#f0c67a','#f43f5e','#a78bfa','#e879f9'];
  const allP = [];

  function burst(x, y) {
    for (let i = 0; i < 80; i++) {
      const a = Math.random() * Math.PI * 2, sp = Math.random() * 2.8 + .4;
      allP.push({ x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp,
        r: Math.random() * 2.2 + .5,
        col: colors[Math.floor(Math.random()*colors.length)],
        alpha: 1, decay: Math.random()*.009+.003 });
    }
  }

  const W = fc.width, H = fc.height;
  const pts = [
    [W*.5,  H*.25], [W*.22, H*.32], [W*.78, H*.28],
    [W*.38, H*.2 ], [W*.65, H*.38]
  ];
  pts.forEach(([x,y], i) => setTimeout(() => burst(x, y), i * 380));

  function loop() {
    ctx.clearRect(0,0,W,H);
    let alive = false;
    for (const p of allP) {
      if (p.alpha <= 0) continue;
      alive = true;
      p.x += p.vx; p.y += p.vy; p.vy += .011; p.vx *= .998; p.alpha -= p.decay;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = p.col; ctx.globalAlpha = Math.max(0,p.alpha); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (alive) requestAnimationFrame(loop);
  }
  setTimeout(loop, 100);
}

/* ═══════════════════════════════════════
   MUSIC — Like You, Tatiana Manaois
   ═══════════════════════════════════════ */
const audio  = document.getElementById('music');
const btn    = document.getElementById('music-btn');
let isOn     = false;

audio.volume = 0.32;
audio.loop   = true;

function startMusic() {
  audio.play().then(() => {
    isOn = true; btn.textContent = '♫'; btn.classList.add('on');
  }).catch(() => {});
}

btn.addEventListener('click', () => {
  if (isOn) {
    audio.pause(); isOn = false; btn.textContent = '♪'; btn.classList.remove('on');
  } else {
    startMusic();
  }
});

/* Auto-play on first any interaction — needed for mobile */
function tryPlay() {
  if (!isOn) startMusic();
  ['touchstart','click','keydown'].forEach(ev => document.removeEventListener(ev, tryPlay));
}
['touchstart','click','keydown'].forEach(ev => document.addEventListener(ev, tryPlay, { once: true, passive: true }));
