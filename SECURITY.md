# Security Policy

## Reporting

Do not open a public issue for a suspected vulnerability. Contact
`indhujabusiness@gmail.com` with reproduction steps and affected versions.

## Implemented controls

- scrypt password hashing with per-password random salts
- short-lived access tokens and rotating, revocable HTTP-only refresh cookies
- authentication rate limiting and Zod input validation
- Helmet security headers, explicit CORS origin, and request size limits
- account-scoped database access for all recruitment records
- in-memory resume processing with MIME and 2 MB size restrictions
- generic production error messages and request correlation identifiers
- AI fallback, audit metadata, and no autonomous candidate rejection
- automated dependency auditing through CI and Dependabot

## Secret handling

Real credentials belong only in the ignored `.env` file or deployment secret manager.
Never commit API keys, database credentials, OAuth secrets, or populated environment files.
Rotate any credential that is accidentally shared in source control or chat.

## Production checklist

- use unique secrets of at least 32 random characters
- use HTTPS and set `NODE_ENV=production`
- restrict MongoDB network access and create a least-privilege database user
- verify the Resend sending domain before enabling transactional email
- configure OAuth redirect URIs exactly for the deployed API origin
- replace development direct password reset with email/OTP verification
