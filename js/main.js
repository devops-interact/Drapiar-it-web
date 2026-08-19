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

    // Auto-hide when scrolling down, show when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > 90 && (!navMenu || !navMenu.classList.contains('open'))) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  });

  /* ==========================================
     2. MOBILE NAVIGATION MENU
     ========================================== */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('is-active', isOpen);
      
      const spans = menuToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[0].style.backgroundColor = '#000A9C';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
        spans[2].style.backgroundColor = '#000A9C';
      } else {
        spans[0].style.transform = 'none';
        spans[0].style.backgroundColor = '#000A9C';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        spans[2].style.backgroundColor = '#000A9C';
      }
    });

    // Close mobile menu when clicking any nav link
    navMenu.querySelectorAll('a:not(#solutionsToggle)').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('is-active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[0].style.backgroundColor = '#000A9C';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        spans[2].style.backgroundColor = '#000A9C';
      });
    });
  }

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

  initScrollReveal();
  initMethodologyScrollReactive();
  initCaseVideoHover();
});
