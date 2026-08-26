document.addEventListener('DOMContentLoaded', () => {
  // Global DOM elements
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const solutionsToggle = document.getElementById('solutionsToggle');
  const solutionsDropdown = document.getElementById('solutionsDropdown');
  
  // Floating Modal DOM elements
  const contactModal = document.getElementById('contactModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalForm = document.getElementById('modalForm');
  const modalSuccessOverlay = document.getElementById('modalSuccessOverlay');
  
  // Standalone Contact Page DOM elements
  const pageContactForm = document.getElementById('pageContactForm');
  const pageSuccessOverlay = document.getElementById('pageSuccessOverlay');

  /* ==========================================
     1. HEADER SCROLL EFFECT
     ========================================== */
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('header-shrunk');
    } else {
      header.classList.remove('header-shrunk');
    }

    // Header is ALWAYS visible during scroll
    header.classList.remove('header-hidden');

    lastScrollY = currentScrollY;
  });

  /* ==========================================
     2. MOBILE NAVIGATION MENU & INTERACTIVE CARDS
     ========================================== */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('is-active', isOpen);
    });

    // Close mobile menu when clicking any nav link
    navMenu.querySelectorAll('a:not(#solutionsToggle)').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('is-active');
      });
    });
  }

  // Mobile Capacidades Card Tap/Touch Toggle
  document.querySelectorAll('#unidades .unit-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        // Toggle active state on touch to expand description
        const isAlreadyActive = card.classList.contains('active');
        document.querySelectorAll('#unidades .unit-card').forEach(c => c.classList.remove('active'));
        if (!isAlreadyActive) {
          card.classList.add('active');
        }
      }
    });
  });

  // Mobile Solutions Accordion
  if (solutionsToggle && solutionsDropdown) {
    solutionsToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        solutionsToggle.parentElement.classList.toggle('open');
        solutionsDropdown.classList.toggle('open');
      }
    });
  }

  /* ==========================================
     3. DIRECT WHATSAPP CONTACT REDIRECT
     ========================================== */
  const WA_URL = 'https://wa.me/5218131567814';
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(WA_URL, '_blank', 'noopener,noreferrer');
    });
  });

  /* ==========================================
     4. FORM VALIDATION & LEAD ACQUISITION
     ========================================== */
  const publicEmailDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'live.com', 'icloud.com', 'aol.com', 'zoho.com', 'mail.com'
  ];

  const validateField = (input) => {
    const group = input.closest('.form-group');
    if (!group) return true;

    let isValid = true;
    let errorMsg = '';

    // Check empty validation
    if (input.required && !input.value.trim()) {
      isValid = false;
      errorMsg = 'Este campo es obligatorio.';
    } 
    // Email specific validation
    else if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        isValid = false;
        errorMsg = 'Por favor, ingresa un correo electrónico válido.';
      } else {
        // Corporate email warning/error check
        const domain = input.value.split('@')[1].toLowerCase();
        if (publicEmailDomains.includes(domain)) {
          isValid = false;
          errorMsg = 'Por favor, ingresa un correo corporativo (no dominios públicos como Gmail, Yahoo, etc.).';
        }
      }
    }

    if (!isValid) {
      group.classList.add('has-error');
      let errorLabel = group.querySelector('.form-error-msg');
      if (errorLabel) {
        errorLabel.textContent = errorMsg;
      }
    } else {
      group.classList.remove('has-error');
    }

    return isValid;
  };

  const clearValidationErrors = (form) => {
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error');
    });
  };

  // Register real-time validation listeners on input blur
  const setupFormValidation = (form) => {
    if (!form) return;
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        // Clear errors while typing
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });
  };

  setupFormValidation(modalForm);
  setupFormValidation(pageContactForm);

  const handleFormSubmit = (e, form, successOverlay) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('input, select, textarea');
    let formIsValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        formIsValid = false;
      }
    });

    if (formIsValid) {
      // Collect values
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      console.log('Lead Captured Successfully:', data);

      // Trigger analytics tracker simulated events
      if (window.gtag) {
        window.gtag('event', 'lead_submission', {
          'event_category': 'Engagement',
          'event_label': data.interest,
          'value': 1
        });
      }

      // Show success screen within overlay container
      if (successOverlay) {
        successOverlay.classList.add('active');
      }

      form.reset();
    }
  };

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => handleFormSubmit(e, modalForm, modalSuccessOverlay));
  }

  if (pageContactForm) {
    pageContactForm.addEventListener('submit', (e) => handleFormSubmit(e, pageContactForm, pageSuccessOverlay));
  }

  /* ==========================================
     5. DYNAMIC PRE-SELECTION (URL ROUTING)
     ========================================== */
  const urlParams = new URLSearchParams(window.location.search);
  const interestParam = urlParams.get('interest');
  if (interestParam) {
    // Attempt select element on standalone contact page
    const pageSelect = document.querySelector('#pageContactForm select[name="interest"]');
    if (pageSelect) {
      pageSelect.value = interestParam;
    }
    
    // Also trigger modal automatically if requested via special CTA link ?open_modal=true&interest=rpa
    if (urlParams.get('open_modal') === 'true') {
      openModal(interestParam);
    }
  }

  /* ==========================================
     6. SCROLL REVEAL ANIMATIONS (DESKTOP & MOBILE BULLETPROOF)
     ========================================== */
  const initScrollReveal = () => {
    const staggerContainers = [
      '.trust-grid',
      '.grid-2',
      '.grid-3',
      '.grid-4',
      '.grid-8',
      '.reto-right-grid',
      '.industries-grid',
      '.diffs-grid',
      '.results-grid',
      '.results-list',
      '.about-grid',
      '.methodology-timeline',
      '.reveal-stagger'
    ];

    const isMobile = window.innerWidth <= 768;
    staggerContainers.forEach(containerSelector => {
      document.querySelectorAll(containerSelector).forEach(container => {
        const children = Array.from(container.children);
        const delayStep = isMobile ? 40 : (containerSelector === '.methodology-timeline' ? 160 : 110);
        const maxDelay = isMobile ? 160 : (containerSelector === '.methodology-timeline' ? 640 : 440);
        children.forEach((child, index) => {
          if (!child.classList.contains('reveal')) {
            child.classList.add('reveal');
          }
          child.style.transitionDelay = `${Math.min(index * delayStep, maxDelay)}ms`;
        });
      });
    });

    const componentSelectors = [
      '.section-header',
      '.trust-title',
      '.trust-card',
      '.unit-card',
      '.pain-point',
      '.step-card',
      '.result-item',
      '.industry-card',
      '.diff-card',
      '.cta-final',
      '.about-box',
      '.contact-info-panel',
      '.contact-form-panel',
      '.reto-left',
      '.methodology-timeline'
    ];

    document.querySelectorAll(componentSelectors.join(', ')).forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });

    const checkScrollReveal = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const revealElements = document.querySelectorAll('.reveal:not(.revealed)');
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 60 && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.05
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
      });
    }

    // Scroll & load listeners as guaranteed fallback for Desktop & Mobile
    window.addEventListener('scroll', checkScrollReveal, { passive: true });
    window.addEventListener('resize', checkScrollReveal, { passive: true });
    
    // Double requestAnimationFrame ensures browser paints the initial opacity:0 state before revealing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        checkScrollReveal();
        setTimeout(checkScrollReveal, 200);
      });
    });
  };

  // Dedicated Scroll-Reactive Controller for Methodology Steps
  const initMethodologyScrollReactive = () => {
    const section = document.getElementById('metodologia');
    if (!section) return;

    const timeline = section.querySelector('.methodology-timeline');
    const steps = Array.from(section.querySelectorAll('.methodology-step'));
    if (!steps.length) return;

    const updateScrollProgress = () => {
      const isMobile = window.innerWidth <= 768;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (isMobile) {
        steps.forEach(step => {
          const rect = step.getBoundingClientRect();
          if (rect.top < windowHeight - 60) {
            step.classList.add('revealed');
          }
        });
        return;
      }

      // Desktop: Direct Scroll-Position-Driven Step Reveal
      const rect = section.getBoundingClientRect();
      const startPos = windowHeight * 0.85;
      const endPos = windowHeight * 0.18;
      const totalDistance = startPos - endPos;
      
      let progress = (startPos - rect.top) / totalDistance;
      progress = Math.max(0, Math.min(1, progress));

      const thresholds = [0.08, 0.32, 0.58, 0.82];

      steps.forEach((step, idx) => {
        if (progress >= thresholds[idx]) {
          step.classList.add('revealed');
        } else {
          step.classList.remove('revealed');
        }
      });

      if (timeline) {
        const lineWidth = Math.min(84, Math.max(0, progress * 88));
        timeline.style.setProperty('--line-progress', `${lineWidth}%`);
        if (progress > 0.05) {
          timeline.classList.add('revealed');
        } else {
          timeline.classList.remove('revealed');
        }
      }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    
    updateScrollProgress();
    setTimeout(updateScrollProgress, 150);
  };

  /* ==========================================
     Hover Video Slide-in Controller (Despliegues en el campo)
     ========================================== */
  const initCaseVideoHover = () => {
    document.querySelectorAll('.case-editorial-card').forEach(card => {
      const video = card.querySelector('.case-editorial-video');
      if (video) {
        card.addEventListener('mouseenter', () => {
          video.currentTime = 0;
          video.play().catch(() => {});
        });
        card.addEventListener('mouseleave', () => {
          video.pause();
        });
      }
    });
  };

  /* Ensure all background & case videos are 100% silent across all browsers */
  document.querySelectorAll('video').forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
  });

  /* ==========================================
     LANGUAGE SELECTOR DROPDOWN & SWITCHING
     ========================================== */
  const initLanguageSelector = () => {
    const langSelectorBtn = document.getElementById('langSelectorBtn');
    const langSelectorDropdown = document.querySelector('.lang-selector-dropdown');

    if (!langSelectorBtn || !langSelectorDropdown) return;

    langSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langSelectorDropdown.classList.toggle('open');
      langSelectorBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!langSelectorDropdown.contains(e.target)) {
        langSelectorDropdown.classList.remove('open');
        langSelectorBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langSelectorDropdown.classList.contains('open')) {
        langSelectorDropdown.classList.remove('open');
        langSelectorBtn.setAttribute('aria-expanded', 'false');
        langSelectorBtn.focus();
      }
    });    // Automatically compute target URL for equivalent page in opposite language
    const currentPath = window.location.pathname;
    const langOptions = langSelectorDropdown.querySelectorAll('.lang-option');

    const getRepoPrefix = () => {
      const parts = currentPath.split('/');
      const enIdx = parts.indexOf('EN');
      const esIdx = parts.indexOf('ES');
      const langIdx = enIdx !== -1 ? enIdx : esIdx;
      if (langIdx > 1) {
        return parts.slice(0, langIdx).join('/');
      }
      return '';
    };

    const prefix = getRepoPrefix();

    langOptions.forEach(opt => {
      const targetLang = opt.getAttribute('data-lang');
      let targetPath = '';

      if (currentPath.includes('aviso-de-privacidad.html')) {
        targetPath = targetLang === 'EN' ? `${prefix}/EN/privacy-notice.html` : `${prefix}/ES/aviso-de-privacidad.html`;
      } else if (currentPath.includes('privacy-notice.html')) {
        targetPath = targetLang === 'ES' ? `${prefix}/ES/aviso-de-privacidad.html` : `${prefix}/EN/privacy-notice.html`;
      } else if (currentPath.includes('/EN/')) {
        targetPath = currentPath.replace('/EN/', `/${targetLang}/`);
      } else if (currentPath.includes('/ES/')) {
        targetPath = currentPath.replace('/ES/', `/${targetLang}/`);
      } else {
        const pageName = currentPath.split('/').pop() || 'index.html';
        const cleanPage = pageName === '' ? 'index.html' : pageName;
        if (currentPath.includes('/soluciones/')) {
          targetPath = `${prefix}/${targetLang}/soluciones/${cleanPage}`;
        } else {
          targetPath = `${prefix}/${targetLang}/${cleanPage}`;
        }
      }

      opt.setAttribute('href', targetPath);
    });
  };

  initScrollReveal();
  initMethodologyScrollReactive();
  initCaseVideoHover();
  initLanguageSelector();

  /* ==========================================
     COOKIE CONSENT BANNER & PREFERENCES CONTROLLER
     ========================================== */
  const initCookieConsent = () => {
    const isEn = window.location.pathname.includes('/EN/');
    const storageKey = 'drapiar_cookie_consent';
    const savedConsent = localStorage.getItem(storageKey);

    const getRepoPrefix = () => {
      const parts = window.location.pathname.split('/');
      const enIdx = parts.indexOf('EN');
      const esIdx = parts.indexOf('ES');
      const langIdx = enIdx !== -1 ? enIdx : esIdx;
      if (langIdx > 1) {
        return parts.slice(0, langIdx).join('/');
      }
      return '';
    };
    const prefix = getRepoPrefix();

    // Create Cookie Banner HTML
    const bannerHTML = `
      <div id="cookieBanner" class="cookie-banner-wrap" role="region" aria-label="Cookie consent">
        <p class="cookie-text">
          ${isEn 
            ? 'We use cookies to improve your experience and analyze site usage.' 
            : 'Utilizamos cookies para mejorar tu experiencia y analizar el uso del sitio.'}
        </p>
        <div class="cookie-actions">
          <button type="button" id="cookieAcceptBtn" class="btn-cookie-accept">${isEn ? 'ACCEPT' : 'ACEPTAR'}</button>
          <button type="button" id="cookieDenyBtn" class="btn-cookie-deny">${isEn ? 'DENY' : 'RECHAZAR'}</button>
          <button type="button" id="cookieManageBtn" class="btn-cookie-manage">${isEn ? 'MANAGE' : 'CONFIGURAR'}</button>
        </div>
      </div>

      <div id="cookieModal" class="cookie-modal-overlay" aria-hidden="true" role="dialog">
        <div class="cookie-modal-card">
          <h4 class="cookie-modal-title">${isEn ? 'Cookie Preferences' : 'Preferencias de Cookies'}</h4>
          <p class="cookie-modal-desc">
            ${isEn 
              ? 'Manage your privacy preferences for optional technologies. For details, read our' 
              : 'Gestiona tus preferencias de privacidad para tecnologías opcionales. Para detalles, consulta nuestro'}
            <a href="${isEn ? `${prefix}/EN/privacy-notice.html` : `${prefix}/ES/aviso-de-privacidad.html`}" style="color: #60A5FA; text-decoration: underline;">
              ${isEn ? 'Privacy Notice' : 'Aviso de Privacidad'}
            </a>.
          </p>`</p>

          <div class="cookie-option-row">
            <div class="cookie-option-info">
              <h5>${isEn ? 'Strictly Necessary Cookies' : 'Cookies Estrictamente Necesarias'}</h5>
              <p>${isEn ? 'Required for core security, navigation, and language settings.' : 'Requeridas para seguridad, navegación y selección de idioma.'}</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked disabled>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="cookie-option-row">
            <div class="cookie-option-info">
              <h5>${isEn ? 'Analytics & Performance' : 'Analíticas y Rendimiento'}</h5>
              <p>${isEn ? 'Allows anonymous aggregate traffic measurement.' : 'Permite medir el tráfico del sitio de forma anónima.'}</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="analyticsToggle">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="cookie-modal-footer">
            <button type="button" id="cookieSavePrefBtn" class="btn-cookie-accept" style="padding: 10px 20px;">
              ${isEn ? 'Save Preferences' : 'Guardar Preferencias'}
            </button>
            <button type="button" id="cookieCloseModalBtn" class="btn-cookie-deny" style="padding: 10px 16px;">
              ${isEn ? 'Close' : 'Cerrar'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);

    const banner = document.getElementById('cookieBanner');
    const modal = document.getElementById('cookieModal');
    const acceptBtn = document.getElementById('cookieAcceptBtn');
    const denyBtn = document.getElementById('cookieDenyBtn');
    const manageBtn = document.getElementById('cookieManageBtn');
    const savePrefBtn = document.getElementById('cookieSavePrefBtn');
    const closeModalBtn = document.getElementById('cookieCloseModalBtn');
    const analyticsToggle = document.getElementById('analyticsToggle');

    // Show banner if no consent choice saved
    if (!savedConsent) {
      setTimeout(() => {
        if (banner) banner.classList.add('active');
      }, 700);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        if (analyticsToggle) {
          analyticsToggle.checked = parsed.analytics === true;
        }
      } catch(e) {}
    }

    const saveChoice = (choice, analytics = false) => {
      const data = { choice, analytics, timestamp: Date.now() };
      localStorage.setItem(storageKey, JSON.stringify(data));
      if (banner) banner.classList.remove('active');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    };

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => saveChoice('accepted', true));
    }

    if (denyBtn) {
      denyBtn.addEventListener('click', () => saveChoice('denied', false));
    }

    if (manageBtn) {
      manageBtn.addEventListener('click', () => {
        if (modal) {
          modal.classList.add('active');
          modal.setAttribute('aria-hidden', 'false');
        }
      });
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        if (modal) {
          modal.classList.remove('active');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }

    if (savePrefBtn) {
      savePrefBtn.addEventListener('click', () => {
        const isAnalyticsOn = analyticsToggle ? analyticsToggle.checked : false;
        saveChoice('managed', isAnalyticsOn);
      });
    }
  };

  initCookieConsent();

});
