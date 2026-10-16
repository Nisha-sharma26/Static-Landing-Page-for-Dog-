# PROMPTS.md — Prompt Engineering Traceability Log

## Project: Static Landing Page for Dog Walking Service (Apex Canine)
**Target**: AI-Assisted Software Engineering (Vibe Coding) Stretch Assignment  
**Role**: Product Manager & Systems Architect instructing Antigravity AI Assistant  
**Date**: October 2026  

---

## 1. Executive Summary & Prompt Strategy

This document provides complete traceability of the exact prompt sequence and engineering methodology utilized to construct the **Apex Canine** static landing page.

In accordance with the assignment's **Test-Driven Development (TDD)** and **Enterprise NFR** mandates, the project was executed in distinct, structured prompt phases:
1. **Phase 1: Environment & Test Specification (TDD Red Phase)** — Define constraints, schema, and write failing test suites before writing production code.
2. **Phase 2: Semantic Structure & Corporate Monochromatic Design System** — Construct semantic HTML5 landmarks and a strict monochromatic CSS system with consistent 16px/32px spacing steps.
3. **Phase 3: Interactive Logic & Edge-Case Engineering (Unhappy Paths)** — Implement client-side modules for real-time search, "No data found" empty states, slow-3G latency loading indicators, red-highlighted invalid inputs, telemetry simulation, and XSS sanitization.
4. **Phase 4: Code Quality & Zero-Warning Linting (TDD Refactor Phase)** — Eliminate lint errors, enforce strict ECMAScript modules, and verify automated test coverage.
5. **Phase 5: End-to-End Browser Validation & Acceptance Verification** — Execute live browser subagent flows validating accessibility, visual feedback, and edge-case behavior.

---

## 2. Chronological Prompt Sequence

### Prompt 1: Initializing Workspace & Test Infrastructure Setup
```text
System Context & TRD Ingestion:
We are building a Static Landing Page for an executive dog walking service ('Apex Canine') adhering strictly to enterprise-grade TRD and DoD requirements.
Constraints:
- Pure semantic HTML5 and vanilla CSS. No React, Tailwind, or Bootstrap.
- Monochromatic corporate design system (black, charcoals, neutral grays, white). No rogue hex colors. Spacing scale in 16px/32px steps.
- Unhappy paths: 'No data found' empty state, slow 3G visual loading indicator, invalid inputs highlighted in red with aria-invalid.
- NFRs: 100% Lighthouse a11y compatibility, telemetry simulation ([Analytics] User interacted with Static Landing Page), and client-side XSS sanitization.
- TDD Requirement: Write the test suite first (using Vitest and JSDOM) and demonstrate failing tests BEFORE implementing production code.

Action:
1. Initialize package.json with ESM modules.
2. Install vitest, jsdom, and eslint.
3. Configure vitest.config.js for DOM emulation.
```
*Outcome*: Dependencies installed, Vitest and JSDOM configured.

---

### Prompt 2: Authoring the TDD Test Suite (`tests/landing-page.test.js`)
```text
As our QA Engineer and PM, write a comprehensive Vitest test suite in tests/landing-page.test.js to verify all TRD criteria prior to writing production code:
1. Semantic HTML5 & a11y:
   - Header, nav, main, section, footer landmarks.
   - Single <h1> tag.
   - All buttons have text or aria-label.
   - All inputs have associated labels or aria-label.
2. Happy Path Interactivity:
   - Initial list of walker cards renders with structured data.
   - Real-time search filter updates immediately without lag.
   - Form submission extracts consistent, structured booking data.
3. Unhappy Path - Empty States:
   - Searching for an unlisted handler shows #empty-state with 'No data found'.
   - Clear filter action restores walker cards.
4. Unhappy Path - Bad Connectivity:
   - Async booking submission triggers #loading-indicator (spinner), disables submit button, sets aria-busy="true".
5. Unhappy Path - Invalid Inputs:
   - Missing required fields prevent submission, apply 'field-error' class (red border), set aria-invalid="true", and display accessible error summary.
   - Malformed email is rejected.
6. NFRs:
   - Telemetry ping to console containing '[Analytics] User interacted with Static Landing Page'.
   - XSS sanitization removes <script> and dangerous attributes from inputs.
7. CSS Verification:
   - Checks monochromatic tokens and 16px/32px spacing scale in css/style.css.

Run 'npm test' to confirm that tests FAIL (Red Phase).
```
*Outcome*: Test suite created with 15 tests. Initial run failed with suite resolution error (Red Phase verified).

---

### Prompt 3: Building the Monochromatic Corporate Design System (`css/style.css`)
```text
Design Handoff Implementation:
Create css/style.css strictly adhering to a monochromatic corporate design system:
- Palette: High-contrast blacks (#0a0c0e, #14171a), charcoals (#21252b, #2c323a), cool grays (#4e5561, #9ca3af, #d1d5db, #f3f4f6), and crisp white (#ffffff).
- Validation Exception: Offending fields highlighted in red (#d32f2f, #ef4444) for .field-error and aria-invalid="true".
- Spacing Scale: Strict 8px/16px/24px/32px/48px/64px/96px steps (16px/32px increments).
- Accessibility: Focus-visible rings, skip link styles, high contrast text ratios (> 4.5:1).
- Unhappy Path Components:
  - #empty-state container with dashed border and clean messaging.
  - #loading-indicator with CSS keyframe spinner.
  - #form-error-summary with role="alert" styling.
- Responsive breakpoints for mobile, tablet, and desktop without frameworks.
```
*Outcome*: CSS stylesheet created adhering strictly to corporate design tokens and 16px/32px spacing rules.

