

'use strict';

(function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navbar.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

(function initHero() {
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('loaded'));
  }
})();

(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const end   = parseInt(el.dataset.count, 10);
      const dur   = 1600;
      const step  = Math.ceil(end / (dur / 16));
      let   cur   = 0;

      const tick = () => {
        cur = Math.min(cur + step, end);
        el.textContent = cur + (el.dataset.suffix || '');
        if (cur < end) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successEl = document.getElementById('formSuccess');

  function getField(name) {
    return form.querySelector(`[name="${name}"]`);
  }

  function showError(field, msg) {
    field.classList.add('error');
    const errEl = field.nextElementSibling;
    if (errEl && errEl.classList.contains('error-msg')) {
      errEl.textContent = msg;
      errEl.classList.add('show');
    }
  }

  function clearError(field) {
    field.classList.remove('error');
    const errEl = field.nextElementSibling;
    if (errEl && errEl.classList.contains('error-msg')) {
      errEl.classList.remove('show');
    }
  }

  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('blur',  () => validateField(field));
  });

  function validateField(field) {
    const val = field.value.trim();
    if (field.hasAttribute('required') && !val) {
      showError(field, 'This field is required.');
      return false;
    }
    if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(field, 'Please enter a valid email address.');
      return false;
    }
    if (field.name === 'phone' && val && !/^[\d\s\+\-\(\)]{7,}$/.test(val)) {
      showError(field, 'Please enter a valid phone number.');
      return false;
    }
    clearError(field);
    return true;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input, textarea, select').forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) return;

    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successEl) {
        successEl.classList.add('show');
      }
    }, 1200);
  });
})();

(function initServicesCarousel() {
  const track = document.querySelector('[data-services-track]');
  if (!track) return;

  const prevBtn = document.querySelector('.services-nav-prev');
  const nextBtn = document.querySelector('.services-nav-next');
  const firstCard = track.querySelector('.svc-card');
  if (!prevBtn || !nextBtn || !firstCard) return;

  function getStep() {
    const gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '0');
    return firstCard.getBoundingClientRect().width + gap;
  }

  function updateButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth - 4;
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  }

  function move(direction) {
    track.scrollBy({ left: getStep() * direction, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => move(-1));
  nextBtn.addEventListener('click', () => move(1));
  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);

  updateButtons();
})();

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
