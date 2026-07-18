# RecruiterAI OS

RecruiterAI OS is an AI-assisted recruitment platform being built as a production-minded
MERN and AI engineering portfolio project. It will cover the hiring lifecycle from job
creation and public applications through explainable resume matching, screening,
scheduling, interview feedback, and recruitment analytics.

> Current status: optimized full-stack foundation with authentication, job management, and
> a MongoDB-backed candidate pipeline with secure resume text extraction. The public landing
> page remains available to signed-out visitors while product workflows are implemented
> branch by branch.

## Technology

- React, TypeScript, Vite, Radix UI, and Framer Motion
- Node.js, Express, TypeScript, MongoDB, and Mongoose
- Shared Zod request and response contracts
- Gemini integration with a deterministic matching fallback
- Vitest, Supertest, React Testing Library, and Playwright
- Docker Compose for local services and GitHub Actions for CI

## Workspace

```text
apps/
  api/          Express API
  web/          React application
packages/
  config/       Shared TypeScript configuration
  contracts/    Shared API schemas and types
```

## Local setup

Requirements: Node.js 22+, npm 11+, and Docker.

```bash
cp .env.example .env
npm install
npm run services:up
npm run dev
```

- Web: `http://localhost:5173`
- API health: `http://localhost:4000/api/v1/health`

Real credentials belong only in `.env`, which is excluded from git. The application will
retain deterministic and local fallbacks so optional providers do not block core flows.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Create a populated local demo after configuring `.env`:

```bash
npm run seed
```

The seed is idempotent and creates an administrator, published AI engineering role,
candidate, explainable match, and upcoming structured interview. Use `SEED_ADMIN_EMAIL`
and `SEED_DEMO_PASSWORD` to sign in.

## Authentication API

The first product slice provides MongoDB-backed account and session operations:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`

Passwords use Node.js scrypt with unique salts. Refresh tokens are signed, HTTP-only,
rotated on use, and revoked on logout; access tokens are short-lived and kept in browser
memory. Authentication endpoints also include schema validation and rate limiting.

## Job management API

Authenticated recruiters can create and manage account-scoped job requisitions:

- `GET /api/v1/jobs`
- `POST /api/v1/jobs`
- `PATCH /api/v1/jobs/:jobId`

The shared contracts validate job details, salary ranges, employment/workplace types, and
the draft, published, paused, and closed lifecycle. Every database query is scoped to the
authenticated owner before job data is returned or changed.

## Candidate and resume API

Recruiters can upload PDF or plain-text resumes, assign candidates to jobs, and manage the
hiring pipeline:

- `GET /api/v1/candidates`
- `POST /api/v1/candidates` (multipart form with a maximum 2 MB resume)
- `PATCH /api/v1/candidates/:candidateId/status`

Uploads are processed in memory with free open-source tooling. The original resume file is
discarded after extraction; only normalized text, a short preview, and auditable file
metadata are retained. Candidate and job lookups are account-scoped, and duplicate
candidate/job assignments are rejected.

## Explainable AI matching

Recruiters can generate evidence-based job-fit analyses with `POST
/api/v1/matches/candidates/:candidateId` and retrieve saved analyses from `GET
/api/v1/matches`. When `GEMINI_API_KEY` is configured, the API requests structured output
from the configured Gemini model. If Gemini is unavailable or quota-limited, a deterministic
skill-overlap and keyword-coverage algorithm produces the same typed response shape.

Every result includes a score, strengths, gaps, rationale, model/source metadata, and a clear
human-review recommendation. Match scores provide decision support only and never trigger
autonomous rejection.

## Interview operations

The authenticated workspace supports structured interview scheduling and evaluation:

- `GET /api/v1/interviews`
- `POST /api/v1/interviews`
- `PATCH /api/v1/interviews/:interviewId/status`
- `PUT /api/v1/interviews/:interviewId/feedback`

Scheduling generates a stage-aware five-question interview kit grounded in the assigned
job skills and moves eligible candidates into the interview stage. Recruiters can store
meeting links, complete or cancel sessions, and submit consistent ratings, recommendations,
strengths, concerns, and notes. Scheduling remains fully usable with the local calendar
fallback when Google Calendar is not connected.

Interview cards include a free Google Calendar add-event link. When `RESEND_API_KEY` and
`EMAIL_FROM` are configured, scheduling also sends the candidate a transactional invitation;
delivery failure is recorded but never blocks the locally persisted schedule.

## Recruitment analytics

`GET /api/v1/analytics/overview` provides account-scoped operational reporting without
returning candidate PII. The dashboard visualizes active roles, candidate funnel stages,
job demand, match-engine coverage and source, interview completion, feedback coverage, and
average interviewer ratings. Charts use lightweight responsive CSS and require no paid
analytics or visualization service.

## Git workflow

`main` contains releases, `develop` is the integration branch, and each bounded feature is
built on a `codex/feature-*` or `codex/chore-*` branch with Conventional Commits. Branches
are pushed only after local review and approval.

## Product principles

- AI produces explainable decision support, not autonomous rejection decisions.
- Authorization and tenant isolation are enforced by the API.
- Marketing and compliance claims must be demonstrable and documented.
- Candidate data is handled as sensitive personal information.
- Every core workflow remains usable when an optional external provider is unavailable.

## Documentation

- [Architecture and trust boundaries](docs/ARCHITECTURE.md)
- [API reference](docs/API.md)
- [Render deployment guide](docs/DEPLOYMENT.md)
- [Security policy](SECURITY.md)

## Author

Indhuja Elumalai — [GitHub](https://github.com/indhuja-elumalai) ·
[LinkedIn](https://www.linkedin.com/in/indhuja-elumalai/) ·
[Email](mailto:indhujabusiness@gmail.com)