---

### Prompt 4: Semantic HTML5 Architecture (`index.html`)
```text
Construct the complete index.html static landing page:
- Semantic Landmarks: <header>, <nav role="navigation">, <main id="main-content">, <section>, <footer role="contentinfo">.
- Accessible Skip Link: <a href="#main-content" class="skip-link">Skip to main content</a>.
- Single <h1>: 'Executive Canine Care & Daily Concierge Walks'.
- Sections:
  1. Hero: Value proposition, trust badges, key statistics, and booking CTA.
  2. Services: Tiered programs (Executive Stride, Pack Stride, Senior & Puppy Gentle) with pricing and shortcut buttons.
  3. Walker Directory: Interactive search bar (#walker-search), walker cards (.walker-card), and empty state (#empty-state) with 'No data found' message and #reset-search-btn.
  4. Booking & Intake: Form (#booking-form) with labels, required asterisks, #form-error-summary, #loading-indicator, #submit-booking-btn, and #booking-confirmation-banner.
  5. Testimonials: Corporate client endorsements.
  6. Footer: Brand summary, site map, legal compliance, and emergency dispatch contact.
Ensure all interactive elements have ARIA labels or associated labels.
```
*Outcome*: Semantic HTML5 markup built meeting all accessibility and structural criteria.

---

### Prompt 5: Application Logic, Edge Cases, Security & Telemetry (`js/app.js`)
```text
Implement js/app.js with human-written, maintainable vanilla JavaScript:
- sanitizeInput(str): Sanitizes text against XSS injection (stripping <script>, onerror, inline handlers, escaping HTML entities).
- logTelemetry(action, details): Emits structured analytics console log: '[Analytics] User interacted with Static Landing Page - <Action> | Details: ...'.
- initSearch(): Real-time search filter over handlers, displaying #empty-state when 0 cards match.
- validateForm(): Checks required fields, validates email regex, flags invalid inputs with .field-error and aria-invalid="true", focuses first error field, and renders accessible error summary.
- handleBookingSubmit(e): Async handler with simulated slow 3G latency (visual spinner visible, button disabled, aria-busy="true"), constructs structured confirmation record, hides form, reveals #booking-confirmation-banner, and logs telemetry.
- initInteractionShortcuts(): Populates booking form when clicking program/handler buttons.
```
*Outcome*: Application logic implemented.

---

### Prompt 6: TDD Green Phase & Linting Verification
```text
Execute test suite and linter:
1. Run 'npm test' to verify that all 15 tests pass (Green Phase).
2. Run 'npm run lint' to check for any ESLint errors or unused arguments.
3. If any lint errors occur, resolve them immediately and re-run to ensure zero errors and zero warnings.
```
*Outcome*:
- Iteration note: An initial test failure on telemetry string formatting was resolved by formatting the message as a unified string.
- Two unused `e` event handler arguments in `js/app.js` were removed to achieve 0 ESLint warnings.
- All 15 tests passed cleanly (`15 passed`).

---

### Prompt 7: End-to-End Live Browser Verification
```text
Start the local server daemon and initiate the browser subagent to execute real-world user workflows:
1. Verify initial layout, hero section, and typography.
2. Type 'NonExistentXYZ' in the Walker Directory search box; confirm 'No data found' empty state appears.
3. Click 'Clear Search Filter'; confirm cards are restored.
4. Attempt empty form submission; verify red error borders, aria-invalid attributes, and error summary alert.
5. Fill valid client data (Eleanor Sterling, eleanor.sterling@executive.com, 555-0199, Barnaby, Executive Stride, 2026-11-15, Preferred Handler: Marcus Vance).
6. Submit form; verify visual 3G loading spinner and receipt confirmation JSON banner.
```
*Outcome*: All workflows verified successfully in Chrome browser subagent. WebP video recording and screenshots captured.

---

## 3. Prompt Engineering Best Practices Applied

| Principle | Application in this Project |
| :--- | :--- |
| **Strict Persona & Tone** | Acted as a rigorous Product Manager guiding the AI pair programmer step-by-step rather than asking for code all at once. |
| **TDD Enforcement** | Explicitly prevented immediate code generation; required writing the Vitest suite first, witnessing failures, and then implementing code. |
| **Unhappy Path Prioritization** | Specifically engineered prompts around edge cases (empty search results, network latency, malformed inputs) rather than just standard success paths. |
| **Design System Guardrails** | Imposed strict monochromatic corporate palette tokens and 16px/32px spacing increments to eliminate rogue hex values. |
| **Security & Compliance by Design** | Demanded client-side XSS sanitization and telemetry logging in prompts as core architectural requirements. |

---

## 4. Definition of Done (DoD) Sign-Off

- [x] **Code compiles and runs successfully without fatal errors**: Verified via native HTTP server and Vitest runner.
- [x] **Passes Linting**: `npm run lint` executes with 0 errors and 0 warnings (`eslint js/** tests/**`).
- [x] **Matches all Happy and Unhappy Path Acceptance Criteria**:
  - Semantic HTML5, corporate layout, instant interactivity.
  - "No data found" empty state with one-click filter reset.
  - Visual loading indicator and button disabling under simulated 3G latency.
  - Missing/malformed inputs highlighted in red (`.field-error`) with accessible error summary and `aria-invalid`.
- [x] **The PROMPTS.md file is included in the root directory**: Fully documented above.
- [x] **No real API keys or sensitive PII are hardcoded in the source**: Verified clean codebase using mock/dummy enterprise profiles.
