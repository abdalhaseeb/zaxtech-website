// Address that enquiries are sent to. Replace with the final company mailbox.
const CONTACT_EMAIL = 'contact@zaxtech.ae';

document.documentElement.classList.remove('no-js');

// Sticky nav background
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  nav.classList.toggle('menu-open', open);
};
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// Count-up stats
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters = document.querySelectorAll('[data-count]');
const runCount = (el) => {
  const target = Number(el.dataset.count);
  const suffix = el.querySelector('span').outerHTML;
  if (reduceMotion) { el.innerHTML = target + suffix; return; }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / 1400, 1);
    el.innerHTML = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
if ('IntersectionObserver' in window) {
  const co = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach((el) => co.observe(el));
} else {
  counters.forEach(runCount);
}

// Email link
document.querySelectorAll('.js-email').forEach((a) => {
  a.href = `mailto:${CONTACT_EMAIL}`;
  a.textContent = CONTACT_EMAIL;
});

// Enquiry form: validates, then opens a pre-filled email draft
const form = document.getElementById('contact-form');
const note = form.querySelector('.form__note');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach((f) => {
    const ok = f.value.trim() !== '' && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
    f.setAttribute('aria-invalid', String(!ok));
    if (!ok) valid = false;
  });
  if (!valid) { note.style.color = '#f87171'; note.textContent = 'Please complete the highlighted fields.'; return; }

  const d = Object.fromEntries(new FormData(form));
  const subject = `Enquiry: ${d.interest} — ${d.company || d.name}`;
  const body = `Name: ${d.name}\nEmail: ${d.email}\nCompany: ${d.company}\nInterested in: ${d.interest}\n\n${d.message}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.style.color = '';
  note.textContent = 'Thank you — your email app should open with your enquiry ready to send.';
});

document.getElementById('year').textContent = new Date().getFullYear();
