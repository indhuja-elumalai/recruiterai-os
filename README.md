# RecruiterAI OS

RecruiterAI OS is an AI-assisted recruitment platform being built as a production-minded
MERN and AI engineering portfolio project. It will cover the hiring lifecycle from job
creation and public applications through explainable resume matching, screening,
scheduling, interview feedback, and recruitment analytics.

> Current status: foundation in progress. The existing public landing page is preserved;
> authenticated product workflows are being implemented branch by branch.

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

## Author

Indhuja Elumalai — [GitHub](https://github.com/indhuja-elumalai) ·
[LinkedIn](https://www.linkedin.com/in/indhuja-elumalai/) ·
[Email](mailto:indhujabusiness@gmail.com)
