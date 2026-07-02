---
trigger: always_on
---

# Security Rules — Tailr

These rules are non-negotiable. Tailr stores personal customer data (names, phone
numbers, addresses, body measurements) and financial data (deposits, balances) for
small business owners who are trusting the platform with their livelihood. Security
shortcuts are not acceptable even for "MVP speed."

## Authentication
- Passwords must be hashed before storage using a strong, slow hash function
  (e.g. bcrypt or argon2) — never store plaintext, never use a fast/general-purpose
  hash like MD5 or SHA-256 alone for passwords.
- Never log passwords, tokens, or session secrets — not even at debug level.
- Password reset flow must use a single-use, time-limited token sent via email
  (Nodemailer) — never email the password itself, and never allow a reset link to
  be reused after it's been consumed.
- Session/auth tokens must be stored in HTTP-only, secure cookies — never in
  `localStorage` or `sessionStorage` where they're accessible to JavaScript/XSS.
- Enforce a reasonable minimum password policy (length at minimum; complexity rules
  are optional but length matters most) and communicate it clearly in plain
  language on the signup form.

## Authorization & Data Isolation
- **Every** database query touching Customer, Measurement, Order, Payment, or
  Delivery data must be scoped to the authenticated vendor's `id`. This check
  happens inside the Server Action / data-access layer — never solely in the UI or
  route-level middleware.
- Before performing any update/delete on a record (Customer, Order, etc.), verify
  the record's `vendorId` (directly or via its related Customer) matches the
  current session's vendor. Do not trust an ID passed from the client without this
  check, even if the ID came from the app's own UI.
- Treat every Server Action as a potential direct-invocation target — assume a
  malicious actor could call it with arbitrary IDs, not just through your UI.

## Input Validation
- All user input is validated server-side with Zod (or equivalent) before touching
  the database — client-side validation is a UX nicety, not a security boundary.
- Validate types, lengths, and formats (e.g. phone number format, email format,
  numeric fields for measurements/amounts) — reject rather than silently coerce
  malformed input.
- Reject delivery dates in the past at the server level, not just in the UI
  (per the business rules in `AGENTS.md`).

## Injection & XSS Prevention
- Use Prisma's query builder for all database access — never construct raw SQL
  via string concatenation or interpolation with user input. If raw SQL is ever
  unavoidable, use parameterized queries only, and flag it for review.
- Never use `dangerouslySetInnerHTML` with user-provided content (special
  instructions, customer notes, etc.). React's default escaping is the baseline
  protection against XSS — don't bypass it for convenience.
- Sanitize/validate any data before it's used to construct file paths, email
  content, or external URLs.

## Transport & Infrastructure
- HTTPS only in production (Vercel provides this by default — don't disable or
  bypass it).
- All secrets (database URL, email service credentials, session secret) live in
  environment variables, never hardcoded in source, never committed to git.
- `.env` and any file containing secrets must be in `.gitignore` from the very
  first commit.

## Data Handling
- Treat customer measurements and contact details as sensitive personal data —
  don't expose them in URLs (e.g. query strings), client-side analytics, or
  third-party logging tools.
- Don't include full customer records (name + phone + address + measurements) in
  error messages, logs, or any output that could be exposed beyond the
  authenticated vendor.
- When displaying error states to users, never reveal whether a specific email
  exists in the system (e.g. login errors should say "incorrect email or password,"
  not "no account found with that email" — the latter helps attackers enumerate
  accounts).

## Rate Limiting & Abuse Prevention
- Apply basic rate limiting to authentication endpoints (login, password reset
  request) to reduce brute-force and email-bombing risk. This can be a simple
  in-memory/Vercel-edge-compatible limiter for MVP, but it must exist — don't ship
  auth endpoints with zero throttling.

## Dependency Hygiene
- Don't add a new npm package without checking it's actively maintained and from a
  reputable source. Avoid unnecessary dependencies — every package is attack
  surface.
- Keep Prisma, Next.js, and auth-related packages reasonably current; flag known
  vulnerabilities rather than silently ignoring `npm audit` warnings.

## What NOT to Do
- Don't store sensitive data unencrypted "temporarily" during development with the
  intent to fix it later — build it correctly from the start.
- Don't disable TypeScript/ESLint security-relevant warnings to ship faster.
- Don't trust any identifier (customerId, orderId, vendorId) coming from client
  input without re-verifying ownership server-side.
- Don't roll a custom crypto/hashing implementation — use well-established
  libraries only.
