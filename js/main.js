// ======================================================
//  TIANA LUCK — main.js
// ======================================================

// --- Theme toggle ---
(function themeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  function update(isLight) {
    const icon = btn.querySelector('.toggle-icon');
    icon.textContent = isLight ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  }

  const isLight = document.documentElement.classList.contains('light-mode');
  update(isLight);

  btn.addEventListener('click', () => {
    const nowLight = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('theme', nowLight ? 'light' : 'dark');
    update(nowLight);
  });
})();

// --- Fog particles ---
(function spawnFog() {
  const layer = document.getElementById('fog-layer');
  if (!layer) return;
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'fog-particle';
    const size = 200 + Math.random() * 400;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}vh;
      left: -${size}px;
      animation-duration: ${20 + Math.random() * 30}s;
      animation-delay: ${Math.random() * 20}s;
    `;
    layer.appendChild(p);
  }
})();

// --- Cinematic hero background ---
(function heroBackground() {
  const darkVideo  = document.querySelector('.bg-video-dark');
  const lightVideo = document.querySelector('.bg-video-light');
  if (!darkVideo || !lightVideo) return;

  const RATE         = 0.7;
  const TRANSITION_MS = 800;
  const html         = document.documentElement;

  // Respect reduced-motion — poster images remain, videos never play
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function play(v) {
    v.playbackRate = RATE;
    v.play().catch(() => {});
  }

  // Fade the video in only once the browser has enough data to play
  // smoothly — eliminates the black flash on slow connections.
  function playWhenReady(v) {
    if (v.readyState >= 3) { // HAVE_FUTURE_DATA
      play(v);
    } else {
      v.addEventListener('canplay', () => play(v), { once: true });
    }
  }

  // Lazy-load the inactive video's src — the <video> element carries
  // a poster= so the user sees the still image immediately.
  // We only set src (triggering the download) when the theme actually
  // switches to that mode for the first time.
  const lightSrc = lightVideo.src || lightVideo.getAttribute('src') || '';
  const darkSrc  = darkVideo.src  || darkVideo.getAttribute('src')  || '';
  const isLight  = () => html.classList.contains('light-mode');

  // Strip the inactive video's src on load so the browser doesn't
  // start fetching the 84 MB light file on a dark-mode page visit.
  if (!isLight()) {
    lightVideo.removeAttribute('src');
    lightVideo.load(); // reset to poster state
  } else {
    darkVideo.removeAttribute('src');
    darkVideo.load();
  }

  let lightLoaded = isLight();
  let darkLoaded  = !isLight();

  function ensureLoaded(v, src, cb) {
    if (v.src && v.src !== window.location.href) { cb(); return; }
    v.src = src;
    v.load();
    v.addEventListener('canplay', cb, { once: true });
  }

  // Start the active video immediately
  if (!isLight()) {
    playWhenReady(darkVideo);
  } else {
    playWhenReady(lightVideo);
  }

  let willChangeTimer = null;

  function syncPlayback() {
    clearTimeout(willChangeTimer);
    darkVideo.style.willChange  = 'opacity';
    lightVideo.style.willChange = 'opacity';
    willChangeTimer = setTimeout(() => {
      darkVideo.style.willChange  = 'auto';
      lightVideo.style.willChange = 'auto';
    }, TRANSITION_MS + 100);

    const light    = isLight();
    const outgoing = light ? darkVideo  : lightVideo;
    const incoming = light ? lightVideo : darkVideo;
    const inSrc    = light ? lightSrc   : darkSrc;

    // Load and play the incoming video (first switch only triggers download)
    ensureLoaded(incoming, inSrc, () => play(incoming));

    setTimeout(() => {
      if (isLight() === light) outgoing.pause();
    }, TRANSITION_MS + 50);
  }

  const observer = new MutationObserver(syncPlayback);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });

  document.addEventListener('visibilitychange', () => {
    const active = isLight() ? lightVideo : darkVideo;
    if (document.hidden) {
      active.pause();
    } else {
      playWhenReady(active);
    }
  });
})();

// --- Sticky header ---
(function stickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// --- Mobile nav toggle ---
(function mobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  // Inject logo at top of menu (mobile only — not in desktop HTML)
  const menuLogo = document.createElement('img');
  menuLogo.src = document.documentElement.classList.contains('light-mode')
    ? 'images/brand/tiana-luck-logo-light.png'
    : 'images/brand/tiana-luck-logo-dark.png';
  menuLogo.alt = 'Tiana Luck';
  menuLogo.className = 'mobile-menu-logo';
  links.prepend(menuLogo);

  // Keep logo in sync with theme changes
  const themeObserver = new MutationObserver(() => {
    menuLogo.src = document.documentElement.classList.contains('light-mode')
      ? 'images/brand/tiana-luck-logo-light.png'
      : 'images/brand/tiana-luck-logo-dark.png';
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Inject social icons strip at bottom of menu
  const socials = document.createElement('div');
  socials.className = 'mobile-menu-socials';
  socials.innerHTML = `
    <a href="#" aria-label="Instagram">&#9824;</a>
    <a href="#" aria-label="TikTok">&#9827;</a>
    <a href="#" aria-label="YouTube">&#9826;</a>
    <a href="#" aria-label="Wattpad">&#9825;</a>
  `;
  links.appendChild(socials);

  let savedScrollY = 0;
  function openNav() {
    savedScrollY = window.scrollY;
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    links.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }
  function closeNav() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  toggle.addEventListener('click', () => {
    links.classList.contains('open') ? closeNav() : openNav();
  });

  // Close when a nav link is tapped
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
})();

// --- Newsletter form ---
function handleNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type=email]').value;
  e.target.reset();
  showToast('You\'re on the list! You\'ll hear from Tiana soon. ✨');
}

// --- Contact form ---
function handleContact(e) {
  e.preventDefault();
  e.target.reset();
  showToast('Message sent! Tiana will get back to you soon.');
}

// --- Review form ---
function handleReview(e) {
  e.preventDefault();
  const name   = e.target.querySelector('[name=name]').value;
  const text   = e.target.querySelector('[name=review]').value;
  const rating = e.target.querySelector('[name=rating]').value;
  const stars  = '★'.repeat(parseInt(rating)) + '☆'.repeat(5 - parseInt(rating));
  const grid   = document.getElementById('reviewsGrid');
  if (grid) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-stars">${stars}</div>
      <p class="review-text">"${text}"</p>
      <p class="review-author"><strong>${name}</strong> &mdash; Reader</p>
    `;
    grid.prepend(card);
  }
  e.target.reset();
  showToast('Thanks for your feedback! 💙');
}

