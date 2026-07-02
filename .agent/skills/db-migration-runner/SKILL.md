---
name: db-migration-runner
description: >
  Use this skill whenever the Prisma schema needs to change for Tailr — adding a
  new model, adding/removing/renaming a field, changing a relation, adding an
  enum value, or any other change to prisma/schema.prisma. Trigger on requests
  like "add a notes field to Customer," "add a new Delivery status," "create the
  Measurement model," or "add an index for faster customer search."
---

# Skill: DB Migration Runner

## Purpose
Schema changes are high-risk: a mistake can corrupt data, break vendor-scoping, or
silently violate the business rules in `AGENTS.md`. This skill makes schema changes
deliberate, reviewed, and safely applied rather than improvised.

## Before You Start
1. Re-read the **Data Model** section of `AGENTS.md` — confirm the change is
   actually consistent with the documented model, or that you're intentionally
   and explicitly extending it (and should update `AGENTS.md` to match afterward).
2. Read `.agents/rules/architecture.md` for how models relate to each other
   (Customer → Order → Payment/Delivery, vendor scoping, etc.).
3. Check whether the change affects any business rule in `AGENTS.md` (e.g. "every
   order has exactly one payment record" — don't break this with an unrelated
   schema tweak).

## Step-by-Step Procedure

### 1. Make the change in `prisma/schema.prisma` only
- Never hand-edit generated migration SQL files directly, and never edit the
  database schema outside of Prisma migrations.
- Keep field naming consistent with existing conventions (camelCase fields,
  PascalCase model names, SCREAMING_SNAKE_CASE enum values).
- If adding a relation, make the foreign key and `@relation` explicit — don't rely
  on Prisma's implicit relation inference for anything beyond the simplest 1:1/1:many.
- If adding a field that represents money (e.g. a new payment-related field), use
  `Decimal` (not `Float`) to avoid floating-point rounding errors with currency.
- If adding a new enum value (e.g. a new Order status), check every place in the
  codebase that does an exhaustive switch/match on that enum (status badges,
  dashboard counts, business rule checks) and flag that they need updating —
  don't leave a new enum value unhandled in the UI logic.

### 2. Consider data impact before generating the migration
- **Adding a required field with no default** to a model that already has rows →
  this will fail or null out existing data. Either:
  - add it as optional, or
  - provide a sensible `@default(...)`, or
  - write a data migration step to backfill values before making it required.
- **Renaming a field** → Prisma will treat this as drop + add by default, losing
  data, unless you use `@map` or write a manual migration step. Flag this
  explicitly and confirm the intended behavior before proceeding.
- **Removing a field/model** → confirm nothing in `/lib/actions`, `/components`,
  or validation schemas still references it. A schema-only removal that leaves
  dangling references will fail at build time, but check before generating the
  migration.
- **Changing a relation's cardinality** (e.g. 1:1 → 1:many) → this is a structural
  change with real data implications. Treat it as a "stop and confirm" moment
  rather than a routine edit.

### 3. Generate the migration
Run in the project root:
```bash
npx prisma migrate dev --name <short_descriptive_name>
```
- Name migrations descriptively and consistently:
  `add_notes_to_customer`, `add_delivery_status_cancelled`,
  `create_measurement_model`. Lowercase, underscore-separated, no spaces.
- Review the generated SQL in `prisma/migrations/<timestamp>_<name>/migration.sql`
  before considering the change complete — don't just trust the diff blindly,
  especially for anything involving `DROP COLUMN`, `DROP TABLE`, or `ALTER COLUMN`
  with a type change.

### 4. Regenerate the Prisma client
```bash
npx prisma generate
```
This should normally run automatically as part of `migrate dev`, but confirm
generated types in `node_modules/.prisma/client` reflect the change before writing
code against the new schema (check for TypeScript errors referencing the new/
changed fields).

### 5. Update dependent code
- Update any Zod validation schema in `/lib/validation` that maps to the changed
  model.
- Update any Server Action in `/lib/actions` that reads/writes the changed fields.
- Update any component prop types that destructure the changed model shape.
- If an enum changed, update every status badge / switch statement that maps enum
  values to UI labels and colors (see `.agents/rules/design-system.md` for the
  status color requirements — a new status needs a defined color + label, not a
  fallback default).

### 6. Update `AGENTS.md`
If the change alters the documented data model (new field, new model, new enum
value, changed relation), update the **Data Model** section of `AGENTS.md` to
match. The schema and `AGENTS.md` must never drift apart — `AGENTS.md` is the
plain-language source of truth that the rest of the agent's reasoning depends on.

### 7. Self-check before finishing
- [ ] Change made only in `schema.prisma`, not hand-edited SQL or live DB
- [ ] Required-field-with-no-default risk checked and handled (default, optional,
      or backfill plan)
- [ ] Rename/removal impact checked against existing data and codebase references
- [ ] Relation cardinality changes explicitly confirmed, not assumed
- [ ] Migration generated with `prisma migrate dev --name <descriptive_name>`
- [ ] Generated SQL reviewed, especially any `DROP`/`ALTER` statements
- [ ] Prisma client regenerated and TypeScript errors resolved
- [ ] Dependent Zod schemas, Server Actions, and components updated
- [ ] New enum values (if any) have defined UI color + label, no silent fallback
- [ ] `AGENTS.md` Data Model section updated to match

## Example Request → Action
**Request:** "Add a `CANCELLED` status to Orders."

**What to do:**
1. Confirm with `architecture.md`/`AGENTS.md` that this doesn't conflict with any
   business rule (e.g. check how cancellation should interact with Payment/Delivery
   records — flag this as a question if it's ambiguous rather than guessing).
2. Add `CANCELLED` to the `OrderStatus` enum in `schema.prisma`.
3. Run `npx prisma migrate dev --name add_order_status_cancelled`.
4. Review the migration SQL (enum alteration).
5. Regenerate client, fix any TypeScript errors from exhaustive switches on
   `OrderStatus` in dashboard counts, status badges, and order list filters.
6. Add a color + label for `CANCELLED` in the design system's status badge
   mapping (e.g. gray/muted, label "Cancelled").
7. Update `AGENTS.md`'s Order status enum list to include `CANCELLED`.
8. Run through the self-check list above.
