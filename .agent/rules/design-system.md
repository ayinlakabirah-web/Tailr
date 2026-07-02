---
trigger: always_on
---

# Design System Rules — Tailr

Tailr's users are non-technical, mobile-first small business owners who are often
checking the app in spare moments between customer fittings or deliveries. The UI
must prioritize clarity and speed over visual flourish. When in doubt, choose the
simpler, more obvious design.

## Design Principles
1. **Mobile-first, always.** Design and build for a ~375–414px viewport first, then
   adapt up to tablet/desktop. Never design desktop-first and shrink down.
2. **Plain language over jargon.** No technical terms in UI copy. "Outstanding
   balance" is fine; "delta" or "variance" is not.
3. **One primary action per screen.** Every page should have one obvious next step
   (e.g. "Add Customer," "Create Order"). Avoid competing calls to action.
4. **Forgiving forms.** Inline validation, clear required-field indicators, and
   error messages that say what to fix — not just that something is wrong.
5. **Status at a glance.** Order, payment, and delivery statuses must be visually
   distinct (color + label, never color alone) so users can scan a list and
   understand state without reading every row closely.

## Color System
> **Note:** The official color palette (brand colors, status colors, neutrals) is
> available in `tokens/color-token.json` and `tokens/design-tokens.tokens.json`.
> These are automatically compiled into CSS variables in `tokens/tokens.css`
> using `tokens/generate-tokens.js`. Use these variables everywhere — never
> hardcode hex/HSL values in components.

Required structure for the palette, regardless of final values:
- **Brand colors** — primary, primary variant, accent — for primary actions, nav,
  and highlights.
- **Status colors (semantic, not brand-decorative)** — distinct colors for each
  Order status (`NEW`, `IN_PROGRESS`, `READY`, `DELIVERED`) and each Payment status
  (`UNPAID`, `PARTIALLY_PAID`, `PAID`). These must be visually distinguishable from
  each other and from the brand palette.
- **Neutrals** — background, surface, border, primary text, secondary text.
- **Feedback colors** — error, success, warning.

The *structure* above (semantic status colors kept separate from brand-decorative
colors) must be preserved regardless of which exact values are supplied.

## Typography
> **Note:** The official typography system (font family, type scale, weights) is 
> available in `tokens/design-tokens.tokens.json` and compiled into `tokens/tokens.css`.
> Use the system font stack only as a fallback if the primary font (Inter) is not 
> yet loaded. Expose each scale as a CSS variable from the token set.

Required structure for the type scale, regardless of final values:
- A mobile-first, rem-based scale with distinct sizes for: helper text/timestamps,
  secondary text/labels, body (default), section headers, page titles, and
  dashboard hero numbers — expose each as a CSS variable (e.g. `--text-sm`,
  `--text-base`, `--text-lg`) rather than hardcoding sizes per component.
- Line height conventions for body text vs. headings.
- A minimum readable size for any user-facing text — these are often viewed on
  small phone screens, sometimes by users with low vision. Don't go below
  whatever floor the final system specifies (treat `0.75rem`/12px as the
  provisional floor until told otherwise).

## Spacing
Use a consistent 4px-based spacing scale via CSS variables — don't use arbitrary
pixel values in components.
```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
}
```

## Layout
- Minimum tap target size: 44x44px for any interactive element (buttons, links,
  checkboxes) — this is a mobile-first, non-negotiable accessibility baseline.
- Forms: single column on mobile, always. Never use multi-column forms below
  tablet breakpoint (768px).
- Lists (customers, orders): card-based layout on mobile, can become table-like
  on desktop, but the mobile card view is the primary design to get right first.
- Bottom-anchored primary actions on mobile where appropriate (e.g. a sticky "Save"
  button) so users don't have to scroll to act.

## Components (build in `/components/ui` as generic, reusable primitives)
At minimum, the UI primitive library should include:
- `Button` (variants: primary, secondary, danger, ghost)
- `Input`, `Select`, `Textarea` (with built-in label + error message slot)
- `Badge` (used for order/payment status — must support the semantic status colors)
- `Card`
- `Modal` / `Dialog`
- `Table` (desktop) and a corresponding `ListCard` pattern (mobile)
- `EmptyState` (for "no customers yet," "no orders yet," etc. — friendly, with a
  clear call to action, never just a blank screen)
- `Toast`/inline alert for success and error feedback after actions

These primitives live in `/components/ui` and must not contain business logic or
domain-specific copy — they take props and render. Domain components (e.g.
`CustomerCard`, `OrderStatusBadge`) compose these primitives.

## Status Badge Rules
Every status badge (Order or Payment) must render both a color and a text label.
Never rely on color alone to convey status (accessibility + many small phone
screens have poor color reproduction in bright sunlight).

## Empty & Loading States
- Every list view (customers, orders, payments, deliveries) needs a designed empty
  state with friendly copy and a primary action — not a blank page or a raw "No
  data" string.
- Use skeleton loaders for data-fetching states, not spinners alone, where the
  layout is predictable (e.g. dashboard cards, list rows).

## What NOT to Do
- Don't pull in a full component library (Material UI, Chakra, Ant Design) — build
  primitives in plain CSS/TypeScript per this system. If a heavier library is truly
  needed, flag it as a decision, don't add it silently.
- Don't introduce a second color palette, ad hoc hex values, or hardcoded font
  sizes inside component files — everything routes through CSS variables, even
  before the final palette/type values are supplied.
- Don't design any flow desktop-first "and fix mobile later." Mobile is the primary
  target, not a responsive afterthought.
- Don't use color as the only signal for status, errors, or success.
