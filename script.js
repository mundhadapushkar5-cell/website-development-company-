// ============================================
// DEPTHWORK — interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu after clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Hero 3D cube — mouse parallax ---------- */
  const stage = document.getElementById('stage');
  const cube = document.getElementById('cube');

  if (stage && cube && !prefersReducedMotion) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = px * 40;
      targetX = -py * 40;
    });

    stage.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    function animateCube() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      cube.style.setProperty('--tiltX', currentX + 'deg');
      cube.style.setProperty('--tiltY', currentY + 'deg');
      cube.style.transform = `rotateX(var(--tiltX)) rotateY(var(--tiltY))`;
      requestAnimationFrame(animateCube);
    }

    // Pause the CSS keyframe spin while user is actively steering with the mouse,
    // resume ambient spin on leave (handled purely via the animation-play-state hover rule in CSS).
    requestAnimationFrame(animateCube);
  }

  /* ---------- Pricing card 3D tilt ---------- */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (!prefersReducedMotion) {
    tiltCards.forEach(card => {
      const maxTilt = 8;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = px * maxTilt * 2;
        const rotateX = -py * maxTilt * 2;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Contact form (front-end only demo) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form && formNote) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const tierSelect = document.getElementById('tier');
      const tierLabel = tierSelect.options[tierSelect.selectedIndex].text;
      const message = document.getElementById('message').value.trim();

      if (!name || !message) {
        formNote.textContent = 'Please fill in your name and project details.';
        formNote.style.color = '#FF5C8A';
        return;
      }

      // This is a front-end only demo: no backend is wired up.
      // Replace this block with a real submission (fetch to your API,
      // a form service like Formspree, or a mailto: fallback) when you deploy.
      formNote.textContent = `Thanks, ${name}! Your ${tierLabel.split(' — ')[0]} request is ready to send — connect a backend to complete delivery.`;
      formNote.style.color = '#3FE0C5';
      form.reset();
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main > section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.style.color = '');
          link.style.color = '#F1EFFB';
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(section => navObserver.observe(section));
  }
});
                             
