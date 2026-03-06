/* ============================
   HERWIN CABO PRODUCTION
   script.js
============================ */

/* ---- NAV SCROLL ---- */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- MOBILE MENU ---- */
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileMenu');
  h.classList.toggle('open');
  m.classList.toggle('open');
}

/* ---- HERO VIDEO ---- */
const video = document.getElementById('hero-video');
const heroBg = document.getElementById('heroBg');

if (video && heroBg) {
  video.addEventListener('loadeddata', () => { heroBg.style.display = 'none'; });
  video.addEventListener('error', () => { video.style.display = 'none'; });
}

function toggleVideo() {
  if (!video) return;
  if (video.paused) video.play(); else video.pause();
}

/* ---- SCROLL REVEAL ---- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---- COUNTER ANIMATION ---- */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      let cur = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + '+';
        if (cur >= target) clearInterval(timer);
      }, 40);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ---- FORM ---- */
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    const success = document.getElementById('formSuccess');
    if (success) success.style.display = 'block';
    e.target.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }, 1200);
}

/* ---- VIDEO CAROUSEL ---- */
let vcIndex = 0;

function getVcVisible() {
  return window.innerWidth <= 768 ? 1 : 2;
}

function slideVideos(dir) {
  const carousel = document.getElementById('videoCarousel');
  if (!carousel) return;
  const items = carousel.querySelectorAll('.vc-item');
  const max = items.length - getVcVisible();
  vcIndex = Math.max(0, Math.min(vcIndex + dir, max));
  const itemWidth = items[0].offsetWidth + 24;
  carousel.style.transform = `translateX(-${vcIndex * itemWidth}px)`;
  updateVcDots();
}

function updateVcDots() {
  document.querySelectorAll('.vc-dot').forEach((d, i) => {
    d.classList.toggle('active', i === vcIndex);
  });
}

/* ---- VIDEO LIGHTBOX ---- */
let videoList = [];
let videoIndex = 0;

document.querySelectorAll('.video-thumb-overlay').forEach((overlay, i) => {
  overlay.addEventListener('click', () => {
    const allItems = document.querySelectorAll('.vc-item');
    videoList = Array.from(allItems).map(el => ({
      src: el.querySelector('iframe').src.split('?')[0],
      tag: el.querySelector('.work-tag')?.textContent || '',
      title: el.querySelector('.video-title')?.textContent || ''
    }));
    videoIndex = i;
    openVideoLightbox();
  });
});

function openVideoLightbox() {
  const v = videoList[videoIndex];
  document.getElementById('video-lightbox-iframe').src = v.src + '?autoplay=1&rel=0';
  document.getElementById('video-lightbox-tag').textContent = v.tag;
  document.getElementById('video-lightbox-title').textContent = v.title;
  document.getElementById('video-lightbox').classList.add('open');
}

function changeVideo(dir) {
  videoIndex = (videoIndex + dir + videoList.length) % videoList.length;
  openVideoLightbox();
}

function closeVideoLightbox() {
  document.getElementById('video-lightbox').classList.remove('open');
  document.getElementById('video-lightbox-iframe').src = '';
}

/* ---- KEYBOARD ---- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeVideoLightbox(); }
  const vlb = document.getElementById('video-lightbox');
  if (vlb && vlb.classList.contains('open')) {
    if (e.key === 'ArrowRight') changeVideo(1);
    if (e.key === 'ArrowLeft') changeVideo(-1);
  }
});

/* ---- LOAD ---- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hide');
    }, 2000);
  }

  const carousel = document.getElementById('videoCarousel');
  if (!carousel) return;
  const items = carousel.querySelectorAll('.vc-item');
  const wrap = carousel.closest('.video-carousel-wrap');
  const dotsEl = document.createElement('div');
  dotsEl.className = 'vc-dots';
  items.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'vc-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => { vcIndex = i; slideVideos(0); };
    dotsEl.appendChild(dot);
  });
  wrap.after(dotsEl);
});

window.addEventListener('resize', () => slideVideos(0));

/* ---- HERO IDLE ---- */
let idleTimer;
const heroEl = document.getElementById('hero');
const navbar = document.getElementById('navbar');

function startIdleTimer() {
  if (!heroEl || !video) return;
  clearTimeout(idleTimer);
  heroEl.classList.remove('hero-idle');
  if (navbar) navbar.style.opacity = '1';
  idleTimer = setTimeout(() => {
    if (!video.paused) {
      heroEl.classList.add('hero-idle');
      if (navbar) navbar.style.opacity = '0';
    }
  }, 7000);
}

document.addEventListener('mousemove', startIdleTimer);

if (video) {
  video.addEventListener('play', startIdleTimer);
  video.addEventListener('pause', () => {
    clearTimeout(idleTimer);
    if (heroEl) heroEl.classList.remove('hero-idle');
    if (navbar) navbar.style.opacity = '1';
  });
}
