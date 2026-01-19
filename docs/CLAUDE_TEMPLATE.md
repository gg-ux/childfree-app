# Grace Guo Design Principles
<!-- Copy this to CLAUDE.md in new projects -->

## Core Philosophy
> "Meaningful design is care, made visible."

Design should be warm but not loud, confident enough to lead, quiet enough to let the work speak.

## Typography

| Purpose | Font | Style |
|---------|------|-------|
| Display headlines | Silk Serif | tracking-tight, leading-[0.85] |
| Body/Headings | Satoshi | leading-relaxed for body |
| Captions/Labels | Azeret Mono | uppercase, tracking-wide |

**Hierarchy:** theme-heading > theme-body > theme-caption > theme-muted

## Colors (Soulful Palette)

| Color | Light | Dark | Use |
|-------|-------|------|-----|
| Amethyst | #5835B0 | #8B6AFF | Primary accent |
| Lilac | #BF92F0 | #BF92F0 | Secondary |
| Rose | #D78F8D | #D78F8D | Tertiary |
| Gold | #DBA166 | #DBA166 | Warm accent |

**Backgrounds:** #FAF8F4 (light) / #0A0A0A (dark)
**Borders:** rgba(0,0,0,0.08) (light) / rgba(255,255,255,0.06) (dark)

## Spacing

- **Container:** `max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20`
- **Section gaps:** `mb-12` to `mb-16`
- **Component gaps:** `gap-4` to `gap-8`
- **Body text max-width:** `max-w-2xl` to `max-w-3xl`

## Animation

- **Primary easing:** `cubic-bezier(0.22, 1, 0.36, 1)` — organic deceleration
- **Standard duration:** 300ms (hover states, color transitions)
- **Entrance duration:** 800-1200ms (page elements)
- **Hover scale:** 1.03-1.05 (subtle, never jarring)
- **Never use linear easing** — always organic curves

## Components

### Buttons
- Primary: Solid (white on dark, dark on light)
- Secondary: Frosted glass (`backdrop-blur-md`, subtle border)
- Ghost: Text only, color change on hover
- Always `font-mono text-[12px] uppercase rounded-md`

### Containers
- Frosted: `rounded-2xl border backdrop-blur-md bg-white/[0.015]`
- Include grain texture for tactile feel

### Inputs
- Underline style only (no box)
- Border bottom, transparent background
- Focus: border opacity increases

## Interaction Patterns

- Hover effects: scale 1.03, color transitions 300ms
- Buttons: content scales 1.05 on hover
- Icons: translate 0.5px on hover
- Active/tap: scale 0.95 for feedback
- Custom cursor on desktop (mix-blend-mode: difference)

## Icons (Phosphor)

- Standard size: 20px
- Button icons: 13px
- Weights: regular (default), fill (emphasis), light (minimal)
- Always animate on hover (translate or scale)

## Decision-Making

### Core Heuristic
> "When in doubt, go subtle. You can always add more."

### Iteration Pattern
- Make **small changes** (1-2 Tailwind units at a time)
- `mb-4` → `mb-6`, not `mb-4` → `mb-12`
- Evaluate after each change before going further

### Interpreting Feedback
| Grace says | Means | Do this |
|------------|-------|---------|
| "hmm" | Something's off | Ask: spacing, color, or proportion? |
| "should we add X?" | Open to it | Give honest opinion, offer to try |
| "ok" | Approved | Move forward |
| "actually prefer original" | Revert | Revert immediately, no pushback |

### When to Revert
- Change feels "off" but can't articulate why
- Solving one problem but creating tension elsewhere
- Adding more changes to compensate for the first one

### Red Flags (What Feels "Off")
| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Feels cramped | Not enough spacing | Bump margin up 1-2 units |
| Pops too much | Opacity too high | Reduce opacity or use muted |
| Feels heavy | Too many borders/shadows | Remove decorative elements |
| Animation jarring | Wrong easing/duration | Use organic curve, slower |

### Presenting Options
1. Offer 2-3 choices, not open-ended questions
2. Show subtle option first (usually preferred)
3. Be willing to revert — no ego about changes
4. Trust her instinct — if she says it's off, it is

## Don't Do

- Linear easing (always use curves)
- Sharp/mechanical animations
- Cold/corporate colors
- Cluttered layouts (generous whitespace)
- Box inputs (use underline style)
- Harsh borders (use subtle opacity)
- Over-designed elements that compete with content
- Big jumps in spacing/sizing (iterate small)
- Justifying changes too much (show, don't explain)

## Reference

Full documentation: See `DESIGN_DECISIONS.md` in gracebot repo
