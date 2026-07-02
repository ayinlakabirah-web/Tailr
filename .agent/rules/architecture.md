---
trigger: always_on
---

# Architecture Rules — Tailr

These rules govern how the codebase is organized and how data flows through the
application. They are binding — if a change requires deviating from this structure,
stop and ask before proceeding.

## Stack Recap
- Next.js (App Router), TypeScript
- Next.js Server Actions for all mutations and most data fetching (no separate
  REST/GraphQL API layer unless explicitly requested)
- PostgreSQL via Prisma
- Nodemailer for email
- Deployed on Vercel

## Folder Structure
```
/app
  /(auth)
    /login
    /signup
    /reset-password
  /(dashboard)
    /dashboard
    /customers
      /[customerId]
    /orders
      /[orderId]
    /payments
    /deliveries
  /api            <- only for things Server Actions genuinely can't do
                     (e.g. webhook receivers). Default to Server Actions.
/components
  /ui             <- generic, reusable, no business logic (Button, Input, Modal...)
  /customers
  /orders
  /payments
  /deliveries
  /dashboard
/lib
  /actions        <- Server Actions, grouped by domain (customers.ts, orders.ts...)
  /db.ts          <- Prisma client singleton
  /validation     <- Zod schemas, grouped by domain
  /auth.ts        <- session/auth helpers
  /email.ts       <- Nodemailer setup + send helpers
/prisma
  schema.prisma
  /migrations
.agents
  /rules
skills
```

## Layering Rules
1. **Components never talk to Prisma directly.** UI components call Server Actions
   in `/lib/actions`, never `import { prisma }` directly inside a component file.
2. **Server Actions never skip validation.** Every Server Action that accepts user
   input validates with a Zod schema from `/lib/validation` before touching the
   database. No exceptions, even for "obviously safe" internal forms.
3. **Vendor scoping happens in the data layer, not the UI.** Every query that reads
   or writes Customer, Order, Payment, Delivery, or Measurement data must filter by
   the authenticated vendor's `id` inside the Server Action itself — never rely on
   the UI to only show the "right" data.
4. **One Prisma client.** Use the singleton in `/lib/db.ts`. Never instantiate
   `new PrismaClient()` elsewhere — this exhausts connections in serverless/Vercel
   environments.
5. **Domain folders mirror the data model.** Customers, Orders, Payments, Deliveries,
   and Measurements are separate domains with separate action files, validation
   schemas, and component folders — even though they're linked by foreign keys.
   Don't merge them into one giant "records" abstraction.

## Data Flow (how a typical mutation should work)
```
User interacts with a Client Component (form, button)
  → calls a Server Action from /lib/actions/<domain>.ts
    → Server Action validates input via Zod schema
    → Server Action checks vendor ownership / authorization
    → Server Action performs the Prisma query (scoped to vendorId)
    → Server Action returns a typed result (success/error shape)
  → Client Component updates UI / shows error
  → revalidatePath() or revalidateTag() as needed so dashboard stats stay current
```

## Page vs. Component Responsibility
- **Pages** (`/app/.../page.tsx`) are responsible for: auth checks, fetching initial
  data via Server Actions, and composing components. Keep them thin.
- **Components** are responsible for: rendering and local interaction state only.
  Business logic and data access do not belong in components.

## Relationships Between Domains
- Order → must reference an existing Customer (`customerId`). Never allow an Order
  to be created without first validating the Customer exists and belongs to the
  current vendor.
- Order → Payment is 1:1. When an Order is created, a corresponding Payment record
  should be created (or explicitly deferred — don't leave it implicitly missing).
- Order → Delivery is 1:1. Same rule as above.
- Customer → Measurement is 1:many historically, but the UI/UX treats it as "current
  measurements" — updates should overwrite the existing Measurement record for that
  customer, not append a new one. Don't model this as an append-only log unless
  asked to add measurement history as a feature.

## Dashboard Aggregation
Dashboard stats (total customers, active orders, pending deliveries, outstanding
payments) should be computed via Prisma aggregate/count queries scoped to the
vendor, not by fetching full record sets and counting in JavaScript. Keep these
queries colocated in `/lib/actions/dashboard.ts`.

## When Adding a New Feature
1. Does it fit an existing domain folder? If yes, extend it. If no, create a new
   domain folder following the same pattern (action file, validation schema,
   component folder).
2. Does it require a schema change? Follow `skills/db-migration-runner/SKILL.md`.
3. Does it need a new Server Action? Follow `skills/api-route-scaffolder/SKILL.md`.
4. Does it need new UI? Follow `skills/component-builder/SKILL.md`.

## Explicitly Out of Scope for Architecture Decisions
- Don't introduce tRPC, GraphQL, or a separate Express/Fastify backend.
- Don't add a state management library (Redux, Zustand, etc.) for MVP — React state
  and Server Actions are sufficient for this scope. Raise it as a suggestion, don't
  add it unilaterally.
- Don't restructure the folder layout above without flagging the change and reason.
