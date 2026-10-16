/**
 * Apex Canine - Static Landing Page Application Logic
 * Adheres strictly to Corporate TRD:
 * - Happy Path Interactivity & Structured Data Output
 * - Unhappy Path Handling: Empty States, Bad Connectivity / 3G Simulation, Invalid Input Highlighting
 * - Non-Functional Requirements: Accessibility, Telemetry Logging, XSS Input Sanitization
 */

/**
 * XSS Sanitizer: strips and escapes potentially malicious HTML/JS payloads
 * @param {string} rawString
 * @returns {string} sanitized string
 */
export function sanitizeInput(rawString) {
  if (typeof rawString !== 'string') {
    return '';
  }

  // Remove dangerous script / image execution vectors
  let clean = rawString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<img\b[^>]*onerror=[^>]*>/gi, '')
    .replace(/on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');

  // Escape HTML control characters
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  clean = clean.replace(/[&<>"'/]/g, (s) => entityMap[s] || s);

  return clean.trim();
}

/**
 * Enterprise Telemetry Logger: logs structured analytics events
 * @param {string} action
 * @param {Record<string, unknown>} [details]
 */
export function logTelemetry(action, details = {}) {
  const detailsStr = Object.keys(details).length ? ` | Details: ${JSON.stringify(details)}` : '';
  console.log(`[Analytics] User interacted with Static Landing Page - ${action}${detailsStr}`);
}

/**
 * Extracts and sanitizes current booking form data
 * @returns {Record<string, string>}
 */
export function getFormData() {
  const nameEl = document.querySelector('#client-name');
  const emailEl = document.querySelector('#client-email');
  const phoneEl = document.querySelector('#client-phone');
  const dogEl = document.querySelector('#dog-name');
  const serviceEl = document.querySelector('#service-type');
  const dateEl = document.querySelector('#booking-date');
  const notesEl = document.querySelector('#special-notes');

  return {
    clientName: nameEl ? sanitizeInput(nameEl.value) : '',
    clientEmail: emailEl ? sanitizeInput(emailEl.value) : '',
    clientPhone: phoneEl ? sanitizeInput(phoneEl.value) : '',
    dogName: dogEl ? sanitizeInput(dogEl.value) : '',
    serviceType: serviceEl ? sanitizeInput(serviceEl.value) : '',
    bookingDate: dateEl ? sanitizeInput(dateEl.value) : '',
    specialNotes: notesEl ? sanitizeInput(notesEl.value) : '',
  };
}

/**
 * Unhappy Path Form Validation: Highlights offending fields in red and updates ARIA
 * @returns {boolean} true if valid, false if invalid
 */
export function validateForm() {
  const form = document.querySelector('#booking-form');
  if (!form) return false;

  const errorSummary = document.querySelector('#form-error-summary');
  const errorList = document.querySelector('#error-list');
  const errors = [];

  const fields = [
    {
      id: '#client-name',
      label: 'Full Name',
      isValid: (v) => v.length >= 2,
      msg: 'Full name must contain at least 2 characters.',
    },
    {
      id: '#client-email',
      label: 'Email Address',
      isValid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      msg: 'Please provide a valid corporate or personal email address (e.g. name@company.com).',
    },
    {
      id: '#client-phone',
      label: 'Phone Number',
      isValid: (v) => v.replace(/\D/g, '').length >= 7,
      msg: 'Phone number must contain at least 7 digits.',
    },
    {
      id: '#dog-name',
      label: 'Canine Name',
      isValid: (v) => v.length >= 1,
      msg: 'Please provide your dog\'s name.',
    },
    {
      id: '#service-type',
      label: 'Service Program',
      isValid: (v) => v.trim().length > 0,
      msg: 'Please select a care service program tier.',
    },
    {
      id: '#booking-date',
      label: 'Commencement Date',
      isValid: (v) => v.trim().length > 0,
      msg: 'Please select a requested service commencement date.',
    },
  ];

  let firstInvalidEl = null;

  fields.forEach(({ id, label, isValid, msg }) => {
    const el = document.querySelector(id);
    if (!el) return;

    const val = el.value ? el.value.trim() : '';
    const errorMsgEl = document.querySelector(`${id}-error`);
    const valid = isValid(val);

    if (!valid) {
      el.classList.add('field-error');
      el.setAttribute('aria-invalid', 'true');
      if (errorMsgEl) {
        errorMsgEl.textContent = msg;
        errorMsgEl.classList.remove('is-hidden');
      }
      errors.push({ field: label, message: msg, element: el });
      if (!firstInvalidEl) {
        firstInvalidEl = el;
      }
    } else {
      el.classList.remove('field-error');
      el.setAttribute('aria-invalid', 'false');
      if (errorMsgEl) {
        errorMsgEl.textContent = '';
        errorMsgEl.classList.add('is-hidden');
      }
    }
  });

  if (errors.length > 0) {
    if (errorSummary && errorList) {
      errorList.innerHTML = '';
      errors.forEach(({ field, message }) => {
        const li = document.createElement('li');
        li.textContent = `${field}: ${message}`;
        errorList.appendChild(li);
      });
      errorSummary.classList.remove('is-hidden');
      errorSummary.focus();
    }
    if (firstInvalidEl) {
      firstInvalidEl.focus();
    }
    return false;
  }

  if (errorSummary) {
    errorSummary.classList.add('is-hidden');
  }

  return true;
}

/**
 * Handles async booking submission with bad connectivity / 3G latency simulation
 * @param {Event} e
 */
export async function handleBookingSubmit(e) {
  if (e && e.preventDefault) {
    e.preventDefault();
  }

  const form = document.querySelector('#booking-form');
  const submitBtn = document.querySelector('#submit-booking-btn');
  const spinner = document.querySelector('#loading-indicator');
  const confirmationBanner = document.querySelector('#booking-confirmation-banner');
  const receiptOutput = document.querySelector('#booking-receipt-output');

  if (!validateForm()) {
    logTelemetry('Booking Validation Failed', { timestamp: Date.now() });
    return;
  }

  // Visual loading indicator & async connection state
  if (spinner) spinner.classList.remove('is-hidden');
  if (submitBtn) submitBtn.disabled = true;
  if (form) form.setAttribute('aria-busy', 'true');

  logTelemetry('Booking Request Initiated (Simulating Network Latency)');

  // Simulate slow 3G network latency (50ms in testing environments, 650ms in browser)
  const isTest = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test';
  const networkDelay = isTest ? 50 : 650;

  await new Promise((resolve) => setTimeout(resolve, networkDelay));

  // Retrieve sanitized structured data
  const data = getFormData();
  const structuredRecord = {
    confirmationId: `AC-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'CONFIRMED_PENDING_DISPATCH',
    submittedAt: new Date().toISOString(),
    client: {
      name: data.clientName,
      email: data.clientEmail,
      phone: data.clientPhone,
    },
    service: {
      programId: data.serviceType,
      dogName: data.dogName,
      commencementDate: data.bookingDate,
      specialInstructions: data.specialNotes || 'Standard executive protocol',
    },
    slaAssurance: '$5M Liability Coverage & Live GPS Route Trace Active',
  };

  // Program ID → human-readable label map
  const programLabels = {
    'executive-stride': 'SVC-01: Executive Stride (Solo, 45 mins)',
    'pack-stride':      'SVC-02: Pack Social Stride (Group, 60 mins)',
    'gentle-care':      'SVC-03: Senior & Puppy Gentle Care (30 mins)',
  };

  // Restore form loading states
  if (spinner) spinner.classList.add('is-hidden');
  if (submitBtn) submitBtn.disabled = false;
  if (form) {
    form.setAttribute('aria-busy', 'false');
    form.classList.add('is-hidden');
  }

  // Hide form title and subtitle while displaying receipt
  const formCardTitle = document.querySelector('.form-title');
  const formCardSubtitle = document.querySelector('.form-subtitle');
  if (formCardTitle) formCardTitle.classList.add('is-hidden');
  if (formCardSubtitle) formCardSubtitle.classList.add('is-hidden');

  // Populate the structured receipt fields
  if (confirmationBanner) {
    const set = (id, val) => {
      const el = document.querySelector(`#${id}`);
      if (el) el.textContent = val || '—';
    };

    // Format the ISO timestamp to a readable local string
    const submittedDate = new Date(structuredRecord.submittedAt);
    const formattedDate = submittedDate.toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    // Format commencement date
    const [year, month, day] = structuredRecord.service.commencementDate.split('-');
    const commDate = new Date(Number(year), Number(month) - 1, Number(day));
    const formattedComm = commDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    set('receipt-conf-id',      structuredRecord.confirmationId);
    set('receipt-submitted-at', formattedDate);
    set('receipt-name',         structuredRecord.client.name);
    set('receipt-email',        structuredRecord.client.email);
    set('receipt-phone',        structuredRecord.client.phone);
    set('receipt-program',      programLabels[structuredRecord.service.programId] || structuredRecord.service.programId);
    set('receipt-dog',          structuredRecord.service.dogName);
    set('receipt-date',         formattedComm);
    set('receipt-notes',        structuredRecord.service.specialInstructions);
    set('receipt-sla',          structuredRecord.slaAssurance);

    confirmationBanner.classList.remove('is-hidden');
    confirmationBanner.focus();

    // Smoothly scroll the booking section into view below the sticky header
    const bookingSection = document.querySelector('#booking');
    if (bookingSection && typeof bookingSection.scrollIntoView === 'function') {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  logTelemetry('Booking Submitted Successfully', {
    confirmationId: structuredRecord.confirmationId,
    service: data.serviceType,
  });
}

/**
 * Initializes handler directory search with empty state handling and telemetry
 */
export function initSearch() {
  const searchInput = document.querySelector('#walker-search');
  const emptyStateEl = document.querySelector('#empty-state');
  const resetBtn = document.querySelector('#reset-search-btn');
  const walkerCards = document.querySelectorAll('.walker-card');

  if (!searchInput) return;

  const performFilter = (query) => {
    const cleanQuery = sanitizeInput(query).toLowerCase();
    let visibleCount = 0;

    walkerCards.forEach((card) => {
      const cardContent = card.textContent.toLowerCase();
      const matches = cardContent.includes(cleanQuery);

      if (matches) {
        card.classList.remove('is-hidden');
        visibleCount += 1;
      } else {
        card.classList.add('is-hidden');
      }
    });

    // Unhappy Path: Empty State when no results found
    if (visibleCount === 0) {
      if (emptyStateEl) emptyStateEl.classList.remove('is-hidden');
    } else {
      if (emptyStateEl) emptyStateEl.classList.add('is-hidden');
    }

    logTelemetry('Search Performed', { query: cleanQuery, visibleResults: visibleCount });
  };

  searchInput.addEventListener('input', (e) => {
    performFilter(e.target.value);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      performFilter('');
      searchInput.focus();
      logTelemetry('Search Reset');
    });
  }
}

/**
 * Initializes interactive CTA buttons (selecting service programs & handlers)
 */
export function initInteractionShortcuts() {
  // Service program select buttons
  const serviceButtons = document.querySelectorAll('[data-service-select]');
  const serviceSelect = document.querySelector('#service-type');

  serviceButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceId = btn.getAttribute('data-service-select');
      if (serviceSelect && serviceId) {
        serviceSelect.value = serviceId;
        logTelemetry('Program Shortcut Clicked', { serviceId });
      }
    });
  });

  // Handler select buttons
  const walkerButtons = document.querySelectorAll('[data-walker-select]');
  const notesTextarea = document.querySelector('#special-notes');

  walkerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const walkerName = btn.getAttribute('data-walker-select');
      if (notesTextarea && walkerName) {
        const currentNotes = notesTextarea.value.trim();
        const preferenceNote = `Preferred Handler: ${walkerName}.`;
        if (!currentNotes.includes(preferenceNote)) {
          notesTextarea.value = currentNotes ? `${currentNotes}\n${preferenceNote}` : preferenceNote;
        }
        logTelemetry('Handler Shortcut Clicked', { walkerName });
      }
    });
  });

  // Submit another booking button
  const newBookingBtn = document.querySelector('#new-booking-btn');
  const form = document.querySelector('#booking-form');
  const confirmationBanner = document.querySelector('#booking-confirmation-banner');

  if (newBookingBtn && form && confirmationBanner) {
    newBookingBtn.addEventListener('click', () => {
      form.reset();
      form.classList.remove('is-hidden');
      confirmationBanner.classList.add('is-hidden');
      const formCardTitle = document.querySelector('.form-title');
      const formCardSubtitle = document.querySelector('.form-subtitle');
      if (formCardTitle) formCardTitle.classList.remove('is-hidden');
      if (formCardSubtitle) formCardSubtitle.classList.remove('is-hidden');
      const nameInput = document.querySelector('#client-name');
      if (nameInput) nameInput.focus();
      const bookingSection = document.querySelector('#booking');
      if (bookingSection && typeof bookingSection.scrollIntoView === 'function') {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      logTelemetry('New Booking Initiated');
    });
  }
}

