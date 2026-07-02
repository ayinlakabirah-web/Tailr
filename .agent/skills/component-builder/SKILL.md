---
name: component-builder
description: >
  Use this skill whenever a new UI component is needed for Tailr — a form, a
  card, a list item, a modal, a status badge, a dashboard widget, or any other
  visual piece. Covers both new generic UI primitives (/components/ui) and
  domain-specific components (/components/customers, /components/orders, etc).
  Trigger on requests like "build a customer card," "create the order form,"
  "add a delivery status badge," or "make a modal for recording a deposit."
---

# Skill: Component Builder

## Purpose
Ensure every new component in Tailr is consistent with the design system, properly
typed, correctly scoped (Server vs. Client), and wired to the right data layer —
without the agent having to re-derive these decisions from scratch each time.

## Before You Start
1. Read `.agents/rules/design-system.md` for color variables, spacing scale,
   typography, and component expectations.
2. Read `.agents/rules/code-style.md` for naming, typing, and Server/Client
   Component conventions.
3. Check `/components/ui` for an existing primitive that already covers this need
   (Button, Input, Badge, Card, Modal, Table, EmptyState, Toast). Reuse before
   building new.

## Step-by-Step Procedure

### 1. Classify the component
Decide which bucket it belongs to:
- **Generic UI primitive** (no business logic, reusable anywhere) → goes in
  `/components/ui`.
- **Domain component** (knows about Customers, Orders, Payments, Deliveries, or
  Measurements) → goes in the matching domain folder, e.g. `/components/orders`.

If you're unsure, ask: "Could this component be reused in a totally different app
with no changes?" If yes, it's a primitive. If no, it's a domain component.

### 2. Decide Server vs. Client Component
- Default to a **Server Component** (no `"use client"` directive).
- Add `"use client"` only if the component needs: local state (`useState`),
  effects (`useEffect`), event handlers that need interactivity beyond a plain
  form submit, or browser-only APIs.
- A form that just submits via a Server Action does NOT automatically need to be
  a Client Component — only add the directive if you need client-side state
  (e.g. live validation feedback, controlled inputs with conditional logic).

### 3. Define the props interface
- Create an explicit `interface ComponentNameProps` above the component.
- Use types derived from Prisma (`Prisma.CustomerGetPayload<...>`) for any prop
  that represents a database record — don't hand-write a duplicate shape.
- No default exports — use a named export matching the component name.

### 4. Build the markup
- Mobile-first: write the base styles for a ~375px viewport, then add
  `@media (min-width: 768px)` overrides for tablet/desktop — never the reverse.
- Use only the CSS variables defined in `design-system.md` for colors, spacing,
  and type sizes. No hardcoded hex values or arbitrary pixel spacing.
- Minimum tap target of 44x44px for any interactive element.
- If the component shows a status (order/payment/delivery), use the `Badge`
  primitive with both color and text label — never color alone.

### 5. Handle empty, loading, and error states (if applicable)
If the component renders a list or fetched data:
- Empty state: use or extend the `EmptyState` primitive with friendly copy and a
  clear primary action.
- Loading state: use a skeleton loader matching the component's eventual layout,
  not a generic spinner, when the layout is predictable.
- Error state: short, plain-language message (no jargon, no raw error text).

### 6. Wire up data (if the component triggers a mutation)
- Forms and action buttons call a Server Action from `/lib/actions/<domain>.ts` —
  never call Prisma directly from the component.
- Show a clear success/error state after the action resolves (toast or inline
  alert, per `design-system.md`).
- After a mutation that affects dashboard stats (creating/updating an order,
  payment, or delivery), make sure the relevant `revalidatePath`/`revalidateTag`
  is called in the Server Action so the dashboard reflects it.

### 7. Self-check before finishing
- [ ] Component is in the correct folder (`/components/ui` vs. domain folder)
- [ ] Props are explicitly typed, no `any`
- [ ] Named export, PascalCase component name, kebab-case filename
- [ ] Mobile layout built first, verified at ~375px width
- [ ] Only design-system CSS variables used — no hardcoded colors/spacing
- [ ] Status (if any) shown with color + label
- [ ] Empty/loading/error states handled if the component fetches or lists data
- [ ] No direct Prisma/database calls inside the component
- [ ] Tap targets ≥ 44x44px

## Example Request → Action
**Request:** "Build a card that shows a customer's name, phone, and how many
active orders they have, with a tap target that opens their detail page."

**What to do:**
1. Classify: domain component → `/components/customers/customer-card.tsx`.
2. Server Component by default (no client state needed for a simple display card
   with a link).
3. Props: `{ customer: Prisma.CustomerGetPayload<{ include: { orders: true } }> }`.
4. Build mobile-first card using `Card` primitive, `--space-*` variables, and
   `--text-*` scale; whole card wrapped in a `<Link>` to the detail page with a
   ≥44px tap target.
5. No mutation involved, so no Server Action wiring needed — just display logic.
6. Run through the self-check list above before considering it done.
