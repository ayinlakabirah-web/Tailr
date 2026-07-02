---
trigger: always_on
---

# Code Style Rules — Tailr

Binding conventions for how code is written in this repo. The goal is consistency
that a small, mostly-solo team (and an AI agent working across many sessions) can
maintain without constant re-explaining.

## Language & Types
- TypeScript everywhere. No `.js`/`.jsx` files in `/app`, `/components`, or `/lib`.
- `strict: true` in `tsconfig.json` — never weaken this to make code compile faster.
- Never use `any`. If a type is genuinely unknown, use `unknown` and narrow it.
- Derive types from the Prisma schema (`Prisma.Customer`, `Prisma.OrderGetPayload<...>`,
  etc.) instead of hand-writing duplicate interfaces that can drift out of sync.
- Use Zod schemas as the single source of truth for input validation, and infer
  TypeScript types from them with `z.infer<typeof schema>` rather than writing the
  type twice.

## Naming Conventions
- **Files:** kebab-case (`customer-form.tsx`, `order-status-badge.tsx`).
- **Components:** PascalCase (`CustomerForm`, `OrderStatusBadge`).
- **Server Actions / functions:** camelCase, verb-first (`createCustomer`,
  `updateOrderStatus`, `recordDeposit`).
- **Database fields:** match the schema exactly as defined in `AGENTS.md` /
  `prisma/schema.prisma` — don't rename fields in the app layer (e.g. don't call
  `depositPaid` `deposit` in component props).
- **Booleans:** prefix with `is`/`has`/`can` (`isOverdue`, `hasOutstandingBalance`).
- **Status enums:** SCREAMING_SNAKE_CASE matching the Prisma enum values exactly
  (`IN_PROGRESS`, `PARTIALLY_PAID`).

## Component Conventions
- Function components only. No class components.
- Default to **Server Components**. Only add `"use client"` when the component
  needs interactivity (state, effects, event handlers, browser APIs).
- Keep components focused — if a component file exceeds ~150 lines, consider
  splitting it.
- Props: define an explicit `interface ComponentNameProps` above the component.
  No inline anonymous prop types for anything beyond 1–2 simple primitives.
- No default exports for components — use named exports for better refactor safety
  and consistent imports.

## Server Actions
- One action per exported function; group related actions in a single domain file
  (e.g. all customer actions in `/lib/actions/customers.ts`).
- Always mark with `"use server"` at the top of the file.
- Always validate input with Zod before doing anything else in the function body.
- Always return a consistent result shape, e.g.:
  ```ts
  type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };
  ```
- Never throw raw errors back to the client with internal details (stack traces,
  Prisma error internals). Catch, log server-side, and return a clean user-facing
  message.

## Formatting & Linting
- Use Prettier defaults (2-space indent, semicolons, single quotes) — don't
  hand-format against the configured formatter.
- ESLint must pass with no warnings before considering a feature "done." Don't
  disable rules inline (`// eslint-disable-next-line`) without a comment explaining
  why it's necessary.
- Imports order: external packages, then internal absolute imports (`@/lib/...`,
  `@/components/...`), then relative imports. Group with a blank line between.

## Comments & Documentation
- Comment *why*, not *what* — the code should already say what it does.
- Every Server Action and non-trivial utility function gets a one-line JSDoc comment
  describing its purpose and any non-obvious business rule it enforces (e.g. "Blocks
  deletion if customer has active orders — see architecture.md").
- No commented-out dead code left in commits.

## Error Handling
- User-facing errors: short, plain-language, no jargon (remember: non-technical
  users). "We couldn't find that customer" not "Error: Customer entity not found
  (404)".
- Log detailed errors server-side (console.error or a logging utility), but never
  expose stack traces or raw database errors to the client.

## Testing Expectations
- Every Server Action that contains a business rule (see `architecture.md` and
  `AGENTS.md` business rules section) should have at least one corresponding test
  validating that rule — e.g. a test that confirms an Order cannot be created
  without a valid Customer.
- Prefer integration-style tests over heavy mocking for Server Actions, since the
  business logic lives close to the database layer.

## Git Hygiene
- Small, scoped commits — one feature/fix per commit where reasonable.
- Commit messages: imperative mood, lowercase, no period
  (`add customer search endpoint`, not `Added customer search.`).
- Don't commit `.env`, generated Prisma client output, or `node_modules`.

## What NOT to Do
- Don't reach for a UI/component library (MUI, Chakra, shadcn, etc.) unless the
  design system explicitly calls for it — see `design-system.md`.
- Don't introduce new linting/formatting configs without flagging it.
- Don't write business logic inside JSX/render functions — extract to a named
  function or Server Action.