/**
 * Initializes scroll-driven enhancements:
 * - Scroll progress bar
 * - Back-to-top button visibility
 * - Active nav link highlighting
 * - Scroll-reveal animations for cards
 */
export function initScrollExtras() {
  const progressBar = document.querySelector('#scroll-progress');
  const backToTop = document.querySelector('#back-to-top');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Progress Bar + Back-to-Top + Header shadow + Active Nav
  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (progressBar && docHeight > 0) {
      progressBar.style.width = `${Math.min((scrollTop / docHeight) * 100, 100)}%`;
    }

    // Back-to-top
    if (backToTop) {
      if (scrollTop > 400) {
        backToTop.classList.remove('is-hidden');
      } else {
        backToTop.classList.add('is-hidden');
      }
    }

    // Header shadow on scroll
    if (siteHeader) {
      if (scrollTop > 10) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    }

    // Active nav link
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (scrollTop >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('is-active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on init

  // Back-to-top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      logTelemetry('Back To Top Clicked');
    });
  }

  // Scroll-reveal: add .reveal to cards then observe them
  const revealTargets = document.querySelectorAll(
    '.service-card, .walker-card, .testimonial-card, .sla-item, .stat-item'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      const delay = i % 3;
      if (delay === 1) el.classList.add('reveal-delay-1');
      if (delay === 2) el.classList.add('reveal-delay-2');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }
}

/**
 * Initializes the entire application
 */
export function initApp() {
  const form = document.querySelector('#booking-form');
  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
  }

  initSearch();
  initInteractionShortcuts();
  initScrollExtras();
}

// Auto-run if executed inside a real browser DOM environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
