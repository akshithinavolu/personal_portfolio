/* Final fixed JS — safe guards included */

/* Helpers */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

/* Prevent fatal failure: wrap main in try/catch so a single error won't stop behavior */
try {

  /* Theme toggle */
  const themeToggle = $('#themeToggle');
  on(themeToggle, 'click', () => {
    document.documentElement.classList.toggle('darkmode');
    const dm = document.documentElement.classList.contains('darkmode');
    themeToggle.textContent = dm ? '☀️' : '🌙';
    if(dm){
      document.documentElement.style.setProperty('--bg1','#051025');
      document.documentElement.style.setProperty('--bg2','#07102a');
      document.documentElement.style.setProperty('--card','rgba(10,16,24,0.64)');
      document.documentElement.style.setProperty('--glass-border','rgba(255,255,255,0.04)');
      document.documentElement.style.setProperty('--text','#e6f0ff');
      document.documentElement.style.setProperty('--muted','#9fb2d1');
    } else {
      document.documentElement.style.removeProperty('--bg1');
      document.documentElement.style.removeProperty('--bg2');
      document.documentElement.style.removeProperty('--card');
      document.documentElement.style.removeProperty('--glass-border');
      document.documentElement.style.removeProperty('--text');
      document.documentElement.style.removeProperty('--muted');
    }
  });

  /* Mobile nav */
  const hamburger = $('#hamburger');
  const navLinks = $('.nav-links');
  on(hamburger, 'click', () => {
    if(!navLinks) return;
    const open = navLinks.style.display === 'flex';
    if(open){
      navLinks.style.display = '';
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '64px';
      navLinks.style.right = '18px';
      navLinks.style.background = 'rgba(255,255,255,0.96)';
      navLinks.style.padding = '12px';
      navLinks.style.borderRadius = '12px';
      navLinks.style.boxShadow = '0 12px 40px rgba(6,12,22,0.06)';
      navLinks.style.flexDirection = 'column';
      hamburger.innerHTML = '<i class="fas fa-times"></i>';
    }
  });
  $$('.nav-links a').forEach(a=> a.addEventListener('click', ()=> { if(window.innerWidth<1000){ navLinks.style.display=''; hamburger.innerHTML='<i class="fas fa-bars"></i>'; } }));

  /* Typewriter (safe) */
  (function typewriter(){
    const el = document.getElementById('typewriter');
    if(!el) return;
    const words = ['Software Developer', 'Java', 'Python', 'Web Developer', 'ML & CV Enthusiast'];
    let wi=0, ci=0, forward=true;
    const speed = 55, pause = 900;
    function tick(){
      const w = words[wi];
      if(forward){
        ci++; el.textContent = w.slice(0,ci) + (ci % 2 === 0 ? '|' : '');
        if(ci === w.length){ forward=false; setTimeout(tick, pause); return; }
      } else {
        ci--; el.textContent = w.slice(0,ci) + (ci ? '|' : '');
        if(ci === 0){ forward=true; wi=(wi+1)%words.length; }
      }
      setTimeout(tick, speed);
    }
    tick();
  })();

  /* Particles (light) */
  (function particles(){
    const cvs = document.getElementById('pcanvas');
    if(!cvs) return;
    const ctx = cvs.getContext('2d');
    let w = cvs.width = innerWidth;
    let h = cvs.height = Math.max(300, innerHeight * 0.72);
    const count = Math.max(20, Math.floor((w*h)/90000));
    const arr = [];
    const rnd = (a,b)=> Math.random()*(b-a)+a;
    for(let i=0;i<count;i++) arr.push({x:rnd(0,w), y:rnd(0,h), r:rnd(0.6,2.6), vx:rnd(-0.25,0.25), vy:rnd(-0.12,0.12), a:rnd(0.05,0.16), hue:rnd(200,260)});
    window.addEventListener('resize', ()=>{ w=cvs.width=innerWidth; h=cvs.height=Math.max(300, innerHeight*0.72); });
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(const p of arr){
        p.x += p.vx; p.y += p.vy;
        if(p.x < -10) p.x = w + 10;
        if(p.x > w + 10) p.x = -10;
        if(p.y < -10) p.y = h + 10;
        if(p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue},60%,70%,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* Spotlight & simple parallax */
  (function spotlight(){
    const hero = document.getElementById('hero');
    const spot = document.getElementById('spotlight');
    if(!hero || !spot) return;
    document.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      spot.style.setProperty('--mx', mx + '%');
      spot.style.setProperty('--my', my + '%');
      // blobs
      $$('.blur-blob').forEach((b,i)=>{
        const depth = (i+1)*8;
        const tx = (e.clientX - window.innerWidth/2)/(100 + depth);
        const ty = (e.clientY - window.innerHeight/2)/(140 + depth);
        b.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${i*6}deg)`;
      });
      // profile tilt
      const pc = document.getElementById('profileCard');
      if(pc){
        const r = pc.getBoundingClientRect();
        const cx = r.left + r.width/2; const cy = r.top + r.height/2;
        const rx = (e.clientX - cx)/r.width; const ry = (e.clientY - cy)/r.height;
        pc.style.transform = `perspective(900px) rotateX(${(-ry*6).toFixed(2)}deg) rotateY(${(rx*6).toFixed(2)}deg) translateZ(6px)`;
      }
    });
  })();

  /* Reveal animations (safe) */
  (function reveal(){
    const revealElems = Array.from(document.querySelectorAll('.reveal'));
    if(revealElems.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealElems.forEach(el => {
      // initial state already set via CSS for .js .reveal
      io.observe(el);
    });
  })();

  /* Progress bars */
  (function progressBars(){
    const bars = Array.from(document.querySelectorAll('.prog'));
    if(bars.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const bar = entry.target;
          const span = bar.querySelector('span');
          const value = parseInt(bar.getAttribute('data-value') || bar.dataset.value || '60', 10);
          span.style.width = value + '%';
          io.unobserve(bar);
        }
      });
    }, { threshold: 0.45 });
    bars.forEach(b => io.observe(b));
  })();

  /* Counters */
  (function counters(){
    const nums = Array.from(document.querySelectorAll('.num'));
    if(nums.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const el = entry.target; const target = Number(el.dataset.target) || 0;
          let n = 0; const step = Math.max(1, Math.floor(target / 40));
          const t = setInterval(() => {
            n += step; el.textContent = n >= target ? target : n;
            if(n >= target) clearInterval(t);
          }, 20);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    nums.forEach(n => io.observe(n));
  })();

  /* Modals */
  (function modals(){
    const openBtns = Array.from(document.querySelectorAll('.open-modal'));
    openBtns.forEach(btn => {
      const id = btn.dataset.modal;
      btn.addEventListener('click', () => {
        const m = document.getElementById(id);
        if(!m) return;
        m.classList.add('open'); m.setAttribute('aria-hidden','false');
        const panel = m.querySelector('.modal-panel');
        if(panel){ panel.style.opacity = '0'; panel.style.transform = 'translateY(12px) scale(.98)'; setTimeout(()=>{ panel.style.transition='all .38s cubic-bezier(.2,.9,.3,1)'; panel.style.opacity='1'; panel.style.transform='translateY(0) scale(1)'; }, 12); }
      });
    });
    const closes = Array.from(document.querySelectorAll('.modal-close'));
    closes.forEach(b => b.addEventListener('click', (e) => {
      const m = e.target.closest('.modal'); closeModal(m);
    }));
    document.addEventListener('click', (e) => {
      if(e.target.classList.contains('modal')) closeModal(e.target);
    });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape'){ const m = document.querySelector('.modal.open'); m && closeModal(m); } });
    function closeModal(m){
      if(!m) return;
      const panel = m.querySelector('.modal-panel');
      if(panel){ panel.style.opacity = '0'; panel.style.transform = 'translateY(6px) scale(.99)'; }
      setTimeout(()=>{ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); if(panel) panel.style.transition=''; }, 320);
    }
  })();

  /* Card tilt micro-interactions */
  (function tilt(){
    const cards = Array.from(document.querySelectorAll('[data-tilt], .project-card, .skill-card'));
    cards.forEach(c => {
      c.addEventListener('mousemove', (e) => {
        const r = c.getBoundingClientRect();
        const cx = r.left + r.width/2; const cy = r.top + r.height/2;
        const dx = (e.clientX - cx) / (r.width/2); const dy = (e.clientY - cy) / (r.height/2);
        c.style.transform = `perspective(900px) rotateX(${(-dy*6).toFixed(2)}deg) rotateY(${(dx*6).toFixed(2)}deg) translateZ(6px)`;
      });
      c.addEventListener('mouseleave', ()=> { c.style.transform = ''; });
      c.addEventListener('mouseenter', ()=> { c.style.transition = 'transform .18s var(--ease)'; });
    });
  })();

  /* Timeline progress */
  (function timelineProgress(){
    const container = document.querySelector('.timeline-outer'); const progress = document.getElementById('timelineProgress');
    if(!container || !progress) return;
    function update(){
      const rect = container.getBoundingClientRect();
      const top = rect.top; const h = rect.height; const winH = window.innerHeight;
      const full = Math.min(h, Math.max(0, (winH - top)));
      progress.style.height = `${Math.max(40, full)}px`;
    }
    update();
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
  })();

  /* Contact form demo */
  (function contact(){
    const form = document.getElementById('contactForm'); const msg = document.getElementById('formMsg');
    if(!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (form.name && form.name.value) ? form.name.value.trim() : '';
      const email = (form.email && form.email.value) ? form.email.value.trim() : '';
      const message = (form.message && form.message.value) ? form.message.value.trim() : '';
      if(!name || !email || !message){
        if(msg){ msg.textContent = 'Please fill all fields'; msg.style.color = '#ef4444'; }
        return;
      }
      if(msg){ msg.textContent = 'Thanks — message recorded (demo).'; msg.style.color = '#059669'; }
      form.reset();
    });
  })();

  /* Accessibility: show focus outline after tab */
  (function focusOutlines(){
    function handleFirstTab(e){ if(e.key === 'Tab'){ document.documentElement.classList.add('show-focus'); window.removeEventListener('keydown', handleFirstTab); } }
    window.addEventListener('keydown', handleFirstTab);
  })();

  /* Set year */
  (function year(){ const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear(); })();

} catch (err) {
  // If something unexpected throws, at least log & ensure reveals are visible
  console.error('Portfolio script error:', err);
  // Make sure reveal elements are visible so content never stays hidden
  document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
}
// SKILL CARD TILT PARALLAX
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / 20).toFixed(2);
    const rotateY = ((centerX - x) / 20).toFixed(2);

    card.style.transform = `
      perspective(700px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-10px)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
  });
});
// Contact form send message simulation
document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();

  const msg = document.getElementById("formMsg");
  msg.textContent = "Message sent successfully! I will get back to you.";
  msg.style.color = "#059669";

  this.reset();

  setTimeout(() => { msg.textContent = ""; }, 3000);
});