// --- Intersection observer for fade-in animations ---
(function fadeIn() {
  const targets = document.querySelectorAll('.update-card, .blog-card, .vlog-card, .read-card, .review-card, .chapter-item');
  if (!targets.length || !window.IntersectionObserver) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  targets.forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(20px)';
    t.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    io.observe(t);
  });
})();

// --- Currently writing badge ---
(function writingBadge() {
  const CURRENT = { title: 'Before Dawn', chapter: 4, progress: 65 };
  const badge = document.createElement('a');
  badge.href = 'books.html';
  badge.className = 'writing-badge';
  badge.setAttribute('aria-label', `Currently writing: ${CURRENT.title} Chapter ${CURRENT.chapter}`);
  badge.innerHTML = `
    <span class="writing-badge-dot"></span>
    <span class="writing-badge-text">Writing Ch.${CURRENT.chapter} &mdash; ${CURRENT.progress}%</span>
  `;
  document.body.appendChild(badge);
})();

// --- Chapter excerpt toggle (books page) ---
function toggleExcerpt(id) {
  const box = document.getElementById(id);
  if (!box) return;
  const isOpen = box.style.display !== 'none';
  box.style.display = isOpen ? 'none' : 'block';
  const btn = document.querySelector(`[aria-controls="${id}"]`);
  if (btn) btn.setAttribute('aria-expanded', String(!isOpen));
}

// --- Toast helper ---
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// --- Star rating UI ---
(function starRating() {
  const stars = document.querySelectorAll('.star-input');
  stars.forEach((star, i) => {
    star.addEventListener('click', () => {
      stars.forEach((s, j) => {
        s.textContent = j <= i ? '★' : '☆';
        s.style.color  = j <= i ? 'var(--accent2)' : 'var(--muted)';
      });
      const input = document.querySelector('[name=rating]');
      if (input) input.value = i + 1;
    });
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, j) => {
        s.textContent = j <= i ? '★' : '☆';
        s.style.color  = j <= i ? 'var(--accent2)' : 'var(--muted)';
      });
    });
  });
  const container = document.querySelector('.star-rating');
  if (container) {
    container.addEventListener('mouseleave', () => {
      const val = parseInt(document.querySelector('[name=rating]')?.value || 0);
      stars.forEach((s, j) => {
        s.textContent = j < val ? '★' : '☆';
        s.style.color  = j < val ? 'var(--accent2)' : 'var(--muted)';
      });
    });
  }
})();
