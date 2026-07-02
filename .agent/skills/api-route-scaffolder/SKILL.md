---
name: api-route-scaffolder
description: >
  Use this skill whenever a new Server Action, mutation, or data-fetching
  function is needed for Tailr — creating a customer, recording a payment,
  updating an order status, sending a notification email, etc. Also covers the
  rare case of a true API route (e.g. a webhook receiver) where a Server Action
  isn't suitable. Trigger on requests like "add an action to create an order,"
  "build the endpoint for recording a deposit," or "wire up password reset."
---

# Skill: API Route / Server Action Scaffolder

## Purpose
Tailr uses Next.js Server Actions for nearly all backend logic (see
`.agents/rules/architecture.md`). This skill ensures every new Server Action is
validated, authorized, error-handled, and tested consistently — and that a true
API route is only created when genuinely necessary.

## Before You Start
1. Confirm this should be a Server Action, not an API route. Use an API route
   (`/app/api/.../route.ts`) only for things Server Actions can't do — e.g.
   receiving a webhook from an external service. Everything else (forms, button
   actions, data fetches triggered by the app's own UI) is a Server Action.
2. Read `.agents/rules/security.md` — every action handling Customer, Order,
   Payment, Delivery, or Measurement data must be vendor-scoped and validated.
3. Read `.agents/rules/code-style.md` for the required `ActionResult<T>` return
   shape and naming conventions.
4. Identify the correct domain file in `/lib/actions/` (e.g. `customers.ts`,
   `orders.ts`, `payments.ts`, `deliveries.ts`, `dashboard.ts`). Create a new one
   only if the action doesn't fit an existing domain.

## Step-by-Step Procedure

### 1. Define the Zod validation schema
- Add or extend a schema in `/lib/validation/<domain>.ts`.
- Validate every field that will be persisted: types, required/optional, format
  (e.g. phone number pattern, email format), and business constraints where
  expressible (e.g. `deliveryDate` must be a future date — see step 4).
- Export an inferred TypeScript type from the schema with `z.infer<...>` for use
  in the action and any calling components.

### 2. Write the Server Action
- File starts with `"use server"`.
- Function name: camelCase, verb-first (`createOrder`, `recordDeposit`,
  `updateDeliveryStatus`).
- Signature accepts the raw input (e.g. `FormData` or a typed object) and returns
  `Promise<ActionResult<T>>`:
  ```ts
  export async function createCustomer(
    input: CreateCustomerInput
  ): Promise<ActionResult<Customer>> {
    // 1. auth check
    // 2. validate
    // 3. business rule checks
    // 4. prisma call (vendor-scoped)
    // 5. revalidate + return
  }
  ```

### 3. Authenticate and authorize first
- Get the current session/vendor at the very top of the function, before
  validation or any database access.
- If there's no valid session, return an error result immediately — never
  proceed.
- For actions that operate on an existing record (update/delete), fetch the
  record first and confirm its `vendorId` (directly or via its related Customer)
  matches the current session's vendor before mutating anything.

### 4. Validate input
- Parse input through the Zod schema from step 1. On failure, return
  `{ success: false, error: <plain-language message> }` — don't let a Zod error
  object leak to the client.
- Enforce cross-field/business rules that Zod alone can't express, e.g.:
  - Order: `customerId` must reference an existing customer belonging to this
    vendor — check this explicitly, return a clear error if not.
  - Delivery: `deliveryDate` must not be in the past.
  - Measurement updates: must update the existing record for that customer, not
    insert a new one — look up by `customerId` first.
  - Customer deletion: must check for active orders first and block if any exist.

### 5. Perform the database operation
- Use the Prisma singleton from `/lib/db.ts`.
- Scope every query with the vendor's id (directly on the model, or via a nested
  `where` through the related Customer/Order).
- Wrap the Prisma call in a `try/catch`. On error, log the detailed error
  server-side (`console.error` or logging utility) and return a generic,
  plain-language error to the caller — never expose Prisma's raw error message.
- For actions that create related records together (e.g. creating an Order should
  also create its Payment and Delivery records), use a Prisma transaction
  (`prisma.$transaction`) so partial failures don't leave orphaned data.

### 6. Revalidate affected paths
- After a successful mutation, call `revalidatePath` (or `revalidateTag`) for any
  page whose data just changed — especially `/dashboard`, since its stats must
  update automatically per the business rules in `AGENTS.md`.

### 7. Return a clean result
- Success: `{ success: true, data: <created/updated record> }`.
- Failure: `{ success: false, error: <short, plain-language string> }`.
- Never throw an uncaught error out of a Server Action — always catch and return
  the `ActionResult` shape so the UI can handle it predictably.

### 8. Add a test
- Per `.agents/rules/code-style.md`, every Server Action enforcing a business rule
  needs at least one test covering that rule (e.g. "creating an order with a
  non-existent customerId returns an error and does not create a record").

### 9. Self-check before finishing
- [ ] Correct choice: Server Action vs. API route (Server Action unless proven otherwise)
- [ ] Auth/session check happens first, before validation or DB access
- [ ] Input validated via Zod schema before any database call
- [ ] Vendor ownership verified for any read/update/delete of existing records
- [ ] Related business rules enforced (see step 4 examples)
- [ ] Prisma calls wrapped in try/catch; errors logged server-side, not exposed
- [ ] Multi-record creates wrapped in a transaction where relationships demand it
- [ ] `revalidatePath`/`revalidateTag` called where dashboard or list views are affected
- [ ] Returns the standard `ActionResult<T>` shape
- [ ] At least one test added for any enforced business rule

## Example Request → Action
**Request:** "Add the action to record a deposit on an order."

**What to do:**
1. Confirm: Server Action, domain = payments → `/lib/actions/payments.ts`.
2. Schema: `/lib/validation/payments.ts` — `orderId` (string), `amount` (positive
   number, ≤ totalAmount remaining).
3. Action `recordDeposit(input)`:
   - Get session vendor.
   - Validate input via schema.
   - Fetch the Payment's related Order → Customer, confirm `vendorId` matches.
   - Check `amount` doesn't exceed `balanceRemaining`.
   - Update `depositPaid`, recompute `balanceRemaining`, update `status`
     (`UNPAID` → `PARTIALLY_PAID` → `PAID` based on resulting balance).
   - Revalidate the order detail page and `/dashboard`.
   - Return `ActionResult<Payment>`.
4. Add a test: "recording a deposit larger than the balance remaining is rejected."
5. Run through the self-check list above.
