import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve(__dirname, '../index.html');
const cssPath = path.resolve(__dirname, '../css/style.css');

describe('Static Landing Page - Dog Walking Service Test Suite', () => {
  let appModule;

  beforeEach(async () => {
    // Reset DOM
    const htmlContent = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
    document.documentElement.innerHTML = htmlContent;

    // Reset console spies
    vi.restoreAllMocks();

    // Dynamically import or re-import app logic if present
    try {
      appModule = await import('../js/app.js');
      if (appModule.initApp) {
        appModule.initApp();
      }
    } catch {
      appModule = null;
    }
  });

  describe('1. Semantic HTML5 & Accessibility (NFR - a11y & Story 1)', () => {
    it('should have semantic landmarks: header, nav, main, section, footer', () => {
      expect(document.querySelector('header')).not.toBeNull();
      expect(document.querySelector('nav')).not.toBeNull();
      expect(document.querySelector('main')).not.toBeNull();
      expect(document.querySelectorAll('section').length).toBeGreaterThanOrEqual(3);
      expect(document.querySelector('footer')).not.toBeNull();
    });

    it('should have exactly one h1 tag for correct heading hierarchy', () => {
      const h1s = document.querySelectorAll('h1');
      expect(h1s.length).toBe(1);
      expect(h1s[0].textContent.trim().length).toBeGreaterThan(0);
    });

    it('should ensure all interactive buttons have accessible text or aria-label', () => {
      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((btn) => {
        const text = btn.textContent.trim();
        const ariaLabel = btn.getAttribute('aria-label');
        expect(text.length > 0 || (ariaLabel && ariaLabel.trim().length > 0)).toBe(true);
      });
    });

    it('should ensure all form inputs have associated labels or aria-label', () => {
      const inputs = document.querySelectorAll('input, select, textarea');
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach((input) => {
        const id = input.getAttribute('id');
        const hasAssociatedLabel = id ? !!document.querySelector(`label[for="${id}"]`) : false;
        const hasAriaLabel = !!input.getAttribute('aria-label');
        const hasAriaLabelledby = !!input.getAttribute('aria-labelledby');
        expect(hasAssociatedLabel || hasAriaLabel || hasAriaLabelledby).toBe(true);
      });
    });
  });

  describe('2. Happy Path Interactivity & Structured Data Output', () => {
    it('should render initial list of dog walkers with structured data cards', () => {
      const walkerCards = document.querySelectorAll('.walker-card');
      expect(walkerCards.length).toBeGreaterThanOrEqual(3);
    });

    it('should respond immediately to search inputs without long loading delay', () => {
      const searchInput = document.querySelector('#walker-search');
      expect(searchInput).not.toBeNull();

      // Type a query that matches specific walkers
      searchInput.value = 'Apex';
      searchInput.dispatchEvent(new Event('input'));

      const walkerCards = document.querySelectorAll('.walker-card:not(.is-hidden)');
      expect(walkerCards.length).toBeGreaterThanOrEqual(1);
      walkerCards.forEach((card) => {
        expect(card.textContent.toLowerCase()).toContain('apex');
      });
    });

    it('should produce structured data output upon valid booking submission', async () => {
      const form = document.querySelector('#booking-form');
      expect(form).not.toBeNull();

      // Fill in valid details
      document.querySelector('#client-name').value = 'Jane Doe';
      document.querySelector('#client-email').value = 'jane.doe@enterprise.com';
      document.querySelector('#client-phone').value = '555-0199';
      document.querySelector('#dog-name').value = 'Barnaby';
      document.querySelector('#service-type').value = 'executive-stride';
      document.querySelector('#booking-date').value = '2026-11-01';

      const bookingPayload = appModule.getFormData ? appModule.getFormData() : null;
      expect(bookingPayload).toBeDefined();
      expect(bookingPayload.clientName).toBe('Jane Doe');
      expect(bookingPayload.clientEmail).toBe('jane.doe@enterprise.com');
      expect(bookingPayload.dogName).toBe('Barnaby');
      expect(bookingPayload.serviceType).toBe('executive-stride');
    });
  });

  describe('3. Unhappy Path - Empty States', () => {
    it('should display a user-friendly "No data found" message when search yields no matches', () => {
      const searchInput = document.querySelector('#walker-search');
      const emptyStateEl = document.querySelector('#empty-state');
      expect(searchInput).not.toBeNull();
      expect(emptyStateEl).not.toBeNull();

      // Search for non-existent walker
      searchInput.value = 'NonExistentWalkerXYZ123';
      searchInput.dispatchEvent(new Event('input'));

      // Empty state should be visible and contain "No data found"
      expect(emptyStateEl.classList.contains('is-hidden')).toBe(false);
      expect(emptyStateEl.textContent.toLowerCase()).toContain('no data found');

      // Walker cards should all be hidden
      const visibleCards = document.querySelectorAll('.walker-card:not(.is-hidden)');
      expect(visibleCards.length).toBe(0);
    });

    it('should allow clearing search to restore results from empty state', () => {
      const searchInput = document.querySelector('#walker-search');
      const resetBtn = document.querySelector('#reset-search-btn');
      const emptyStateEl = document.querySelector('#empty-state');

      searchInput.value = 'NonExistentWalkerXYZ123';
      searchInput.dispatchEvent(new Event('input'));
      expect(emptyStateEl.classList.contains('is-hidden')).toBe(false);

      if (resetBtn) {
        resetBtn.click();
        expect(searchInput.value).toBe('');
        expect(emptyStateEl.classList.contains('is-hidden')).toBe(true);
        const visibleCards = document.querySelectorAll('.walker-card:not(.is-hidden)');
        expect(visibleCards.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe('4. Unhappy Path - Bad Connectivity (Visual Loading Indicator)', () => {
    it('should display visual loading indicator and disable button during async operations', async () => {
      const form = document.querySelector('#booking-form');
      const submitBtn = document.querySelector('#submit-booking-btn');
      const spinner = document.querySelector('#loading-indicator');

      expect(form).not.toBeNull();
      expect(submitBtn).not.toBeNull();
      expect(spinner).not.toBeNull();

      // Fill valid data
      document.querySelector('#client-name').value = 'John Smith';
      document.querySelector('#client-email').value = 'john.smith@corporate.com';
      document.querySelector('#client-phone').value = '555-0144';
      document.querySelector('#dog-name').value = 'Buster';
      document.querySelector('#service-type').value = 'executive-stride';
      document.querySelector('#booking-date').value = '2026-11-05';

      // Submit form
      const submitPromise = appModule.handleBookingSubmit
        ? appModule.handleBookingSubmit(new Event('submit'))
        : Promise.resolve();

      // Check immediate loading state
      expect(spinner.classList.contains('is-hidden')).toBe(false);
      expect(submitBtn.disabled).toBe(true);
      expect(form.getAttribute('aria-busy')).toBe('true');

      await submitPromise;

      // Restored after async completion
      expect(spinner.classList.contains('is-hidden')).toBe(true);
      expect(submitBtn.disabled).toBe(false);
      expect(form.getAttribute('aria-busy')).toBe('false');
    });
  });

  describe('5. Unhappy Path - Invalid Inputs & Error Highlighting', () => {
    it('should prevent submission and highlight offending empty fields with error state', async () => {
      const form = document.querySelector('#booking-form');
      const nameInput = document.querySelector('#client-name');
      const emailInput = document.querySelector('#client-email');

      // Leave fields empty
      nameInput.value = '';
      emailInput.value = '';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Submission should be cancelled
      expect(submitEvent.defaultPrevented).toBe(true);

      // Offending fields highlighted with error class and aria-invalid
      expect(nameInput.classList.contains('field-error')).toBe(true);
      expect(nameInput.getAttribute('aria-invalid')).toBe('true');
      expect(emailInput.classList.contains('field-error')).toBe(true);
      expect(emailInput.getAttribute('aria-invalid')).toBe('true');

      // Error message container should be visible
      const errorSummary = document.querySelector('#form-error-summary');
      expect(errorSummary).not.toBeNull();
      expect(errorSummary.classList.contains('is-hidden')).toBe(false);
      expect(errorSummary.getAttribute('role')).toBe('alert');
    });

    it('should reject malformed email input and highlight the field', () => {
      const form = document.querySelector('#booking-form');
      const emailInput = document.querySelector('#client-email');

      document.querySelector('#client-name').value = 'Valid Name';
      emailInput.value = 'invalid-email-address';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
      expect(emailInput.classList.contains('field-error')).toBe(true);
      expect(emailInput.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('6. Non-Functional Requirements - Telemetry Simulation', () => {
    it('should log telemetry ping to console when primary actions are completed', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      // Trigger search telemetry
      const searchInput = document.querySelector('#walker-search');
      searchInput.value = 'Rover';
      searchInput.dispatchEvent(new Event('input'));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Analytics] User interacted with Static Landing Page')
      );
    });
  });

  describe('7. Non-Functional Requirements - Security (XSS Sanitization)', () => {
    it('should sanitize all text inputs against XSS injection before storing in state or rendering', () => {
      const maliciousScript = '<script>alert("hacked")</script>';
      const sanitized = appModule.sanitizeInput
        ? appModule.sanitizeInput(maliciousScript)
        : maliciousScript;

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');

      const maliciousImg = '<img src=x onerror=alert(1)>';
      const sanitizedImg = appModule.sanitizeInput
        ? appModule.sanitizeInput(maliciousImg)
        : maliciousImg;

      expect(sanitizedImg).not.toContain('onerror=');
      expect(sanitizedImg).not.toContain('<img');
    });
  });

  describe('8. Corporate Monochromatic Design System (CSS Verification)', () => {
    it('should define clean monochromatic corporate color variables and 16px/32px spacing steps', () => {
      expect(fs.existsSync(cssPath)).toBe(true);
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      // Check monochromatic tokens
      expect(cssContent).toMatch(/--color-black|--color-dark|--color-charcoal/);
      expect(cssContent).toMatch(/--color-white|--color-light/);
      expect(cssContent).toMatch(/--color-gray|--color-neutral/);

      // Check consistent 16px/32px spacing steps
      expect(cssContent).toMatch(/16px/);
      expect(cssContent).toMatch(/32px/);

      // Check field-error red highlight
      expect(cssContent).toContain('.field-error');
    });
  });
});
