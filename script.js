/* ==========================================================================
   Niyati Jain — Portfolio Script
   Handles: dark mode toggle, sticky navbar shadow, active nav link on scroll,
            scroll-reveal animations, back-to-top button, footer year.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. DARK MODE TOGGLE
     Persists the user's preference in localStorage and respects the
     system preference on first visit.
  --------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  const rootEl = document.documentElement;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      rootEl.setAttribute('data-theme', 'dark');
      themeIcon.classList.remove('bi-moon-stars-fill');
      themeIcon.classList.add('bi-sun-fill');
    } else {
      rootEl.removeAttribute('data-theme');
      themeIcon.classList.remove('bi-sun-fill');
      themeIcon.classList.add('bi-moon-stars-fill');
    }
  };

  // Determine initial theme: saved preference > OS preference > light
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = rootEl.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });

  /* ---------------------------------------------------------------------
     2. STICKY NAVBAR SHADOW ON SCROLL
  --------------------------------------------------------------------- */
  const navbar = document.getElementById('mainNav');
  const handleNavbarShadow = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarShadow);
  handleNavbarShadow();

  /* ---------------------------------------------------------------------
     3. SMOOTH SCROLL + COLLAPSE MOBILE MENU ON LINK CLICK
  --------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-link[href^="#"], a.scroll-indicator, .hero-cta a[href^="#"]');
  const navCollapseEl = document.getElementById('navMenu');
  const bsCollapse = navCollapseEl ? new bootstrap.Collapse(navCollapseEl, { toggle: false }) : null;

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile nav after clicking a link
          if (bsCollapse && navCollapseEl.classList.contains('show')) {
            bsCollapse.hide();
          }
        }
      }
    });
  });

  /* ---------------------------------------------------------------------
     4. ACTIVE NAV LINK BASED ON SCROLL POSITION
  --------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id], header[id]');
  const navItems = document.querySelectorAll('.navbar-nav .nav-link');

  const setActiveLink = () => {
    let currentSection = '';
    const scrollPos = window.scrollY + 120; // offset for navbar height

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ---------------------------------------------------------------------
     5. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-aos]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal everything immediately if IntersectionObserver isn't supported
    revealEls.forEach((el) => el.classList.add('aos-visible'));
  }

  /* ---------------------------------------------------------------------
     6. BACK TO TOP BUTTON
  --------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTop');

  const toggleBackToTop = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------------------
     7. DYNAMIC FOOTER YEAR
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});