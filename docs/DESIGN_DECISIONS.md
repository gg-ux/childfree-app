# Grace Guo Design Decisions Document
## "Gooey" Design System — Complete Reference

> "Meaningful design is care, made visible. I want people to feel understood, not processed."

This document captures every design decision, pattern, and philosophy from Grace Guo's portfolio. Use this as a benchmark for future projects to maintain consistency in design language, interaction patterns, and brand expression.

---

## Table of Contents

1. [Core Philosophy](#1-core-philosophy)
2. [Typography System](#2-typography-system)
3. [Color System](#3-color-system)
4. [Spacing System](#4-spacing-system)
5. [Animation & Motion](#5-animation--motion)
6. [Component Patterns](#6-component-patterns)
7. [Layout Patterns](#7-layout-patterns)
8. [Icon System](#8-icon-system)
9. [Image Treatment](#9-image-treatment)
10. [Interaction Patterns](#10-interaction-patterns)
11. [Accessibility](#11-accessibility)
12. [Brand Voice](#12-brand-voice)
13. [Design Thinking & Iteration](#13-design-thinking--iteration)

---

## 1. Core Philosophy

### The "Gooey" Design System

The design system is named **"Gooey"** — suggesting fluidity, organic warmth, and approachability. This name reflects experiences that feel:
- **Warm and inviting** (not cold or corporate)
- **Organic and flowing** (not rigid or mechanical)
- **Accessible and human-centered**

### Design Principles

1. **Meaningful Care** — Every design decision should make the user feel understood, not processed
2. **Warmth Without Softness** — Inviting and organic, but technically rigorous and precise
3. **Content First** — Design serves the work, not vice versa
4. **Organic Motion** — Animations use custom easing curves, never mechanical/linear
5. **Theme Awareness** — Works seamlessly in both light and dark modes
6. **Human Scale** — Typography, spacing, and interactions calibrated for human comfort
7. **Accessibility by Default** — Built in, not bolted on

### Brand Personality

> "Warm but not loud. Confident enough to lead, quiet enough to let the work speak."

---

## 2. Typography System

### Font Families

| Font | Purpose | Personality | Usage |
|------|---------|-------------|-------|
| **Silk Serif** | Display headlines | Elegant, editorial, refined | Hero text, H1 page titles |
| **Satoshi** | Body, headings, UI | Warm, modern, approachable | Paragraphs, H2-H5, buttons, labels |
| **Azeret Mono** | Code, metadata, captions | Technical precision, honesty | Tags, timestamps, captions |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Decorative, thin icons |
| Normal | 400 | Body text, serif headlines |
| Medium | 500 | Labels, emphasis, default sans |
| Semibold | 600 | Strong emphasis |
| Bold | 700 | Maximum emphasis |

**Special:** H4 uses weight 550 (dark) / 600 (light) for theme-optimized legibility.

### Size Scale (Fluid Typography)

| Element | Size | Responsive Behavior |
|---------|------|---------------------|
| Display | `clamp(60px, 10vw, 128px)` | Scales with viewport |
| H1 | `clamp(40px, 7vw, 72px)` | Scales with viewport |
| H2 | `clamp(32px, 5vw, 48px)` | Scales with viewport |
| H3 | `clamp(24px, 3.5vw, 30px)` | Scales with viewport |
| H4 | `20px` | Fixed |
| Body | `text-base md:text-[17px]` | 16px → 17px on desktop |
| Label | `13px` | Fixed |
| Caption | `11px` | Fixed |

### Line Height (Leading)

| Context | Value | Class |
|---------|-------|-------|
| Display headlines | 0.85 | `leading-[0.85]` |
| Headings | 1.25 | `leading-tight` |
| Subheadings | 1.375 | `leading-snug` |
| Body text | 1.625 | `leading-relaxed` |

### Letter Spacing (Tracking)

| Context | Value | Class |
|---------|-------|-------|
| Display/Headings | -0.025em | `tracking-tight` |
| Body text | 0 | `tracking-normal` |
| Mono/Labels/Captions | 0.025em | `tracking-wide` |

### Text Color Hierarchy

| Class | Dark Mode | Light Mode | Purpose |
|-------|-----------|------------|---------|
| `theme-heading` | #FFFFFF | #1A1A1A | Primary text, titles |
| `theme-body` | #D4D4D4 | #3A3A3A | Body text, descriptions |
| `theme-caption` | #A3A3A3 | #5A5A5A | Metadata, timestamps |
| `theme-muted` | #737373 | #8A8A8A | De-emphasized text |
| `theme-accent` | #8B6AFF | #5835B0 | Accent/link color |

### Scramble Text Effect

Used for captions and metadata to add visual interest:

```javascript
// Configuration
speed: 20-40ms     // Frame delay
iterations: 2-4    // Randomization passes per character
trigger: 'inView'  // mount, hover, inView, both
characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
```

---

## 3. Color System

### Soulful Palette (Brand Colors)

> "Organic, dreamy, yet grounded. Pulled from golden hour hikes, California sunsets, wildflowers, and ocean views."

| Color | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| **Amethyst** | #5835B0 | #8B6AFF | Primary accent, CTAs, links |
| **Lilac** | #BF92F0 | #BF92F0 | Secondary accent, animations |
| **Rose** | #D78F8D | #D78F8D | Tertiary accent, highlights |
| **Gold** | #DBA166 | #DBA166 | Warm accent, special elements |
| **Turquoise** | #36CBC6 | #36CBC6 | Data viz, charts |
| **Lagoon** | #0B96A3 | #0B96A3 | Interactive elements |
| **Peridot** | #87AA61 | #87AA61 | Success states |
| **Forest** | #2F7255 | #2F7255 | Grounding elements |

**Note:** Only Amethyst changes between modes (optimized for contrast). Others work in both.

### System Colors

| Purpose | Dark Mode | Light Mode |
|---------|-----------|------------|
| Background | #0A0A0A | #FAF8F4 |
| Surface | rgba(255,255,255,0.02) | #FFFFFF |
| Border | rgba(255,255,255,0.06) | rgba(0,0,0,0.08) |
| Error | #c45c5c | #d46a6a |
| Success | #5c9a6a | #6aaa78 |
| Warning | #F59E0B | #D97706 |

### Opacity Scale

#### Backgrounds
- `white/[0.015]` — Very subtle fills (frosted containers)
- `white/[0.02]` — Subtle backgrounds
- `white/[0.04]` — Hover states
- `white/[0.06]` — Tag backgrounds

#### Borders
- `white/[0.06]` — Standard borders (dark)
- `white/[0.08]` — Interactive borders (dark)
- `black/[0.08]` — Standard borders (light)

#### Text
- `white/70` — Secondary text (dark)
- `white/50` — Tertiary text (dark)
- `white/30` — Placeholder text (dark)

### Backdrop Blur

- `backdrop-blur-md` — Standard glass effect
- `backdrop-blur-sm` — Light blur (backdrops)
- `backdrop-blur-xl` — Heavy blur (navigation)

---

## 4. Spacing System

### Base Unit: 4px

| Name | Value | Tailwind | Usage |
|------|-------|----------|-------|
| xs | 4px | `p-1` | Icon-text gaps |
| sm | 8px | `p-2` | Form elements, tight spacing |
| md | 16px | `p-4` | Component padding |
| lg | 24px | `p-6` | Standard container padding |
| xl | 32px | `p-8` | Large containers |
| 2xl | 48px | `p-12` | Section spacing |
| 3xl | 64px | `p-16` | Major section separation |

### Page-Level Container

```css
/* Universal container pattern */
max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20
```

- Mobile: 24px horizontal padding
- Tablet: 48px horizontal padding
- Desktop: 80px horizontal padding

### Common Spacing Patterns

| Context | Pattern | Value |
|---------|---------|-------|
| Title to subtitle | `mb-4` | 16px |
| Section to content | `mb-6` | 24px |
| Major sections | `mb-12` to `mb-16` | 48-64px |
| Grid items | `gap-4` to `gap-8` | 16-32px |
| Page sections (vertical) | `py-16` to `py-32` | 64-128px |

### Content Max-Widths

| Purpose | Class | Pixels |
|---------|-------|--------|
| Main container | `max-w-[1440px]` | 1440px |
| Project pages | `max-w-4xl` | 896px |
| Body text | `max-w-2xl` to `max-w-3xl` | 672-768px |

---

## 5. Animation & Motion

### Philosophy: "Soulful Motion"

Motion should feel:
- **Intentional** — Every animation has a purpose
- **Organic** — Natural deceleration, never linear
- **Layered** — Multiple properties animate at different rates
- **Responsive** — Reacts to user scroll and interaction

### Primary Easing Curve

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

Used for most entrance animations. Creates organic deceleration with slight overshoot.

### Easing Reference

| Name | Curve | Usage |
|------|-------|-------|
| Organic | `cubic-bezier(0.22, 1, 0.36, 1)` | Primary keyframes |
| Snappy | `cubic-bezier(0.16, 1, 0.3, 1)` | Button/hover transforms |
| Smooth cursor | `cubic-bezier(0.23, 1, 0.32, 1)` | Cursor transitions |
| Bouncy | `cubic-bezier(0.33, 1, 0.68, 1)` | Card swaps, carousel |
| `easeOutCubic` | `1 - (1-t)³` | Scroll-based morphs |

### Duration Scale

| Speed | Duration | Usage |
|-------|----------|-------|
| Fast | 150-200ms | Image crossfade, cursor opacity |
| Standard | 300ms | Color transitions, hover states |
| Deliberate | 500-700ms | Card transforms, image zoom |
| Entrance | 800-1200ms | Hero animations, section reveals |
| Exit | 800ms | Faster than entrance |

### Keyframe Animations

#### fluid-in (Primary Entrance)
```css
0%: opacity 0, blur(12px), translateY(8px), skewX(-8deg)
100%: opacity 1, blur(0), translateY(0), skewX(0)
Duration: 1.2s
```

#### slot-roll (Counter/Title Entrance)
```css
0%: opacity 0, blur(8px), translateY(40px), scale(0.95)
50%: opacity 0.8, blur(2px)
100%: opacity 1, blur(0), translateY(0), scale(1)
Duration: 0.6s
```

### Scroll-Based Animations

**Scroll Reveal Hook:**
- Threshold: 0.1 (10% visible)
- Root margin: `0px 0px -50px 0px`
- Triggers opacity + translateY animation

**Hero Parallax:**
- Over first 50% of viewport scroll
- Opacity: 1 → 0
- translateY: 0 → -32px
- scale: 1 → 0.95
- blur: 0 → 8px (delayed start at 40%)

### Hover Effects

| Element | Effect | Duration |
|---------|--------|----------|
| Button content | scale(1.05) | 400ms |
| Project cards | scale(1.03) | 500ms |
| 3D tilt | rotateX/Y ±8° | Real-time |
| Arrow icons | translate 0.5px | 300ms |
| Image ripple | WebGL displacement | Real-time |

### Stagger Pattern

Sequential entrance delays:
```
Element 1: 0ms
Element 2: 50ms
Element 3: 100ms
Element 4: 150ms
```

Hero section stagger:
```
Name: 200ms
Bio: 500ms
Buttons: 650ms
Link: 750ms
```

---

## 6. Component Patterns

### Button Variants

#### Primary (Solid)
```css
Dark: bg-white text-black hover:bg-white/90
Light: bg-gray-900 text-white hover:bg-gray-800
```

#### Secondary (Frosted Glass)
```css
Dark: bg-white/[0.015] backdrop-blur-md border-white/[0.08]
      text-white/70 hover:bg-white/[0.04] hover:text-white
Light: bg-white/20 backdrop-blur-md border-black/[0.08]
       text-gray-600 hover:bg-white/30 hover:text-gray-900
```

#### Ghost (Text Only)
```css
Dark: text-gray-400 hover:text-white
Light: text-gray-500 hover:text-gray-900
```

### Button Sizes

| Size | Padding | Height |
|------|---------|--------|
| sm | `px-5 pt-[9px] pb-[8px]` | ~44px |
| md | `px-7 pt-[13px] pb-[12px]` | ~48px |
| lg | `px-9 pt-[17px] pb-[16px]` | ~54px |

### Button Base Styles
```css
font-mono text-[12px] uppercase tracking-normal leading-none
rounded-md transition-all duration-300
```

### FrostedContainer

Glass-morphism container for cards and panels:

```css
/* Structure */
rounded-2xl border backdrop-blur-md overflow-hidden

/* Dark Mode */
border-white/[0.08] bg-white/[0.015]

/* Light Mode */
border-black/[0.08] bg-white/20

/* Hover */
group-hover:bg-white/[0.02] (dark)
group-hover:bg-black/[0.02] (light)
```

Includes SVG grain texture overlay (40% opacity).

### Input Fields

**Style:** Underline only (no box)
```css
border-b py-2 px-0 bg-transparent rounded-none
font-satoshi text-base

/* Border Colors */
Dark: border-white/20 focus:border-white/60
Light: border-black/20 focus:border-black/60

/* Placeholder */
placeholder:text-[color]/30
```

### Tags

```css
font-mono font-light text-[11px] tracking-wide uppercase
px-2 py-1 rounded-md

/* Default */
Dark: bg-white/[0.06] text-white/60
Light: bg-black/[0.04] text-black/60

/* Colored */
background: [custom color]
text: white
```

---

## 7. Layout Patterns

### Navigation

**Desktop (md+):**
- Fixed position, `z-[200]`
- Horizontal: Logo (left) → Links (center) → Theme toggle (right)
- Mega menu dropdown for projects
- Hides on scroll down, shows on scroll up (80px threshold)
- Background blur activates after 100px scroll

**Mobile (<md):**
- Hamburger menu → Full-screen overlay
- Two-layer navigation (main → work projects)
- Body scroll lock when open

### Hero Section

```jsx
<section className="relative min-h-screen overflow-hidden">
  {/* Background animation */}
  <div className="relative z-10 min-h-screen flex flex-col justify-end">
    {/* Content aligned to bottom */}
  </div>
</section>
```

### Grid Patterns

**12-column grid (Bio section):**
```css
grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-16
Photo: md:col-span-4
Content: md:col-span-8
```

**Sidebar layout (Resume):**
```css
grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16
```

**Project cards:**
```css
Mobile: Horizontal carousel (280px cards)
Tablet: grid-cols-2 or grid-cols-3
Desktop: grid-cols-4
```

### Sticky Scroll Sections

For immersive scroll-driven content:
```css
/* Outer container */
height: [content-length]vh

/* Inner sticky */
position: sticky
top: 0
height: 100vh
```

### Z-Index Hierarchy

| Layer | Z-Index | Content |
|-------|---------|---------|
| Background | implicit | Gradients, blobs |
| Main content | z-10 | Page content |
| Sticky containers | z-[101] | Project cards |
| Mega menu backdrop | z-[199] | Behind nav |
| Navigation | z-[200] | Navbar |
| Mobile menu | z-[250] | Full overlay |
| Custom cursor | z-[9999] | Above all |

---

## 8. Icon System

### Library: Phosphor Icons

### Size Scale

| Size | Usage |
|------|-------|
| 10px | Minimal hints, navigation arrows |
| 13px | Button icons, inline actions |
| 14px | Chart icons, small UI |
| 16px | Form feedback |
| 18px | Medium controls |
| 20px | Primary size — nav, social links |
| 22px | Mid-size chart icons |
| 24px | Large UI — menu toggle |
| 28px | Header decorative |
| 48px | Large feedback (success/error) |

### Weight Distribution

| Weight | Usage | Frequency |
|--------|-------|-----------|
| regular | Standard UI, default | 60% |
| fill | Emphasis, completion states | 33% |
| bold | Strong emphasis, navigation | 24% |
| light | Minimal, spacious navigation | 14% |

### Common Icons

**Navigation:**
- `List` / `X` — Menu toggle
- `ArrowRight` — CTAs, navigation
- `ArrowUpRight` — External links
- `ArrowUp` / `ArrowDown` — Scroll, sorting

**Social:**
- `LinkedinLogo`, `DribbbleLogo`, `EnvelopeSimple`

**Status:**
- `CheckCircle` — Success (green)
- `WarningCircle` — Error (red)
- `CircleNotch` — Loading (spinning)

**Theme:**
- `Sun` — Light mode indicator (#F59E0B)
- `Moon` — Dark mode indicator (#A78BFA)

### Icon Animation Patterns

**Hover translate:**
```css
/* Right arrow */
group-hover:translate-x-0.5

/* Up arrow */
group-hover:-translate-y-0.5

/* External link */
group-hover:translate-x-0.5 group-hover:-translate-y-0.5
```

---

## 9. Image Treatment

### Lazy Loading

All project images use `loading="lazy"` attribute.

### Aspect Ratios

| Ratio | Usage |
|-------|-------|
| `aspect-square` | Card thumbnails, grids |
| `aspect-[3/4]` | Portrait photos |
| `aspect-[4/3]` | Wide containers |
| `aspect-video` (16/9) | Embedded media |
| `aspect-[2/1]` | Section heroes |

### Object Fit

- `object-contain` — Project cards, galleries (preserves ratio)
- `object-cover` — Mobile thumbnails (fills container)

### Container Styling

```css
/* Background for image contrast */
Dark: bg-[#111111]
Light: bg-gray-100

/* Rounded corners */
Standard: rounded-xl (12px)
Large: rounded-2xl (16px)

/* Glass border (optional) */
border-white/[0.08] bg-white/[0.015]
shadow-[0_4px_24px_rgba(0,0,0,0.25)]
```

### Hover Effects

**Standard zoom:**
```css
group-hover:scale-[1.03]
transition-transform duration-500
```

**WebGL ripple (desktop):**
- Mouse-aware displacement
- Intensity: 0 (idle) → 1.0 (hover)
- Fallback to simple zoom on low-end devices

---

## 10. Interaction Patterns

### Hover States

| Element | Effect |
|---------|--------|
| Primary button | bg-white/90, content scale 1.05 |
| Secondary button | bg-white/[0.04], energy beam border |
| Ghost button | text color brightens |
| Links | Color transition 300ms |
| Cards | scale 1.02-1.03, 3D tilt |
| Images | scale 1.03 or WebGL ripple |

### Focus States

**Inputs:**
```css
Border: 20% opacity → 60% opacity
Transition: 300ms
```

### Active/Press States

```css
/* Mobile tap feedback */
group-active:scale-95
transition-transform duration-300
```

### Disabled States

```css
opacity-50 cursor-not-allowed
/* No hover effects */
```

### Loading States

**Form submission:**
- Button shows spinning `CircleNotch` icon
- Text changes to "Sending..."
- Button disabled

**Page loader:**
- Multi-phase animation (enter → load → complete → exit)
- Ring stroke animation with gradient
- Logo breathing pulse
- Exit with blur and scale

### Error States

```css
/* Border color */
Dark: border-[#c45c5c]/60
Light: border-[#d46a6a]/60

/* Error banner */
Dark: bg-[#c45c5c]/10 border-[#c45c5c]/20
Light: bg-[#d46a6a]/10 border-[#d46a6a]/20
```

### Scroll Behavior

```css
html {
  scroll-behavior: smooth;
}
```

**Navigation visibility:**
- At top: Always visible
- Scrolling down: Hide (translateY -100%)
- Scrolling up (80px+): Reveal

### Custom Cursor

- Base size: 20px
- Hover size: 28px
- Project card size: 80px (shows "View →")
- Mix-blend-mode: difference
- Only on fine pointer devices

---

## 11. Accessibility

### Semantic HTML
- Proper heading hierarchy (H1 → H5)
- Form labels associated via `htmlFor`
- Buttons and links semantically correct
- Alt text on all images

### ARIA Attributes
- `aria-label` on icon-only buttons
- `aria-hidden="true"` on decorative elements
- Role attributes where needed

### Color Contrast
- All text meets WCAG AA standards
- Error colors have sufficient contrast
- Theme-aware color optimization

### Keyboard Navigation
- All interactive elements reachable via Tab
- Escape key closes modals/drawers
- No keyboard traps
- Focus states visible

### Motion Considerations
- Respects `prefers-reduced-motion`
- Animations don't block interaction
- Loading states can be interrupted

### Touch Targets
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Mobile-specific tap feedback

---

## 12. Brand Voice

### Tone

> "Warm but not loud. Confident enough to lead, quiet enough to let the work speak."

### Copy Style

- **Concise** — Say more with less
- **Human** — Conversational, not corporate
- **Intentional** — Every word matters
- **Inclusive** — Accessible language

### Headlines
- Serif for impact (Silk Serif)
- Short, meaningful phrases
- Often one powerful statement

### Body Copy
- Sans-serif for readability (Satoshi)
- Leading-relaxed for comfort
- Clear paragraph breaks

### Metadata/Labels
- Monospace for technical feel (Azeret Mono)
- Uppercase, wide tracking
- Subtle, not competing

### Error Messages
- Helpful, not blaming
- Clear next steps
- Friendly fallbacks

---

## Quick Reference Card

### Colors
```
Primary: #5835B0 (light) / #8B6AFF (dark)
Background: #FAF8F4 (light) / #0A0A0A (dark)
Border: rgba(0,0,0,0.08) (light) / rgba(255,255,255,0.06) (dark)
```

### Typography
```
Headlines: Silk Serif, tracking-tight
Body: Satoshi, leading-relaxed
Mono: Azeret Mono, tracking-wide, uppercase
```

### Spacing
```
Container: max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20
Section gaps: mb-12 to mb-16
Component gaps: gap-4 to gap-8
```

### Animation
```
Primary easing: cubic-bezier(0.22, 1, 0.36, 1)
Standard duration: 300ms
Entrance duration: 800-1200ms
Hover scale: 1.03-1.05
```

### Breakpoints
```
sm: 640px
md: 768px (major layout change)
lg: 1024px
xl: 1280px
```

---

## 13. Design Thinking & Iteration

This section captures HOW to make design decisions the way Grace would — the thinking process, iteration patterns, and decision-making heuristics.

### Core Decision-Making Philosophy

> "When in doubt, go subtle. You can always add more."

Grace's design process favors **restraint over addition**. The default instinct should be to do less, not more. If something feels like it might be too much, it probably is.

### Iteration Patterns

#### Small Incremental Changes

Spacing and sizing adjustments should be **1-2 Tailwind units at a time**, not dramatic jumps:

| Instead of | Do this |
|------------|---------|
| `mb-4` → `mb-12` | `mb-4` → `mb-6`, evaluate, then maybe `mb-8` |
| `text-base` → `text-xl` | `text-base` → `text-lg`, evaluate |
| `gap-4` → `gap-12` | `gap-4` → `gap-6`, evaluate |

**Why:** Large jumps make it hard to find the sweet spot. Small increments let you feel when it's "just right."

#### The "Bump" Approach

When Grace says something needs "more breathing room" or asks "should we add spacing?", the answer is usually a small bump:

- `mb-2` → `mb-4` (one level up)
- `mb-3` → `mb-4` (minimal bump)
- `gap-3` → `gap-4` or `gap-5`

**Real example from portfolio:**
```
ContactDrawer title spacing: mb-2 → mb-4 (one bump)
ContactDrawer header to form: mb-10 → mb-16 (larger section = bigger bump)
Design system icon to title: mb-3 → mb-4 (minimal bump)
```

#### When to Revert

**Revert if:**
- The change feels "off" but you can't articulate why
- It solves one problem but creates visual tension elsewhere
- You find yourself adding more changes to compensate for the first one
- Grace says "actually... I prefer how it was"

**Real example:** Animation changes to the "soulful" text effect were tried (overshoot, background position shifts) but reverted because the original felt more natural.

### Responding to Vague Feedback

When feedback is intuitive rather than specific, here's how to interpret:

| Grace says | Likely means | Try this |
|------------|--------------|----------|
| "hmm" | Something's off, not sure what | Ask: "Is it spacing, color, or proportion?" |
| "is this looking optimal?" | Probably needs a small tweak | Suggest 1-2 subtle adjustments to choose from |
| "should we add X?" | Open to it but wants confirmation | Give honest opinion, offer to try it |
| "it's not quite right" | Trust the instinct, iterate | Try the opposite direction or revert |
| "ok" | Approved, move forward | Implement and move on |
| "ok yeah that helped" | Confirmed improvement | Lock it in |

### Visual Hierarchy Decisions

#### When to Use Each Typography Level

| Content Type | Use | Why |
|--------------|-----|-----|
| Page title, hero text | H1 / Display | Maximum impact, one per page |
| Major sections | H2 | Clear content divisions |
| Subsections | H3 | Within a major section |
| Card titles, small headers | H4 | Compact but distinct |
| Labels, metadata | Caption (mono) | Technical, secondary info |

#### When to Add vs. Remove Elements

**Add an element if:**
- It serves a clear purpose (navigation, feedback, hierarchy)
- Removing it would confuse users
- It reinforces the content's meaning

**Remove an element if:**
- You're adding it "just in case"
- It duplicates information
- It competes for attention with more important content

**Real example:** Footer was simplified — removed tagline "Designed & built with intention" because the work itself demonstrates that.

### Color Decision Framework

#### Choosing Accent Colors

1. **Primary action?** → Amethyst (#5835B0 / #8B6AFF)
2. **Secondary/decorative?** → Lilac, Rose, or Gold based on warmth needed
3. **Data visualization?** → Use extended palette (Turquoise, Lagoon, Peridot, Forest)
4. **Status feedback?** → System colors (Success green, Error red, Warning amber)

#### Opacity Decisions

| Goal | Opacity Range |
|------|---------------|
| Barely visible, texture only | 0.015 - 0.02 |
| Subtle but present | 0.04 - 0.06 |
| Clearly visible but soft | 0.08 - 0.10 |
| Prominent | 0.15 - 0.20 |
| Strong presence | 0.30+ |

**Heuristic:** Start with the lowest opacity that achieves the goal. Increase only if invisible.

### Animation Decision Framework

#### Should This Animate?

**Yes, animate if:**
- It provides feedback (hover, click, success)
- It guides attention (entrance, scroll reveal)
- It creates delight without distraction

**No, don't animate if:**
- It's purely decorative with no purpose
- It would delay the user
- It draws attention away from content

#### Choosing Duration

| Purpose | Duration |
|---------|----------|
| Immediate feedback (hover color) | 150-300ms |
| State change (button press) | 300-400ms |
| Content reveal (scroll into view) | 500-800ms |
| Major entrance (hero) | 800-1200ms |

**Heuristic:** If you notice the animation, it might be too slow. Motion should feel inevitable, not performed.

### Component Evolution Patterns

Based on git history, components typically evolve through this cycle:

1. **Initial implementation** — Get it working
2. **Accessibility pass** — Touch targets, visibility
3. **Visual refinement** — Spacing, alignment
4. **Interaction polish** — Hover states, animations
5. **Simplification** — Remove what's unnecessary

**Real example (Category Cards):**
```
v1: Arrow only on hover
v2: Arrow always visible on touch devices
v3: Added icon above title + arrow
v4: Added frosted glass circle around icon
v5: Added brand colors to icons, moved arrow to bottom
```

### Red Flags (What Feels "Off")

Watch for these signs that something needs adjustment:

| Red Flag | Likely Cause | Fix |
|----------|--------------|-----|
| Elements feel cramped | Insufficient spacing | Bump margin/padding up 1-2 units |
| Something "pops" too much | Opacity too high or wrong color | Reduce opacity or use muted variant |
| Layout feels heavy | Too many borders/shadows | Remove decorative elements |
| Animation feels jarring | Wrong easing or duration | Use organic curve, adjust timing |
| Text hard to scan | Line height or width issue | Add leading-relaxed, constrain max-width |
| Hover feels dead | Missing micro-interaction | Add subtle transform or color shift |

### Specific Preferences

These are Grace's specific preferences observed through iteration:

#### Spacing
- Prefers generous whitespace over tight layouts
- Section separations should be generous (`mb-12` to `mb-16`)
- Titles close to their content (`mb-4`), not floating

#### Typography
- Serif only for hero/display text, never body
- Mono always uppercase for labels/captions
- Tracking-tight for headings, tracking-wide for mono

#### Animation
- Organic easing curves, never linear
- Subtle transforms (scale 1.03, not 1.1)
- Icon movements tiny (0.5px translate)
- Entrance animations have blur component

#### Color
- Dark mode backgrounds: true black (#0A0A0A), not gray
- Light mode backgrounds: warm (#FAF8F4), not pure white
- Borders always semi-transparent, never solid colors
- Accent colors used sparingly for emphasis

#### Components
- Buttons: monospace, uppercase, rounded-md
- Inputs: underline style, not boxed
- Cards: frosted glass with grain texture
- Icons: Phosphor, regular weight default

### Example Decision Trees

#### "Should I increase the font size?"

```
Is the text hard to read?
├─ Yes → Is it body text?
│        ├─ Yes → Consider leading-relaxed first, then size
│        └─ No → Increase by one step (base → lg)
└─ No → Is it a heading that needs more impact?
         ├─ Yes → Increase by one step
         └─ No → Don't change it
```

#### "Should I add a border?"

```
Is there a container that needs definition?
├─ Yes → Is it a card/panel?
│        ├─ Yes → Use frosted container pattern
│        └─ No → Use subtle border (white/[0.06])
└─ No → Is it a divider between sections?
         ├─ Yes → Use Divider component
         └─ No → Probably don't need a border
```

#### "Should I add an animation?"

```
Does this element change state?
├─ Yes → Add 300ms transition
└─ No → Does it enter the viewport?
         ├─ Yes → Add scroll reveal (opacity + translateY)
         └─ No → Does it need attention?
                  ├─ Yes → Consider subtle pulse or scale
                  └─ No → No animation needed
```

### Working With Grace

When presenting options:

1. **Offer 2-3 choices**, not open-ended questions
2. **Show the subtle option first** — it's usually preferred
3. **Explain tradeoffs briefly** — don't over-justify
4. **Be willing to revert** — no ego about changes
5. **Trust her instinct** — if she says it's off, it is

When she's unsure:

1. **Try the minimal change first**
2. **Show before/after if possible**
3. **Ask specific questions** ("Is it the spacing or the color?")
4. **Offer to revert** if the change doesn't land

---

*Document generated from Grace Guo's 2026 portfolio. Last updated: January 2026.*
