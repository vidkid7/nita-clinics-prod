# Premium Clinical Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the public website visuals into a calmer, more premium clinical experience while keeping the local video hero system.

**Architecture:** Improve shared design primitives first, then simplify the homepage hero, header, and video overlay treatment so the public pages inherit a more polished visual language. Keep changes in the existing Next.js/Tailwind structure and avoid new dependencies.

**Tech Stack:** Next.js 14 App Router, React, TypeScript, Tailwind CSS, Framer Motion, local MP4 hero assets.

## Global Constraints

- Keep all videos local under `frontend/public/videos/hero`.
- Do not add new runtime dependencies.
- Keep public page content and routes intact.
- Improve readability, spacing, visual hierarchy, and mobile composition.
- Preserve healthcare professionalism: calm teal, white, deep green, restrained shadows.

---

### Task 1: Shared Visual Primitives

**Files:**
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/src/components/ui/VideoHeroBackground.tsx`

- [ ] Refine buttons, cards, and glass surfaces for softer shadows and borders.
- [ ] Add subtle video overlay texture and calmer gradients.

### Task 2: Homepage Hero Polish

**Files:**
- Modify: `frontend/src/components/home/HeroSection.tsx`

- [ ] Remove the competing right-side photo card.
- [ ] Replace it with a premium translucent care summary panel.
- [ ] Improve hero text rhythm, CTA shape, trust points, stats, and quick actions.

### Task 3: Header Polish

**Files:**
- Modify: `frontend/src/components/layout/Header.tsx`

- [ ] Soften the sticky header, active nav states, dropdown, and CTA buttons.
- [ ] Improve spacing so the hero feels more editorial and less crowded.

### Task 4: Verify

**Files:**
- Test: frontend build and browser smoke.

- [ ] Run `npm run build:frontend`.
- [ ] Restart `http://localhost:3002`.
- [ ] Browser-check desktop home and mobile vaccination.
