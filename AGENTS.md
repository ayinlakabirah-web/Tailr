# AGENTS.md — Tailr

## Project Overview
Tailr is a web-based operating system for small fashion businesses (tailors, fashion
designers, bespoke clothing vendors, ready-to-wear sellers). It replaces WhatsApp,
notebooks, and spreadsheets with one platform to manage customers, measurements,
orders, payments, and deliveries.

Tagline: "Run your entire fashion business from one place."

Primary users are non-technical, mobile-first, solo or small-team (<10 people)
entrepreneurs, often multitasking across customers, production, and deliveries.
Every screen and flow should be simple enough for someone with no software
background to use without training.

This file is the entry point. Detailed, enforceable rules live in `.agents/rules/`
and reusable build procedures live in `skills/`. Read both before generating code.

## Tech Stack (use these, don't substitute without asking)
- **Frontend:** Next.js (App Router), TypeScript, CSS (no CSS frameworks unless agreed)
- **Backend:** Next.js Server Actions (no separate REST/GraphQL API layer unless asked)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Email:** Nodemailer
- **Deployment target:** Vercel

## Rules (.agents/rules/)
These are binding constraints, not suggestions. Read the relevant file before
touching the related part of the codebase:
- `.agents/rules/architecture.md` — folder structure, data flow, Server Actions vs.
  routes, how features are organized
- `.agents/rules/code-style.md` — TypeScript conventions, naming, formatting, testing
- `.agents/rules/design-system.md` — visual language, components, spacing, mobile-first rules
- `.agents/rules/security.md` — auth, validation, data isolation, OWASP basics

## Skills (skills/)
Reusable, step-by-step procedures the agent should follow for repetitive build tasks:
- `skills/component-builder/SKILL.md` — scaffolding a new UI component correctly
- `skills/api-route-scaffolder/SKILL.md` — scaffolding a new Server Action / route
- `skills/db-migration-runner/SKILL.md` — making and applying Prisma schema changes safely

## Product Scope (MVP — Phase 1)
Build and prioritize in this order. Do not start Phase 2+ features unless explicitly asked:
1. Authentication (sign up, log in, password reset)
2. Dashboard (totals: customers, active orders, pending deliveries, outstanding payments)
3. Customer management (add, edit, search, view history)
4. Measurement management (save, edit, retrieve — no duplicate records on update)
5. Order management (create, assign to customer, track/update status)
6. Payment tracking (record deposit, track balance, update status)
7. Delivery tracking (set date, track progress, mark delivered)
8. Email notifications (account verification, password reset; delivery reminders are
   Phase 2 — stub only, do not fully build)

Future phases (do not build now, but keep the data model extensible toward them):
- Phase 2: delivery reminders, dashboard notifications, calendar view
- Phase 3: staff management, appointment booking, customer portal
- Phase 4: inventory, fabric management, expense tracking
- Phase 5: AI business assistant, delivery predictions, analytics

## Data Model (source of truth — keep schema consistent with this)
- **User**: id, fullName, email, password, createdAt, updatedAt
- **Customer**: id, fullName, phoneNumber, email?, address?, vendorId, createdAt, updatedAt
- **Measurement**: id, customerId, shoulder, bust, waist, hip, sleeve, armhole, thigh,
  trouserLength, createdAt, updatedAt
- **Order**: id, customerId, outfitType, quantity, specialInstructions, deliveryDate,
  status, createdAt, updatedAt
  - Status enum: `NEW | IN_PROGRESS | READY | DELIVERED`
- **Payment**: id, orderId, totalAmount, depositPaid, balanceRemaining, status, createdAt
  - Status enum: `UNPAID | PARTIALLY_PAID | PAID`
- **Delivery**: id, orderId, deliveryDate, status, deliveredAt

## Business Rules (enforce in logic/validation, not just UI)
- Every customer belongs to exactly one vendor (User).
- A customer can have multiple orders.
- Every order has exactly one Payment record and one Delivery record.
- Orders cannot be created without a valid, existing customer.
- Orders cannot be submitted incomplete (missing required fields).
- Delivery dates cannot be set in the past.
- Updating measurements should update the existing record, never create a duplicate.
- Deletion of a customer with active orders must be restricted/blocked.
- On duplicate customer detection (same name/phone), suggest the existing customer
  instead of silently creating a new one.
- Dashboard stats must update automatically/reactively — not via manual refresh logic.
- Users can only ever access their own (vendor-scoped) data.

## Edge Cases to Handle Explicitly
| Scenario | Required behavior |
|---|---|
| Incorrect login credentials | Show clear error message |
| Order submitted with no customer selected | Block submission |
| Incomplete measurement form | Highlight required fields |
| Past delivery date selected | Block submission |
| Delete customer with active orders | Restrict/block deletion |
| Duplicate customer detected | Suggest existing customer record |
| Network/connection lost | Show connection error state |

## What NOT to Do
- Don't add features from Phase 2–5 without being explicitly asked.
- Don't introduce a different framework, database, or ORM than specified above.
- Don't build this as a generic CRM/project-management tool — it should reflect the
  specific fashion-business workflow (measurements, outfit orders, deposits/balances,
  delivery dates), not generic "tasks" or "projects."
- Don't skip server-side validation in favor of only client-side checks.
- Don't create new Measurement records on edit — update in place.

## Reference
Full Product Requirements Document: see `prd.md`
for complete context, including market positioning, success metrics, and the full roadmap.
