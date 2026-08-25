# Local Hero Videos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add locally hosted, optimized background videos to public landing-page hero sections across the Nita Clinics website.

**Architecture:** Create one reusable `VideoHeroBackground` component that renders muted autoplay local videos with poster fallback, reduced-motion handling, and overlay gradients. Update public hero sections to place this component behind existing content while preserving page-specific copy and CTAs.

**Tech Stack:** Next.js 14 App Router, React, TypeScript, Tailwind CSS, local MP4 assets in `frontend/public/videos/hero`.

## Global Constraints

- Videos must be saved locally in the repo under `frontend/public/videos/hero`.
- Videos are background-only and apply only to landing hero sections, not all content sections.
- Each major landing category should use a distinct related healthcare video.
- Use `muted`, `autoPlay`, `loop`, `playsInline`, `poster`, and `preload="metadata"`.
- Maintain readable text contrast with dark teal/neutral overlays.
- Respect `prefers-reduced-motion` by showing poster imagery instead of active video.
- Do not introduce new runtime dependencies.

---

### Task 1: Local Video Assets

**Files:**
- Create: `frontend/public/videos/hero/*.mp4`

**Interfaces:**
- Produces: local video URLs such as `/videos/hero/clinic-consultation.mp4`.

- [ ] Download selected free-to-use healthcare videos from Pexels.
- [ ] Save files with semantic names:
  - `clinic-consultation.mp4`
  - `medical-team.mp4`
  - `diagnostics-lab.mp4`
  - `vaccination-care.mp4`
  - `patient-reception.mp4`
- [ ] Verify each file exists and is non-empty.

### Task 2: Shared Video Background Component

**Files:**
- Create: `frontend/src/components/ui/VideoHeroBackground.tsx`

**Interfaces:**
- Produces: `VideoHeroBackground({ src, poster, overlayClassName, className }: VideoHeroBackgroundProps)`.

- [ ] Implement a client component that renders a local `<video>`.
- [ ] Add reduced-motion detection and fallback poster background.
- [ ] Add overlay slots with Tailwind class composition.

### Task 3: Hero Integration

**Files:**
- Modify: public hero components and page files under `frontend/src/app` and `frontend/src/components`.

**Interfaces:**
- Consumes: `VideoHeroBackground`.

- [ ] Add page-appropriate local videos to home, about, diagnostics, vaccination, checkup, specialists/doctors, team/gallery/blog/contact/booking heroes.
- [ ] Keep text and CTA content intact unless minor layout changes improve readability.
- [ ] Replace heavy decorative gradient-only hero backgrounds with video plus restrained overlays.

### Task 4: Verify

**Files:**
- Test: frontend build/lint and browser smoke.

- [ ] Run `npm run build:frontend`.
- [ ] Run the frontend dev server and smoke-test `http://localhost:3002`.
- [ ] Confirm public hero pages render with local videos and readable foreground content.
